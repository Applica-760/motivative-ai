import { 
  DndContext, 
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState, useRef } from 'react';
import type { GridItemConfig } from '../types';
import { DraggableGridItem } from './DraggableGridItem';
import { useGridLayout, useCellSize } from '../hooks';
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
  const isMobile = useMediaQuery(`(max-width: ${GRID_CONFIG.MOBILE_BREAKPOINT}px)`);
  
  // デバイスサイズに応じた列数
  const columns = isMobile ? GRID_CONFIG.MOBILE_COLUMNS : GRID_CONFIG.DESKTOP_COLUMNS;
  
  const gridRef = useRef<HTMLDivElement>(null);
  const cellSize = useCellSize(gridRef, columns);
  const { items, updateItemPosition, swapItems } = useGridLayout(initialItems, { columns });
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
        {items.map((item) => {
          const position = calculateItemPosition(item.position, cellSize);
          
          return (
            <Box
              key={item.id}
              style={{
                position: 'absolute',
                left: `${position.left}px`,
                top: `${position.top}px`,
                width: `${position.width}px`,
                height: `${position.height}px`,
              }}
            >
              <DraggableGridItem item={item} />
            </Box>
          );
        })}
      </Box>
      
      <DragOverlay>
        {activeItem && cellSize.width > 0 ? (
          <Box
            style={{
              width: `${calculateOverlaySize(
                activeItem.position.columnSpan,
                activeItem.position.rowSpan || 1,
                cellSize.width,
                cellSize.height
              ).width}px`,
              height: `${calculateOverlaySize(
                activeItem.position.columnSpan,
                activeItem.position.rowSpan || 1,
                cellSize.width,
                cellSize.height
              ).height}px`,
              opacity: GRID_CONFIG.DRAG_OVERLAY_OPACITY,
            }}
          >
            <DraggableGridItem item={activeItem} />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
