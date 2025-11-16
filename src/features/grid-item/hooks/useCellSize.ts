import { useState, useEffect, type RefObject } from 'react';
import { calculateCellSize } from '../model/calculations/gridCalculations';
import { GRID_CONFIG } from '../config/gridConstants';
import type { CellSize } from '../types';

/**
 * グリッドセルサイズの計算と監視を行うカスタムフック
 * ウィンドウリサイズ時に自動的にセルサイズを再計算する
 * 
 * @param gridRef - グリッドコンテナのref
 * @param columns - グリッドの列数
 * @param gap - グリッド間のギャップ（px）
 * @returns セルサイズ（width, height）
 */
export function useCellSize(
  gridRef: RefObject<HTMLElement | null>,
  columns: number,
  gap: number = GRID_CONFIG.GAP
): CellSize {
  const [cellSize, setCellSize] = useState<CellSize>({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (!gridRef.current) return;
      
      const gridWidth = gridRef.current.getBoundingClientRect().width;
      const newSize = calculateCellSize(gridWidth, columns, gap);
      setCellSize(newSize);
    };

    // 初回計算
    updateSize();

    // リサイズイベントのリスナー登録
    window.addEventListener('resize', updateSize);
    
    // クリーンアップ
    return () => window.removeEventListener('resize', updateSize);
  }, [gridRef, columns, gap]);

  return cellSize;
}
