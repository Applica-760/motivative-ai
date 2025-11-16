import { 
  DndContext, 
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { Box } from '@mantine/core';
import { useState, useRef } from 'react';
import type { GridItemConfig } from '../types';
import { DraggableGridItem } from './DraggableGridItem';
import { useGridLayout, useCellSize, useContainerSize } from '../hooks';
import { GRID_CONFIG } from '../config/gridConstants';
import {
  calculateNewPosition,
  calculateContainerHeight,
  calculateItemPosition,
  calculateOverlaySize,
} from '../model/calculations';

interface DraggableGridProps {
  items: GridItemConfig[];
}

/**
 * ドラッグ&ドロップ可能なグリッドコンテナ
 * Appleウィジェット風の自由配置を実現
 * デスクトップ: 4列、モバイル: 2列のレスポンシブレイアウト
 * 各アイテムは明示的なposition（column, row, columnSpan）を持つ
 */
export function DraggableGrid({ items: initialItems }: DraggableGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(gridRef);

  // コンテナ幅に基づく段階的な列数決定（5→4→3→2）。
  // セル幅が MIN_CELL_WIDTH を下回らない最大列数を選択する。
  const computeColumns = (rawWidth: number): number => {
    // 計測の信頼性向上: 自身の幅が0/小さい場合は親要素の幅をフォールバックに使用
    const parentWidth = gridRef.current?.parentElement?.getBoundingClientRect().width ?? 0;
    const width = Math.max(rawWidth, parentWidth);
    if (!width || width <= 0) return GRID_CONFIG.MIN_COLUMNS; // 初期値のフォールバック
    const maxCols = GRID_CONFIG.DESKTOP_COLUMNS;
    const minCols = GRID_CONFIG.MIN_COLUMNS;

    for (let cols = maxCols; cols >= minCols; cols--) {
      const cellWidth = (width - GRID_CONFIG.GAP * (cols - 1)) / cols;
      if (cellWidth >= GRID_CONFIG.MIN_CELL_WIDTH) {
        return cols;
      }
    }
    return GRID_CONFIG.MIN_COLUMNS;
  };

  const columns = computeColumns(containerSize.width);

  const cellSize = useCellSize(gridRef, columns);
  const { items, isLoading, updateItemPosition, swapItems } = useGridLayout(initialItems, { columns });
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveId(null);

    if (!active) return;

    const activeId = active.id as string;
    const activeItem = items.find((item) => item.id === activeId);
    if (!activeItem) return;

    if (over && over.id !== activeId) {
      swapItems(activeId, over.id as string);
      return;
    }

    if (delta && (Math.abs(delta.x) > GRID_CONFIG.DRAG_THRESHOLD || Math.abs(delta.y) > GRID_CONFIG.DRAG_THRESHOLD)) {
      const newPosition = calculateNewPosition(activeItem.position, delta, cellSize, columns);
      
      if (newPosition.column !== activeItem.position.column || newPosition.row !== activeItem.position.row) {
        updateItemPosition(activeId, newPosition);
      }
    }
  };

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;
  const containerHeight = calculateContainerHeight(items, cellSize.height);

  // ローディング中は空のコンテナを表示
  if (isLoading) {
    return (
      <Box
        ref={gridRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '200px',
        }}
      />
    );
  }

  // 表示用プロップ（ヘッダー/アクション/コンテンツ）は最新のinitialItemsから取得し、
  // 位置情報（position）はレイアウト状態itemsから使用してマージする。
  const resolveItem = (layoutItem: GridItemConfig): GridItemConfig => {
    const visual = initialItems.find((i) => i.id === layoutItem.id);
    if (!visual) return layoutItem;
    return {
      ...visual,
      // レイアウトで確定した位置/順序を優先
      position: layoutItem.position,
      order: layoutItem.order,
    };
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        ref={gridRef}
        style={{
          position: 'relative',
          width: '100%',
          height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight,
        }}
      >
        {items.map((layoutItem) => {
          const mergedItem = resolveItem(layoutItem);
          const position = calculateItemPosition(mergedItem.position, cellSize);
          
          return (
            <Box
              key={mergedItem.id}
              style={{
                position: 'absolute',
                left: `${position.left}px`,
                top: `${position.top}px`,
                width: `${position.width}px`,
                height: `${position.height}px`,
              }}
            >
              <DraggableGridItem item={mergedItem} />
            </Box>
          );
        })}
      </Box>
      
      <DragOverlay>
        {activeItem && cellSize.width > 0 ? (
          // オーバーレイ表示時も最新の見た目を反映
          (() => {
            const mergedActive = resolveItem(activeItem);
            return (
          <Box
            style={{
              width: `${calculateOverlaySize(
                mergedActive.position.columnSpan,
                mergedActive.position.rowSpan || 1,
                cellSize.width,
                cellSize.height
              ).width}px`,
              height: `${calculateOverlaySize(
                mergedActive.position.columnSpan,
                mergedActive.position.rowSpan || 1,
                cellSize.width,
                cellSize.height
              ).height}px`,
              opacity: GRID_CONFIG.DRAG_OVERLAY_OPACITY,
            }}
          >
              <DraggableGridItem item={mergedActive} />
          </Box>
            );
          })()
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
