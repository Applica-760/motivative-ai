import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Box, Paper, Stack } from '@mantine/core';
import { useState, useRef } from 'react';
import type { GridItemConfig } from '../types';
import { GRID_CONFIG } from '../config/gridConstants';
import {
  getItemShadow,
  getDragHandleStyle,
} from '../model/styles';
import { useContainerSize } from '../hooks/useContainerSize';
import { GridItemHeader } from './GridItemHeader';

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
  
  // コンテナのサイズを監視
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(containerRef);

  const setRefs = (element: HTMLDivElement | null) => {
    setDraggableRef(element);
    setDroppableRef(element);
    // containerRefも同時に設定
    if (containerRef) {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging && item.onClick) {
      e.stopPropagation();
      item.onClick();
    }
  };

  const shadowStyles = getItemShadow(item, isDragging, isHovered);
  
  // contentが関数の場合はコンテナサイズを渡してレンダリング
  const renderedContent = typeof item.content === 'function' 
    ? item.content(containerSize) 
    : item.content;

  return (
    <Box
      ref={setRefs}
      style={{
        transform: CSS.Translate.toString(transform),
        width: '100%',
        height: '100%',
        // Container Query APIを有効化
        containerType: 'size',
        containerName: `grid-item-${item.id}`,
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
          justifyContent: item.header ? 'flex-start' : 'center',
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
        
        {/* ヘッダーがある場合はStackで縦に並べる */}
        {item.header ? (
          <Stack gap={0} style={{ height: '100%', overflow: 'hidden' }}>
            <GridItemHeader
              icon={item.header.icon}
              title={item.header.title}
              actions={item.header.actions}
            />
            <Box style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              {renderedContent}
            </Box>
          </Stack>
        ) : (
          // ヘッダーがない場合は従来通り中央配置
          renderedContent
        )}
      </Paper>
    </Box>
  );
}
