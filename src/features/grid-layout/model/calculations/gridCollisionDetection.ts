import type { GridPosition, GridItemConfig } from '../../types';

/**
 * 位置が他のアイテムと衝突するかチェック
 * columnSpanとrowSpanの両方を考慮した2D衝突判定
 * 
 * @param newPosition - チェックする位置
 * @param itemId - 現在のアイテムID（自分自身は除外）
 * @param items - すべてのグリッドアイテム
 * @returns 衝突がある場合は true
 */
export function checkCollision(
  newPosition: GridPosition,
  itemId: string,
  items: GridItemConfig[]
): boolean {
  const newRowSpan = newPosition.rowSpan || 1;
  const newRowEnd = newPosition.row + newRowSpan - 1;
  const newColEnd = newPosition.column + newPosition.columnSpan - 1;

  return items.some(item => {
    if (item.id === itemId) return false;
    
    const itemRowSpan = item.position.rowSpan || 1;
    const itemRowEnd = item.position.row + itemRowSpan - 1;
    const itemColEnd = item.position.column + item.position.columnSpan - 1;
    
    // 行方向の重なりチェック
    const rowOverlap = !(newPosition.row > itemRowEnd || newRowEnd < item.position.row);
    
    // 列方向の重なりチェック
    const colOverlap = !(newPosition.column > itemColEnd || newColEnd < item.position.column);
    
    // 両方が重なっている場合は衝突
    return rowOverlap && colOverlap;
  });
}

/**
 * 位置がグリッドの境界内かチェック
 * 
 * @param position - チェックする位置
 * @param columns - グリッドの列数
 * @returns 境界内の場合は true
 */
export function isWithinBounds(
  position: GridPosition,
  columns: number
): boolean {
  return position.column >= 1 && 
         position.column + position.columnSpan - 1 <= columns;
}

/**
 * 2つのアイテムの位置を入れ替える際の新しい位置を計算
 * 境界チェックを含む（columnSpanとrowSpanを保持）
 * 
 * @param activeItem - ドラッグ中のアイテム
 * @param overItem - ドロップ先のアイテム
 * @param columns - グリッドの列数
 * @returns 入れ替え後の位置情報、または null（入れ替え不可の場合）
 */
export function calculateSwapPositions(
  activeItem: GridItemConfig,
  overItem: GridItemConfig,
  columns: number
): { activePosition: GridPosition; overPosition: GridPosition } | null {
  const adjustColumn = (pos: GridPosition): number =>
    isWithinBounds(pos, columns) ? pos.column : columns - pos.columnSpan + 1;

  const activePosition: GridPosition = {
    ...overItem.position,
    columnSpan: activeItem.position.columnSpan,
    rowSpan: activeItem.position.rowSpan,
    column: adjustColumn({ ...overItem.position, columnSpan: activeItem.position.columnSpan }),
  };
  
  const overPosition: GridPosition = {
    ...activeItem.position,
    columnSpan: overItem.position.columnSpan,
    rowSpan: overItem.position.rowSpan,
    column: adjustColumn({ ...activeItem.position, columnSpan: overItem.position.columnSpan }),
  };

  return { activePosition, overPosition };
}
