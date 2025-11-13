import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Text, Group, ActionIcon, Box } from '@mantine/core';
import { IconMenu2, IconChevronRight } from '@tabler/icons-react';
import { colors } from '@/shared/config';
import type { ActivityDefinition } from '@/shared/types';

interface SortableActivityButtonProps {
  activity: ActivityDefinition;
  onClick: () => void;
}

/**
 * ドラッグ&ドロップ可能なアクティビティボタン
 * 
 * @dnd-kit/sortableを使用して並び替え機能を実装。
 * ハンバーガーアイコンをドラッグハンドルとして使用。
 */
export function SortableActivityButton({ activity, onClick }: SortableActivityButtonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: activity.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <Box 
      ref={setNodeRef} 
      style={{
        ...style,
        touchAction: 'none', // タッチデバイス対応
      }}
    >
      <Button
        variant="light"
        fullWidth
        radius="md"
        size="lg"
        color={activity.color || 'gray'}
        onClick={onClick}
        style={{
          boxShadow: `0 2px 8px ${colors.shadow.light}`,
          cursor: isDragging ? 'grabbing' : 'pointer',
          // ドラッグ中はボタン自体のtransitionを無効化
          transition: isDragging ? 'none' : 'box-shadow 0.2s ease, transform 0.2s ease',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
        styles={{
          inner: {
            justifyContent: 'space-between',
          },
          label: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          },
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.boxShadow = `0 8px 16px ${colors.shadow.medium}`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow.light}`;
          }
        }}
      >
        <Group justify="space-between" style={{ width: '100%' }} wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Text size="xl">{activity.icon}</Text>
            <Text size="md" fw={500}>
              {activity.title}
            </Text>
          </Group>
          <Group gap={4} wrap="nowrap" style={{ marginRight: -8 }}>
            {/* ドラッグハンドル - ハンバーガーアイコン */}
            <ActionIcon
              variant="transparent"
              size="sm"
              color="gray"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              {...attributes}
              {...listeners}
              onClick={(e) => {
                // ドラッグハンドルをクリックした時はボタンのonClickを発火させない
                e.stopPropagation();
              }}
            >
              <IconMenu2 size={18} />
            </ActionIcon>
            <ActionIcon variant="transparent" size="sm" color="gray">
              <IconChevronRight size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Button>
    </Box>
  );
}
