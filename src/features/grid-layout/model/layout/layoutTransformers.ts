import type { GridPosition, GridItemConfig, SavedLayout } from '../../types';

/**
 * 初期アイテムと保存されたレイアウトから復元されたアイテムを生成
 * 
 * 保存された位置（column, row）を復元しつつ、
 * initialItemsのcolumnSpan、rowSpanは常に優先して使用する。
 * これにより、アイテムのサイズ変更（例: rowSpan追加）が正しく反映される。
 * 
 * rowSpanがundefinedの場合は、ビジネスロジックとしてデフォルト値(1)を使用。
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

  return initialItems.map(item => {
    const savedPosition = savedLayout.positions[item.id];
    
    if (!savedPosition) {
      return item;
    }
    
    // 位置（column, row）は保存データから復元
    // サイズ（columnSpan, rowSpan）は常にinitialItemsの値を使用
    // rowSpanがundefinedの場合はデフォルト値(1)を使用（ビジネスロジック）
    return {
      ...item,
      position: {
        column: savedPosition.column,
        row: savedPosition.row,
        columnSpan: item.position.columnSpan,
        rowSpan: item.position.rowSpan ?? 1,
      },
    };
  });
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
