import { GRID_CONFIG } from '../../config/gridConstants';
import type { GridPosition, GridItemConfig, CellSize } from '../../types';

/**
 * グリッドセルサイズを計算する純粋関数
 * 
 * @param gridWidth - グリッドコンテナの幅（px）
 * @param columns - グリッドの列数
 * @param gap - グリッド間のギャップ（px）
 * @returns セルの幅と高さ（正方形）
 */
export function calculateCellSize(
  gridWidth: number,
  columns: number,
  gap: number = GRID_CONFIG.GAP
): CellSize {
  const cellWidth = (gridWidth - gap * (columns - 1)) / columns;
  return { width: cellWidth, height: cellWidth };
}

/**
 * ドラッグ移動量から新しいグリッド位置を計算
 * 
 * @param currentPosition - 現在の位置
 * @param delta - ドラッグによる移動量（px）
 * @param cellSize - セルサイズ
 * @param columns - グリッドの列数
 * @param gap - グリッド間のギャップ（px）
 * @returns 新しい位置
 */
export function calculateNewPosition(
  currentPosition: GridPosition,
  delta: { x: number; y: number },
  cellSize: CellSize,
  columns: number,
  gap: number = GRID_CONFIG.GAP
): GridPosition {
  const columnDelta = Math.round(delta.x / (cellSize.width + gap));
  const rowDelta = Math.round(delta.y / (cellSize.height + gap));
  
  const newColumn = Math.max(
    1,
    Math.min(
      columns - currentPosition.columnSpan + 1,
      currentPosition.column + columnDelta
    )
  );
  const newRow = Math.max(1, currentPosition.row + rowDelta);
  
  return {
    column: newColumn,
    row: newRow,
    columnSpan: currentPosition.columnSpan,
  };
}

/**
 * グリッドコンテナの高さを計算
 * 最下行のアイテムに基づいて高さを決定
 * 
 * @param items - グリッドアイテムの配列
 * @param cellHeight - セルの高さ（px）
 * @param gap - グリッド間のギャップ（px）
 * @returns コンテナの高さ（px）または 'auto'
 */
export function calculateContainerHeight(
  items: GridItemConfig[],
  cellHeight: number,
  gap: number = GRID_CONFIG.GAP
): number | 'auto' {
  if (items.length === 0 || cellHeight === 0) return 'auto';
  
  const maxRow = Math.max(...items.map(item => item.position.row));
  return maxRow * cellHeight + (maxRow - 1) * gap;
}

/**
 * グリッドアイテムの絶対配置スタイルを計算
 * 
 * @param position - グリッド位置
 * @param cellSize - セルサイズ
 * @param gap - グリッド間のギャップ（px）
 * @returns 絶対配置のためのスタイル値（left, top, width）
 */
export function calculateItemPosition(
  position: GridPosition,
  cellSize: CellSize,
  gap: number = GRID_CONFIG.GAP
): { left: number; top: number; width: number } {
  return {
    left: (position.column - 1) * (cellSize.width + gap),
    top: (position.row - 1) * (cellSize.height + gap),
    width: position.columnSpan * cellSize.width + (position.columnSpan - 1) * gap,
  };
}

/**
 * ドラッグオーバーレイアイテムの幅を計算
 * 
 * @param columnSpan - アイテムの列スパン数
 * @param cellWidth - セルの幅（px）
 * @param gap - グリッド間のギャップ（px）
 * @returns オーバーレイアイテムの幅（px）
 */
export function calculateOverlayWidth(
  columnSpan: number,
  cellWidth: number,
  gap: number = GRID_CONFIG.GAP
): number {
  return columnSpan * cellWidth + (columnSpan - 1) * gap;
}
