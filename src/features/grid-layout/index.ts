// UIコンポーネント
export { DraggableGrid, DraggableGridItem } from './ui';

// フック
export { useGridLayout, useCellSize, useContainerSize } from './hooks';
export type { UseGridLayoutOptions } from './hooks/useGridLayout';
export type { ContainerSize } from './hooks/useContainerSize';

// ユーティリティ関数
export { assignGridPositions, createGridPosition } from './utils';

// 型定義
export type { 
  GridItemConfig, 
  GridItemSize, 
  GridPosition,
  CellSize,
  SavedLayout,
  GridItemRenderFunction,
} from './types';
export { GRID_SIZE_MAP, GRID_COLUMNS } from './types';

// Model層（必要に応じて外部から使用可能）
export {
  calculateCellSize,
  calculateNewPosition,
  calculateContainerHeight,
  calculateItemPosition,
  calculateOverlaySize,
  checkCollision,
  isWithinBounds,
  calculateSwapPositions,
  getItemShadow,
  getDragHandleStyle,
  createLayoutFromItems,
  updateItemInList,
  swapItemsInList,
  syncInitialItems,
  initializeItemsFromStorage,
} from './model';
export type { ShadowStyles } from './model';

// 設定
export { GRID_CONFIG, containerQuery } from './config';
