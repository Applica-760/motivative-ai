import type { GridPosition, GridItemConfig, SavedLayout } from '../../types';

/**
 * 初期アイテムと保存されたレイアウトから復元されたアイテムを生成
 * 
 * @param initialItems - 初期アイテムの配列
 * @param savedLayout - 保存されたレイアウト（nullの場合は初期アイテムをそのまま返す）
 * @returns 復元されたアイテムの配列
 */
export function initializeItemsFromStorage(
  initialItems: GridItemConfig[],
  savedLayout: SavedLayout | null
): GridItemConfig[] {
  if (!savedLayout) return initialItems;

  return initialItems.map(item => ({
    ...item,
    position: savedLayout.positions[item.id] || item.position,
  }));
}

/**
 * グリッドアイテムの配列からSavedLayoutを作成
 * 
 * @param items - グリッドアイテムの配列
 * @returns SavedLayout
 */
export function createLayoutFromItems(items: GridItemConfig[]): SavedLayout {
  return {
    positions: items.reduce((acc, item) => {
      acc[item.id] = item.position;
      return acc;
    }, {} as Record<string, GridPosition>),
  };
}
