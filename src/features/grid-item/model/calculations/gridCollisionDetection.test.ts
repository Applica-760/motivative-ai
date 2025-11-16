import { describe, it, expect } from 'vitest';
import {
  checkCollision,
  isWithinBounds,
  calculateSwapPositions,
} from './gridCollisionDetection';
import type { GridPosition, GridItemConfig } from '../types';

describe('gridCollisionDetection', () => {
  describe('checkCollision', () => {
    const items: GridItemConfig[] = [
      {
        id: 'item1',
        order: 1,
        size: 'small-square',
        position: { column: 1, row: 1, columnSpan: 1 },
        content: null,
      },
      {
        id: 'item2',
        order: 2,
        size: 'small-square',
        position: { column: 2, row: 1, columnSpan: 1 },
        content: null,
      },
      {
        id: 'item3',
        order: 3,
        size: 'small-rectangle',
        position: { column: 1, row: 2, columnSpan: 2 },
        content: null,
      },
    ];

    it('衝突がない場合はfalseを返す', () => {
      const newPosition: GridPosition = {
        column: 3,
        row: 1,
        columnSpan: 1,
      };
      
      const result = checkCollision(newPosition, 'item1', items);
      expect(result).toBe(false);
    });

    it('同じ行で列が重なる場合はtrueを返す', () => {
      const newPosition: GridPosition = {
        column: 2,
        row: 1,
        columnSpan: 1,
      };
      
      const result = checkCollision(newPosition, 'item1', items);
      expect(result).toBe(true); // item2と衝突
    });

    it('異なる行の場合は衝突しない', () => {
      const newPosition: GridPosition = {
        column: 1,
        row: 3,
        columnSpan: 1,
      };
      
      const result = checkCollision(newPosition, 'item1', items);
      expect(result).toBe(false);
    });

    it('自分自身は除外される', () => {
      const newPosition: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 1,
      };
      
      const result = checkCollision(newPosition, 'item1', items);
      expect(result).toBe(false); // item1自身の位置だが衝突とみなさない
    });

    it('columnSpan=2のアイテムとの衝突を検出する（左端）', () => {
      const newPosition: GridPosition = {
        column: 1,
        row: 2,
        columnSpan: 1,
      };
      
      const result = checkCollision(newPosition, 'item1', items);
      expect(result).toBe(true); // item3（1-2列目を占有）と衝突
    });

    it('columnSpan=2のアイテムとの衝突を検出する（右端）', () => {
      const newPosition: GridPosition = {
        column: 2,
        row: 2,
        columnSpan: 1,
      };
      
      const result = checkCollision(newPosition, 'item1', items);
      expect(result).toBe(true); // item3と衝突
    });

    it('columnSpan=2のアイテムが既存アイテムと衝突する', () => {
      const newPosition: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 2,
      };
      
      const result = checkCollision(newPosition, 'moving-item', items);
      expect(result).toBe(true); // item1とitem2の両方と衝突
    });

    it('columnSpan=2のアイテムが完全に覆う場合', () => {
      const newPosition: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 2,
      };
      
      const result = checkCollision(newPosition, 'item1', items);
      expect(result).toBe(true); // item2と衝突（item1は自分自身なので除外）
    });

    it('空のグリッドでは衝突しない', () => {
      const newPosition: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 1,
      };
      
      const result = checkCollision(newPosition, 'new-item', []);
      expect(result).toBe(false);
    });

    it('複雑な衝突パターン：部分的な重なり', () => {
      const complexItems: GridItemConfig[] = [
        {
          id: 'wide',
          order: 1,
          size: 'small-rectangle',
          position: { column: 2, row: 1, columnSpan: 2 }, // 2-3列目
          content: null,
        },
      ];

      const newPosition: GridPosition = {
        column: 3,
        row: 1,
        columnSpan: 2, // 3-4列目を占有しようとする
      };
      
      const result = checkCollision(newPosition, 'new-item', complexItems);
      expect(result).toBe(true); // 3列目で重なる
    });
  });

  describe('isWithinBounds', () => {
    const columns = 4;

    it('1列1スパンは境界内', () => {
      const position: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 1,
      };
      
      expect(isWithinBounds(position, columns)).toBe(true);
    });

    it('4列1スパンは境界内', () => {
      const position: GridPosition = {
        column: 4,
        row: 1,
        columnSpan: 1,
      };
      
      expect(isWithinBounds(position, columns)).toBe(true);
    });

    it('3列2スパンは境界内（4列目まで使用）', () => {
      const position: GridPosition = {
        column: 3,
        row: 1,
        columnSpan: 2,
      };
      
      expect(isWithinBounds(position, columns)).toBe(true);
    });

    it('4列2スパンは境界外（5列目を超える）', () => {
      const position: GridPosition = {
        column: 4,
        row: 1,
        columnSpan: 2,
      };
      
      expect(isWithinBounds(position, columns)).toBe(false);
    });

    it('5列1スパンは境界外', () => {
      const position: GridPosition = {
        column: 5,
        row: 1,
        columnSpan: 1,
      };
      
      expect(isWithinBounds(position, columns)).toBe(false);
    });

    it('0列は境界外', () => {
      const position: GridPosition = {
        column: 0,
        row: 1,
        columnSpan: 1,
      };
      
      expect(isWithinBounds(position, columns)).toBe(false);
    });

    it('1列3スパンは境界外（4列グリッド）', () => {
      const position: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 2,
      };
      
      expect(isWithinBounds(position, 1)).toBe(false); // 1列グリッド
    });

    it('モバイル（2列）で境界チェック', () => {
      const mobileColumns = 2;
      
      const valid: GridPosition = {
        column: 1,
        row: 1,
        columnSpan: 2,
      };
      expect(isWithinBounds(valid, mobileColumns)).toBe(true);

      const invalid: GridPosition = {
        column: 2,
        row: 1,
        columnSpan: 2,
      };
      expect(isWithinBounds(invalid, mobileColumns)).toBe(false);
    });
  });

  describe('calculateSwapPositions', () => {
    const columns = 4;

    it('同じサイズのアイテムをスワップする', () => {
      const activeItem: GridItemConfig = {
        id: 'active',
        order: 1,
        size: 'small-square',
        position: { column: 1, row: 1, columnSpan: 1 },
        content: null,
      };

      const overItem: GridItemConfig = {
        id: 'over',
        order: 2,
        size: 'small-square',
        position: { column: 2, row: 1, columnSpan: 1 },
        content: null,
      };

      const result = calculateSwapPositions(activeItem, overItem, columns);

      expect(result).not.toBeNull();
      expect(result!.activePosition.column).toBe(2);
      expect(result!.activePosition.row).toBe(1);
      expect(result!.activePosition.columnSpan).toBe(1);
      
      expect(result!.overPosition.column).toBe(1);
      expect(result!.overPosition.row).toBe(1);
      expect(result!.overPosition.columnSpan).toBe(1);
    });

    it('異なるサイズのアイテムをスワップする', () => {
      const activeItem: GridItemConfig = {
        id: 'active',
        order: 1,
        size: 'small-square',
        position: { column: 1, row: 1, columnSpan: 1 },
        content: null,
      };

      const overItem: GridItemConfig = {
        id: 'over',
        order: 2,
        size: 'small-rectangle',
        position: { column: 2, row: 2, columnSpan: 2 },
        content: null,
      };

      const result = calculateSwapPositions(activeItem, overItem, columns);

      expect(result).not.toBeNull();
      // activeはoverの位置に移動するが、自分のサイズ（columnSpan=1）を保持
      expect(result!.activePosition.column).toBe(2);
      expect(result!.activePosition.row).toBe(2);
      expect(result!.activePosition.columnSpan).toBe(1);
      
      // overはactiveの位置に移動するが、自分のサイズ（columnSpan=2）を保持
      expect(result!.overPosition.column).toBe(1);
      expect(result!.overPosition.row).toBe(1);
      expect(result!.overPosition.columnSpan).toBe(2);
    });

    it('境界外になる場合は右端に調整される', () => {
      const activeItem: GridItemConfig = {
        id: 'active',
        order: 1,
        size: 'small-rectangle',
        position: { column: 1, row: 1, columnSpan: 2 },
        content: null,
      };

      const overItem: GridItemConfig = {
        id: 'over',
        order: 2,
        size: 'small-square',
        position: { column: 4, row: 2, columnSpan: 1 }, // 右端
        content: null,
      };

      const result = calculateSwapPositions(activeItem, overItem, columns);

      expect(result).not.toBeNull();
      // activeItem（columnSpan=2）が4列目に配置されようとすると境界外
      // → 3列目に調整される（3-4列目を使用）
      expect(result!.activePosition.column).toBe(3);
      expect(result!.activePosition.row).toBe(2);
      expect(result!.activePosition.columnSpan).toBe(2);
      
      expect(result!.overPosition.column).toBe(1);
      expect(result!.overPosition.row).toBe(1);
      expect(result!.overPosition.columnSpan).toBe(1);
    });

    it('両方が境界外になる場合は両方調整される', () => {
      const activeItem: GridItemConfig = {
        id: 'active',
        order: 1,
        size: 'small-rectangle',
        position: { column: 4, row: 1, columnSpan: 2 }, // すでに境界外
        content: null,
      };

      const overItem: GridItemConfig = {
        id: 'over',
        order: 2,
        size: 'small-rectangle',
        position: { column: 4, row: 2, columnSpan: 2 }, // すでに境界外
        content: null,
      };

      const result = calculateSwapPositions(activeItem, overItem, columns);

      expect(result).not.toBeNull();
      // 両方とも3列目に調整される
      expect(result!.activePosition.column).toBe(3);
      expect(result!.overPosition.column).toBe(3);
    });

    it('行位置は正しくスワップされる', () => {
      const activeItem: GridItemConfig = {
        id: 'active',
        order: 1,
        size: 'small-square',
        position: { column: 1, row: 1, columnSpan: 1 },
        content: null,
      };

      const overItem: GridItemConfig = {
        id: 'over',
        order: 2,
        size: 'small-square',
        position: { column: 2, row: 3, columnSpan: 1 },
        content: null,
      };

      const result = calculateSwapPositions(activeItem, overItem, columns);

      expect(result).not.toBeNull();
      expect(result!.activePosition.row).toBe(3);
      expect(result!.overPosition.row).toBe(1);
    });
  });
});
