import { describe, it, expect } from 'vitest';
import {
  calculateCellSize,
  calculateNewPosition,
  calculateContainerHeight,
  calculateItemPosition,
  calculateOverlaySize,
} from './gridCalculations';
import type { GridPosition, GridItemConfig } from '../../types';

describe('gridCalculations', () => {
  describe('calculateCellSize', () => {
    it('4列グリッドで正しくセルサイズを計算する', () => {
      const gridWidth = 1000;
      const columns = 4;
      const gap = 24;
      
      const result = calculateCellSize(gridWidth, columns, gap);
      
      // (1000 - 24 * 3) / 4 = 928 / 4 = 232
      expect(result.width).toBe(232);
      expect(result.height).toBe(232);
    });

    it('2列グリッド（モバイル）で正しくセルサイズを計算する', () => {
      const gridWidth = 400;
      const columns = 2;
      const gap = 24;
      
      const result = calculateCellSize(gridWidth, columns, gap);
      
      // (400 - 24 * 1) / 2 = 376 / 2 = 188
      expect(result.width).toBe(188);
      expect(result.height).toBe(188);
    });

    it('デフォルトのギャップ値を使用する', () => {
      const gridWidth = 1000;
      const columns = 4;
      
      const result = calculateCellSize(gridWidth, columns);
      
      expect(result.width).toBe(232);
      expect(result.height).toBe(232);
    });

    it('正方形のセルを返す（width === height）', () => {
      const gridWidth = 800;
      const columns = 3;
      
      const result = calculateCellSize(gridWidth, columns);
      
      expect(result.width).toBe(result.height);
    });
  });

  describe('calculateNewPosition', () => {
    const cellSize = { width: 200, height: 200 };
    const gap = 24;

    it('右方向への移動を正しく計算する', () => {
      const currentPosition: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 1,
      };
      const delta = { x: 224, y: 0 }; // 1セル分（200 + 24）
      
      const result = calculateNewPosition(currentPosition, delta, cellSize, 4, gap);
      
      expect(result.column).toBe(2);
      expect(result.row).toBe(1);
      expect(result.columnSpan).toBe(1);
    });

    it('下方向への移動を正しく計算する', () => {
      const currentPosition: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 1,
      };
      const delta = { x: 0, y: 224 }; // 1セル分
      
      const result = calculateNewPosition(currentPosition, delta, cellSize, 4, gap);
      
      expect(result.column).toBe(1);
      expect(result.row).toBe(2);
    });

    it('グリッドの右端を超えないようにする', () => {
      const currentPosition: GridPosition = {
        column: 4,
        row: 1,
        columnSpan: 1,
      };
      const delta = { x: 224, y: 0 }; // 右に1セル移動しようとする
      
      const result = calculateNewPosition(currentPosition, delta, cellSize, 4, gap);
      
      expect(result.column).toBe(4); // 移動しない
      expect(result.row).toBe(1);
    });

    it('columnSpan=2のアイテムで右端を考慮する', () => {
      const currentPosition: GridPosition = {
        column: 3,
        row: 1,
        columnSpan: 2,
      };
      const delta = { x: 224, y: 0 }; // 右に移動しようとする
      
      const result = calculateNewPosition(currentPosition, delta, cellSize, 4, gap);
      
      expect(result.column).toBe(3); // 移動できない（3列目から2スパン = 4列目まで使用）
      expect(result.columnSpan).toBe(2); // スパンは保持
    });

    it('左端（column=1）より左に行かない', () => {
      const currentPosition: GridPosition = {
        column: 1,
        row: 2,
        columnSpan: 1,
      };
      const delta = { x: -224, y: 0 }; // 左に移動しようとする
      
      const result = calculateNewPosition(currentPosition, delta, cellSize, 4, gap);
      
      expect(result.column).toBe(1);
      expect(result.row).toBe(2);
    });

    it('上端（row=1）より上に行かない', () => {
      const currentPosition: GridPosition = {
        column: 2,
        row: 1,
        columnSpan: 1,
      };
      const delta = { x: 0, y: -224 }; // 上に移動しようとする
      
      const result = calculateNewPosition(currentPosition, delta, cellSize, 4, gap);
      
      expect(result.column).toBe(2);
      expect(result.row).toBe(1);
    });

    it('斜め方向の移動を正しく計算する', () => {
      const currentPosition: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 1,
      };
      const delta = { x: 224, y: 224 }; // 右下に移動
      
      const result = calculateNewPosition(currentPosition, delta, cellSize, 4, gap);
      
      expect(result.column).toBe(2);
      expect(result.row).toBe(2);
    });

    it('小さな移動量は四捨五入される', () => {
      const currentPosition: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 1,
      };
      const delta = { x: 100, y: 100 }; // 0.5セル未満
      
      const result = calculateNewPosition(currentPosition, delta, cellSize, 4, gap);
      
      expect(result.column).toBe(1); // 四捨五入で0セル移動
      expect(result.row).toBe(1);
    });
  });

  describe('calculateContainerHeight', () => {
    const cellHeight = 200;
    const gap = 24;

    it('空の配列で"auto"を返す', () => {
      const result = calculateContainerHeight([], cellHeight, gap);
      expect(result).toBe('auto');
    });

    it('cellHeightが0の場合"auto"を返す', () => {
      const items: GridItemConfig[] = [
        {
          id: '1',
          order: 1,
          size: 'small-square',
          position: { column: 1, row: 1, columnSpan: 1 },
          content: null,
        },
      ];
      const result = calculateContainerHeight(items, 0, gap);
      expect(result).toBe('auto');
    });

    it('1行のアイテムで正しい高さを計算する', () => {
      const items: GridItemConfig[] = [
        {
          id: '1',
          order: 1,
          size: 'small-square',
          position: { column: 1, row: 1, columnSpan: 1 },
          content: null,
        },
      ];
      const result = calculateContainerHeight(items, cellHeight, gap);
      
      // 1行 = 200px（ギャップなし）
      expect(result).toBe(200);
    });

    it('2行のアイテムで正しい高さを計算する', () => {
      const items: GridItemConfig[] = [
        {
          id: '1',
          order: 1,
          size: 'small-square',
          position: { column: 1, row: 1, columnSpan: 1 },
          content: null,
        },
        {
          id: '2',
          order: 2,
          size: 'small-square',
          position: { column: 1, row: 2, columnSpan: 1 },
          content: null,
        },
      ];
      const result = calculateContainerHeight(items, cellHeight, gap);
      
      // 2行 = 200 * 2 + 24 * 1 = 424px
      expect(result).toBe(424);
    });

    it('最大行数に基づいて高さを計算する', () => {
      const items: GridItemConfig[] = [
        {
          id: '1',
          order: 1,
          size: 'small-square',
          position: { column: 1, row: 1, columnSpan: 1 },
          content: null,
        },
        {
          id: '2',
          order: 2,
          size: 'small-square',
          position: { column: 2, row: 1, columnSpan: 1 },
          content: null,
        },
        {
          id: '3',
          order: 3,
          size: 'small-square',
          position: { column: 3, row: 5, columnSpan: 1 }, // 5行目
          content: null,
        },
      ];
      const result = calculateContainerHeight(items, cellHeight, gap);
      
      // 5行 = 200 * 5 + 24 * 4 = 1096px
      expect(result).toBe(1096);
    });
  });

  describe('calculateItemPosition', () => {
    const cellSize = { width: 200, height: 200 };
    const gap = 24;

    it('1列1行の位置を計算する', () => {
      const position: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 1,
      };
      
      const result = calculateItemPosition(position, cellSize, gap);
      
      expect(result.left).toBe(0);
      expect(result.top).toBe(0);
      expect(result.width).toBe(200);
    });

    it('2列1行の位置を計算する', () => {
      const position: GridPosition = {
        column: 2,
        row: 1,
        columnSpan: 1,
      };
      
      const result = calculateItemPosition(position, cellSize, gap);
      
      expect(result.left).toBe(224); // (2-1) * (200 + 24)
      expect(result.top).toBe(0);
      expect(result.width).toBe(200);
    });

    it('1列2行の位置を計算する', () => {
      const position: GridPosition = {
        column: 1,
        row: 2,
        columnSpan: 1,
      };
      
      const result = calculateItemPosition(position, cellSize, gap);
      
      expect(result.left).toBe(0);
      expect(result.top).toBe(224); // (2-1) * (200 + 24)
      expect(result.width).toBe(200);
    });

    it('columnSpan=2のアイテムの幅を計算する', () => {
      const position: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 2,
      };
      
      const result = calculateItemPosition(position, cellSize, gap);
      
      expect(result.left).toBe(0);
      expect(result.top).toBe(0);
      expect(result.width).toBe(424); // 200 * 2 + 24 * 1
    });

    it('3列3行、columnSpan=2のアイテムを計算する', () => {
      const position: GridPosition = {
        column: 3,
        row: 3,
        columnSpan: 2,
      };
      
      const result = calculateItemPosition(position, cellSize, gap);
      
      expect(result.left).toBe(448); // (3-1) * (200 + 24)
      expect(result.top).toBe(448); // (3-1) * (200 + 24)
      expect(result.width).toBe(424); // 200 * 2 + 24 * 1
    });
  });

  describe('calculateOverlaySize', () => {
    const cellWidth = 200;
    const cellHeight = 200;
    const gap = 24;

    it('columnSpan=1, rowSpan=1のサイズを計算する', () => {
      const result = calculateOverlaySize(1, 1, cellWidth, cellHeight, gap);
      expect(result.width).toBe(200);
      expect(result.height).toBe(200);
    });

    it('columnSpan=2, rowSpan=1のサイズを計算する', () => {
      const result = calculateOverlaySize(2, 1, cellWidth, cellHeight, gap);
      expect(result.width).toBe(424); // 200 * 2 + 24 * 1
      expect(result.height).toBe(200);
    });

    it('columnSpan=1, rowSpan=2のサイズを計算する（縦長）', () => {
      const result = calculateOverlaySize(1, 2, cellWidth, cellHeight, gap);
      expect(result.width).toBe(200);
      expect(result.height).toBe(424); // 200 * 2 + 24 * 1
    });

    it('columnSpan=2, rowSpan=2のサイズを計算する', () => {
      const result = calculateOverlaySize(2, 2, cellWidth, cellHeight, gap);
      expect(result.width).toBe(424);
      expect(result.height).toBe(424);
    });

    it('デフォルトのギャップ値を使用する', () => {
      const result = calculateOverlaySize(2, 1, cellWidth, cellHeight);
      expect(result.width).toBe(424);
      expect(result.height).toBe(200);
    });
  });
});
