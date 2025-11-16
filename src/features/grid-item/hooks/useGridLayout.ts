import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useStorage } from '@/shared/services/storage';
import type { StorageService } from '@/shared/services/storage';
import type { GridItemConfig, GridPosition } from '../types';
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
    const loadLayout = async () => {
      console.log('[useGridLayout] Starting layout load, storage:', storage.constructor.name);
      setIsLoading(true);
      try {
        const savedLayout = await storage.getGridLayout();
        console.log('[useGridLayout] Loaded layout from storage:', savedLayout);
        const restoredItems = initializeItemsFromStorage(initialItemsRef.current, savedLayout);
        console.log('[useGridLayout] Restored items:', restoredItems.map(i => ({ id: i.id, pos: i.position })));
        setItems(restoredItems);
      } catch (error) {
        // ストレージからの読み込みに失敗した場合のみinitialItemsを使用
        console.error('[useGridLayout] Failed to load layout, using initialItems:', error);
        setItems(initialItemsRef.current);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLayout();
    // storageとinitialItemsSignatureが変わった時のみ再読み込み
  }, [storage, initialItemsSignature]);

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
        storage.saveGridLayout(createLayoutFromItems(newItems))
          .then(() => console.log('[useGridLayout] Successfully saved layout'))
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
        storage.saveGridLayout(createLayoutFromItems(newItems))
          .then(() => console.log('[useGridLayout] Successfully saved swapped layout'))
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
