// UIコンポーネント
export { DraggableGrid, DraggableGridItem } from './ui';

// フック
export { useGridLayout, useCellSize } from './hooks';
export type { UseGridLayoutOptions } from './hooks/useGridLayout';

// ユーティリティ関数
export { assignGridPositions, createGridPosition } from './utils';

// 型定義
export type { 
  GridItemConfig, 
  GridItemSize, 
  GridPosition,
  CellSize,
  SavedLayout,
} from './types';
export { GRID_SIZE_MAP, GRID_COLUMNS } from './types';

// Model層（必要に応じて外部から使用可能）
export {
  calculateCellSize,
  calculateNewPosition,
  calculateContainerHeight,
  calculateItemPosition,
  calculateOverlayWidth,
  checkCollision,
  isWithinBounds,
  calculateSwapPositions,
  getItemShadow,
  calculateAspectRatio,
  getDragHandleStyle,
  createLayoutFromItems,
  updateItemInList,
  swapItemsInList,
  syncInitialItems,
  initializeItemsFromStorage,
} from './model';
export type { ShadowStyles } from './model';

// 設定
export { GRID_CONFIG } from './config';
