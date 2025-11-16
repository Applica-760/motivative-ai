import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useStorage } from '@/shared/services/storage';
import type { StorageService } from '@/shared/services/storage';
import type { GridItemConfig, GridPosition, SavedLayout } from '../types';
import { STORAGE_KEYS } from '@/shared/config/storage';
import {
  initializeItemsFromStorage,
  createLayoutFromItems,
  updateItemInList,
  syncInitialItems,
  swapItemsInList,
} from '../model/layout';
import {
  isWithinBounds,
  checkCollision,
  calculateSwapPositions,
} from '../model/calculations';

/**
 * useGridLayoutのオプション
 */
export interface UseGridLayoutOptions {
  /** グリッドの列数（デフォルト: 4） */
  columns?: number;
  /** StorageServiceインスタンス（省略時はuseStorage()を使用） */
  storageService?: StorageService;
}

/**
 * グリッドレイアウトの状態管理フック
 * 
 * StorageServiceを使用してレイアウトを永続化する。
 * ログイン状態に応じてLocalStorage/Firebaseが自動切り替えされる。
 * 
 * @param initialItems - 初期グリッドアイテム
 * @param options - オプション設定
 * @returns items, updateItemPosition, swapItems, isLoading
 */
export function useGridLayout(
  initialItems: GridItemConfig[],
  options: UseGridLayoutOptions = {}
) {
  const { columns = 4, storageService } = options;
  
  // StorageServiceが明示的に渡されなければuseStorage()を使用
  const defaultStorage = useStorage();
  const storage = storageService || defaultStorage;
  
  // ストレージからの読み込み完了を待つため、初期値はnull
  const [items, setItems] = useState<GridItemConfig[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // initialItemsの最新の参照を保持
  const initialItemsRef = useRef(initialItems);
  initialItemsRef.current = initialItems;
  
  // 初期アイテムのIDリストとサイズ情報をメモ化（アイテム構成の変更検知用）
  const initialItemsSignature = useMemo(
    () => initialItems.map(item => 
      `${item.id}:${item.position.columnSpan}:${item.position.rowSpan || 1}`
    ).sort().join(','),
    [initialItems]
  );
  
  // 初期読み込み：ストレージを優先
  useEffect(() => {
    const layoutKeyForColumns = (cols: number) => `${STORAGE_KEYS.GRID_LAYOUT_ORDER}-${cols}col`;

    const parseSavedLayout = (data: string | null): SavedLayout | null => {
      if (!data) return null;
      try {
        return JSON.parse(data) as SavedLayout;
      } catch {
        return null;
      }
    };

    // 読み順で並べ替え（row→column）
    const sortByReadingOrder = (items: GridItemConfig[], baseLayout?: SavedLayout | null) => {
      const positions = baseLayout?.positions;
      return [...items].sort((a, b) => {
        const pa = positions?.[a.id] ?? a.position;
        const pb = positions?.[b.id] ?? b.position;
        if (pa.row !== pb.row) return pa.row - pb.row;
        return pa.column - pb.column;
      });
    };

    // rowSpan/columnSpanを考慮した貪欲配置
    const reflowItems = (inputItems: GridItemConfig[], cols: number): GridItemConfig[] => {
      const placed: GridItemConfig[] = [];
      for (const item of inputItems) {
        const rowSpan = item.position.rowSpan ?? 1;
        const columnSpan = item.position.columnSpan ?? (item.size === 'small-rectangle' ? 2 : 1);

        let placedItem: GridItemConfig | null = null;
        // 探索上限: 現在の最大行+十分なマージン（items数×rowSpan程度）
        const maxSearchRow = (placed.length + 1) * (rowSpan || 1) + 50;
        outer: for (let r = 1; r <= maxSearchRow; r++) {
          for (let c = 1; c <= Math.max(1, cols - columnSpan + 1); c++) {
            const candidate: GridPosition = { column: c, row: r, columnSpan: columnSpan as 1 | 2, rowSpan };
            if (!isWithinBounds(candidate, cols)) continue;
            if (checkCollision(candidate, item.id, placed)) continue;
            placedItem = { ...item, position: candidate };
            break outer;
          }
        }
        placed.push(placedItem ?? { ...item });
      }
      return placed;
    };

    const loadLayout = async () => {
      console.log('[useGridLayout] Starting layout load, storage:', storage.constructor.name, 'columns:', columns);
      setIsLoading(true);
      try {
        // 1) 列数別のカスタムデータから読み込み
        const key = layoutKeyForColumns(columns);
        const customData = await storage.getCustomData(key);
        const columnScopedLayout = parseSavedLayout(customData);

        if (columnScopedLayout) {
          const restored = initializeItemsFromStorage(initialItemsRef.current, columnScopedLayout);
          setItems(restored);
          console.log('[useGridLayout] Restored from column-scoped layout:', key);
          return;
        }

        // 2) 旧レイアウト（共通キー）をフォールバックで読み込み、現在列数にリフロー
        const legacyLayout = await storage.getGridLayout();
        let baseItemsForOrder = initialItemsRef.current;
        if (legacyLayout) {
          // 読み順は旧レイアウトのrow/columnを採用
          baseItemsForOrder = sortByReadingOrder(initialItemsRef.current, legacyLayout);
        } else {
          // 初期のposition順で読み順
          baseItemsForOrder = sortByReadingOrder(initialItemsRef.current);
        }

        const reflowed = reflowItems(baseItemsForOrder, columns);
        setItems(reflowed);

        // 新フォーマットで保存（列数別）+ 互換のため旧キーにも保存
        const layoutToSave = createLayoutFromItems(reflowed);
        await storage.setCustomData(key, JSON.stringify(layoutToSave));
        await storage.saveGridLayout(layoutToSave);
        console.log('[useGridLayout] Reflowed and saved new column-scoped layout:', key);
      } catch (error) {
        console.error('[useGridLayout] Failed to load layout, using initialItems:', error);
        setItems(initialItemsRef.current);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayout();
    // storage/initialItemsSignature/columns が変わった時のみ再読み込み
  }, [storage, initialItemsSignature, columns]);

  // アイテムの位置を更新（ドラッグ&ドロップ用）
  const updateItemPosition = useCallback(
    (itemId: string, newPosition: GridPosition) => {
      setItems((currentItems) => {
        // ローディング中は更新しない
        if (!currentItems || !isWithinBounds(newPosition, columns) || 
            checkCollision(newPosition, itemId, currentItems)) {
          return currentItems;
        }

        const newItems = updateItemInList(currentItems, itemId, newPosition);
        console.log('[useGridLayout] Updating position for', itemId, ':', newPosition);
        const layout = createLayoutFromItems(newItems);
        const key = `${STORAGE_KEYS.GRID_LAYOUT_ORDER}-${columns}col`;
        Promise.all([
          storage.saveGridLayout(layout), // 互換
          storage.setCustomData(key, JSON.stringify(layout)), // 列数別
        ])
          .then(() => console.log('[useGridLayout] Successfully saved layout (legacy + column-scoped)'))
          .catch((error) => console.error('[useGridLayout] Failed to save layout:', error));
        return newItems;
      });
    },
    [storage, columns]
  );

  // 2つのアイテムの位置を入れ替え（スワップ）
  const swapItems = useCallback(
    (activeId: string, overId: string) => {
      setItems((currentItems) => {
        // ローディング中は更新しない
        if (!currentItems) return currentItems;
        
        const activeItem = currentItems.find((item) => item.id === activeId);
        const overItem = currentItems.find((item) => item.id === overId);

        if (!activeItem || !overItem) return currentItems;

        const swapResult = calculateSwapPositions(activeItem, overItem, columns);
        if (!swapResult) return currentItems;

        const newItems = swapItemsInList(
          currentItems,
          activeId,
          overId,
          swapResult.activePosition,
          swapResult.overPosition
        );

        console.log('[useGridLayout] Swapping items', activeId, 'and', overId);
        const layout = createLayoutFromItems(newItems);
        const key = `${STORAGE_KEYS.GRID_LAYOUT_ORDER}-${columns}col`;
        Promise.all([
          storage.saveGridLayout(layout),
          storage.setCustomData(key, JSON.stringify(layout)),
        ])
          .then(() => console.log('[useGridLayout] Successfully saved swapped layout (legacy + column-scoped)'))
          .catch((error) => console.error('[useGridLayout] Failed to save swapped layout:', error));
        return newItems;
      });
    },
    [storage, columns]
  );

  // 初期アイテムが変更された場合の同期処理
  useEffect(() => {
    // ローディング中は同期しない
    if (isLoading) return;
    
    setItems((currentItems) => {
      // currentItemsがnullの場合は同期しない
      if (!currentItems) return currentItems;
      
      console.log('[useGridLayout] Syncing with initialItems');
      const syncedItems = syncInitialItems(currentItems, initialItemsRef.current);
      if (syncedItems === null) {
        console.log('[useGridLayout] No changes detected, skipping sync');
        return currentItems;
      }

      console.log('[useGridLayout] Items synced, saving to storage');
      storage.saveGridLayout(createLayoutFromItems(syncedItems))
        .then(() => console.log('[useGridLayout] Successfully saved synced layout'))
        .catch((error) => console.error('[useGridLayout] Failed to save synced layout:', error));
      return syncedItems;
    });
    // initialItemsSignatureを使用して、アイテム構成が実際に変わった時のみ実行
  }, [initialItemsSignature, storage, isLoading]);

  return {
    items: items || [], // nullの場合は空配列を返す
    isLoading,
    updateItemPosition,
    swapItems,
  };
}
