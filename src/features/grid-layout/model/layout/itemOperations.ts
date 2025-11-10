import type { GridPosition, GridItemConfig } from '../../types';

/**
 * アイテムリスト内の特定アイテムの位置を更新
 * 
 * @param items - 現在のアイテムリスト
 * @param itemId - 更新するアイテムのID
 * @param newPosition - 新しい位置
 * @returns 更新されたアイテムリスト
 */
export function updateItemInList(
  items: GridItemConfig[],
  itemId: string,
  newPosition: GridPosition
): GridItemConfig[] {
  return items.map(item => 
    item.id === itemId ? { ...item, position: newPosition } : item
  );
}

/**
 * 2つのアイテムの位置を入れ替える
 * 
 * @param items - 現在のアイテムリスト
 * @param activeId - ドラッグ中のアイテムID
 * @param overId - ドロップ先のアイテムID
 * @param activePosition - ドラッグ中のアイテムの新しい位置
 * @param overPosition - ドロップ先のアイテムの新しい位置
 * @returns 更新されたアイテムリスト
 */
export function swapItemsInList(
  items: GridItemConfig[],
  activeId: string,
  overId: string,
  activePosition: GridPosition,
  overPosition: GridPosition
): GridItemConfig[] {
  return items.map(item => {
    if (item.id === activeId) return { ...item, position: activePosition };
    if (item.id === overId) return { ...item, position: overPosition };
    return item;
  });
}

/**
 * 初期アイテムとの同期
 * 新しいアイテムが追加された場合や削除された場合に対応
 * 
 * @param currentItems - 現在のアイテム
 * @param initialItems - 初期アイテム
 * @returns 同期されたアイテム、変更がない場合はnull
 */
export function syncInitialItems(
  currentItems: GridItemConfig[],
  initialItems: GridItemConfig[]
): GridItemConfig[] | null {
  const currentIds = new Set(currentItems.map(item => item.id));

  // 変更がない場合はnullを返す（再レンダリング防止）
  if (
    currentItems.length === initialItems.length &&
    initialItems.every(item => currentIds.has(item.id))
  ) {
    return null;
  }

  // 既存アイテムは位置を保持、新しいアイテムは初期位置を使用
  return initialItems.map(initialItem => {
    const existingItem = currentItems.find(item => item.id === initialItem.id);
    return existingItem || initialItem;
  });
}
