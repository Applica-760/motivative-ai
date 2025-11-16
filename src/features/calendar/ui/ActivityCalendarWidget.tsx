import { Box } from '@mantine/core';
import { ActivityCalendar } from './ActivityCalendar';
import type { ActivityDefinition } from '@/shared/types';
import type { ContainerSize } from '@/features/grid-item';

interface ActivityCalendarWidgetProps {
  /** 表示するアクティビティ */
  activity: ActivityDefinition;
  /** クリックハンドラー（オプション） */
  onClick?: () => void;
  /** コンテナサイズ */
  containerSize?: ContainerSize;
}

/**
 * ActivityCalendarをウィジェットとして提供
 * グリッドアイテムに注入できる形式でラップ
 * 
 * クリック可能な場合は、適切なスタイルとアクセシビリティ属性を追加
 */
export function ActivityCalendarWidget({ activity, onClick }: ActivityCalendarWidgetProps) {
  const isClickable = !!onClick;

  return (
    <Box
      onClick={onClick}
      style={{
        height: '100%',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={isClickable ? `${activity.title}のカレンダーを表示` : undefined}
    >
      <ActivityCalendar activity={activity} />
    </Box>
  );
}
