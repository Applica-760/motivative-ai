import type { GridItemConfig, GridPosition } from '../types';

/**
 * order順にグリッド位置を計算するヘルパー関数
 * 各ウィジェットに明示的な位置を割り当てる
 * 
 * @param items - ソート済みのグリッドアイテムのリスト
 * @param columns - グリッドの列数（デフォルト: 4）
 * @returns 更新された位置情報を持つグリッドアイテムのリスト
 */
export function assignGridPositions(
  items: GridItemConfig[],
  columns: number = 4
): GridItemConfig[] {
  let currentRow = 1;
  let currentColumn = 1;

  return items.map((item) => {
    const columnSpan = item.size === 'small-rectangle' ? 2 : 1;

    if (currentColumn + columnSpan - 1 > columns) {
      currentRow++;
      currentColumn = 1;
    }

    const position: GridPosition = {
      column: currentColumn,
      row: currentRow,
      columnSpan: columnSpan as 1 | 2,
    };

    currentColumn += columnSpan;
    if (currentColumn > columns) {
      currentRow++;
      currentColumn = 1;
    }

    return { ...item, position };
  });
}

/**
 * 初期設定用: order順に基本的な位置を割り当てるヘルパー
 * 開発者がウィジェット設定時に位置を計算するために使用
 * 
 * @param baseOrder - 開始order番号
 * @param size - ウィジェットのサイズ
 * @param columns - グリッドの列数
 * @returns 計算されたGridPosition
 */
export function createGridPosition(
  baseOrder: number,
  size: 'small-square' | 'small-rectangle',
  columns: number = 4
): GridPosition {
  const columnSpan = size === 'small-rectangle' ? 2 : 1;
  let row = 1;
  let column = 1;
  
  for (let i = 0; i < baseOrder; i++) {
    column += columnSpan;
    if (column > columns) {
      row++;
      column = 1;
    }
  }
  
  return { column, row, columnSpan: columnSpan as 1 | 2 };
}
