import type { GridPosition, GridItemConfig } from '../../types';

/**
 * 位置が他のアイテムと衝突するかチェック
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
  return items.some(item => {
    if (item.id === itemId || item.position.row !== newPosition.row) return false;
    
    const itemEnd = item.position.column + item.position.columnSpan - 1;
    const newEnd = newPosition.column + newPosition.columnSpan - 1;
    
    return (
      (newPosition.column >= item.position.column && newPosition.column <= itemEnd) ||
      (newEnd >= item.position.column && newEnd <= itemEnd) ||
      (newPosition.column <= item.position.column && newEnd >= itemEnd)
    );
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
 * 境界チェックを含む
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
    column: adjustColumn({ ...overItem.position, columnSpan: activeItem.position.columnSpan }),
  };
  
  const overPosition: GridPosition = {
    ...activeItem.position,
    columnSpan: overItem.position.columnSpan,
    column: adjustColumn({ ...activeItem.position, columnSpan: overItem.position.columnSpan }),
  };

  return { activePosition, overPosition };
}
