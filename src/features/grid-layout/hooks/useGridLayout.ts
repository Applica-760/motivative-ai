import { useState, useEffect, useCallback } from 'react';
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
 * @returns items, updateItemPosition, swapItems
 */
export function useGridLayout(
  initialItems: GridItemConfig[],
  options: UseGridLayoutOptions = {}
) {
  const { columns = 4, storageService } = options;
  
  // StorageServiceが明示的に渡されなければuseStorage()を使用
  const defaultStorage = useStorage();
  const storage = storageService || defaultStorage;
  
  // 初期化時にストレージから復元
  const [items, setItems] = useState<GridItemConfig[]>(() =>
    initialItems
  );
  
  // 初期読み込み
  useEffect(() => {
    const loadLayout = async () => {
      try {
        const savedLayout = await storage.getGridLayout();
        const restoredItems = initializeItemsFromStorage(initialItems, savedLayout);
        setItems(restoredItems);
      } catch {
        setItems(initialItems);
      }
    };
    
    loadLayout();
  }, [storage]);

  // アイテムの位置を更新（ドラッグ&ドロップ用）
  const updateItemPosition = useCallback(
    (itemId: string, newPosition: GridPosition) => {
      setItems((currentItems) => {
        if (!isWithinBounds(newPosition, columns) || 
            checkCollision(newPosition, itemId, currentItems)) {
          return currentItems;
        }

        const newItems = updateItemInList(currentItems, itemId, newPosition);
        storage.saveGridLayout(createLayoutFromItems(newItems)).catch(() => {});
        return newItems;
      });
    },
    [storage, columns]
  );

  // 2つのアイテムの位置を入れ替え（スワップ）
  const swapItems = useCallback(
    (activeId: string, overId: string) => {
      setItems((currentItems) => {
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

        storage.saveGridLayout(createLayoutFromItems(newItems)).catch(() => {});
        return newItems;
      });
    },
    [storage, columns]
  );

  // 初期アイテムが変更された場合の同期処理
  useEffect(() => {
    setItems((currentItems) => {
      const syncedItems = syncInitialItems(currentItems, initialItems);
      if (syncedItems === null) return currentItems;

      storage.saveGridLayout(createLayoutFromItems(syncedItems)).catch(() => {});
      return syncedItems;
    });
  }, [initialItems, storage]);

  return {
    items,
    updateItemPosition,
    swapItems,
  };
}
