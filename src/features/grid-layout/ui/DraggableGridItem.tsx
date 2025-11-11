import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper } from '@mantine/core';
import { useState } from 'react';
import type { GridItemConfig } from '../types';
import { GRID_CONFIG } from '../config/gridConstants';
import {
  getItemShadow,
  getDragHandleStyle,
} from '../model/styles';

interface DraggableGridItemProps {
  item: GridItemConfig;
}

/**
 * ドラッグ可能なグリッドアイテムコンポーネント
 */
export function DraggableGridItem({ item }: DraggableGridItemProps) {
  const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
    id: item.id,
  });
  const { setNodeRef: setDroppableRef } = useDroppable({ id: item.id });
  const [isHovered, setIsHovered] = useState(false);

  const setRefs = (element: HTMLDivElement | null) => {
    setDraggableRef(element);
    setDroppableRef(element);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging && item.onClick) {
      e.stopPropagation();
      item.onClick();
    }
  };

  const shadowStyles = getItemShadow(item, isDragging, isHovered);

  return (
    <Box
      ref={setRefs}
      style={{
        transform: CSS.Translate.toString(transform),
        width: '100%',
        height: '100%',
      }}
      {...attributes}
    >
      <Paper
        shadow={shadowStyles.shadow}
        radius="md"
        p="xs"
        withBorder
        style={{
          cursor: (item.clickable ?? Boolean(item.onClick)) ? 'pointer' : 'default',
          position: 'relative',
          transition: 'all 0.2s ease',
          width: '100%',
          height: '100%',
          opacity: isDragging ? GRID_CONFIG.DRAGGING_OPACITY : 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ...(item.backgroundColor && { backgroundColor: item.backgroundColor }),
          ...(shadowStyles.boxShadow && { boxShadow: shadowStyles.boxShadow }),
          ...(isHovered && { transform: `translateY(${GRID_CONFIG.HOVER_TRANSLATE_Y}px)` }),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <Box
          {...listeners}
          style={getDragHandleStyle(
            GRID_CONFIG.DRAG_HANDLE_POSITION.top,
            GRID_CONFIG.DRAG_HANDLE_POSITION.left
          )}
        >
          {GRID_CONFIG.DRAG_HANDLE_ICON}
        </Box>
        {item.content}
      </Paper>
    </Box>
  );
}
