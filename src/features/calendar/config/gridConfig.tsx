import type { GridItemConfig } from '@/features/grid-layout';
import type { ActivityDefinition } from '@/shared/types';
import { colors } from '@/shared/config';
import { ActivityCalendarWidget } from '../ui';

/**
 * Calendarフォルダが提供するグリッドアイテムを生成
 * Feature-Sliced Design: 各featureが自身のグリッド設定を管理
 * 
 * Boolean型のアクティビティに対してカレンダービューを提供する
 * 各カレンダーは2×2（正方形）のグリッドカードとして配置
 * 
 * @param activities - 表示するアクティビティの配列
 * @param startOrder - グリッドアイテムの開始順序（他のウィジェットとの調整用）
 * @param onCalendarClick - カレンダークリック時のコールバック（オプション）
 */
export function createCalendarGridItems(
  activities: ActivityDefinition[],
  startOrder = 0,
  onCalendarClick?: (activityId: string) => void
): GridItemConfig[] {
  // Boolean型のアクティビティのみをフィルタリング
  const booleanActivities = activities.filter(
    (activity) => activity.valueType === 'boolean' && !activity.isArchived
  );

  // 各カレンダーを2×2の正方形として配置
  return booleanActivities.map((activity, index) => {
    // 右上に配置（4列目、1-2行目）
    const row = 1;
    const column = 4;

    return {
      id: `${activity.id}-calendar`,
      order: startOrder + index,
      size: 'small-vertical' as const,
      position: { column, row, columnSpan: 2, rowSpan: 2 },
      content: (containerSize) => (
        <ActivityCalendarWidget
          activity={activity}
          onClick={onCalendarClick ? () => onCalendarClick(activity.id) : undefined}
          containerSize={containerSize}
        />
      ),
      backgroundColor: colors.gridItem.default,
      shadow: 'md' as const,
    };
  });
}
