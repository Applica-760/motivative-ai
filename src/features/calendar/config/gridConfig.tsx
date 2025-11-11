import type { GridItemConfig } from '@/features/grid-layout';
import type { ActivityDefinition } from '@/shared/types';
import { colors } from '@/shared/config';
import { ActivityCalendarWidget } from '../ui';

/**
 * Calendarフォルダが提供するグリッドアイテムを生成
 * Feature-Sliced Design: 各featureが自身のグリッド設定を管理
 * 
 * Boolean型のアクティビティに対してカレンダービューを提供する
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

  // 各カレンダーを1×1の正方形として配置
  return booleanActivities.map((activity, index) => {
    // 3行目以降に配置（1行目: アクションボタン、2行目以降: グラフ）
    // 2列配置で自動的に並べる
    const row = Math.floor(index / 2) + 3;
    const column = (index % 2) * 2 + 1; // 1 or 3

    return {
      id: `${activity.id}-calendar`,
      order: startOrder + index,
      size: 'small-square' as const,
      position: { column, row, columnSpan: 1 },
      content: (
        <ActivityCalendarWidget
          activity={activity}
          onClick={onCalendarClick ? () => onCalendarClick(activity.id) : undefined}
        />
      ),
      backgroundColor: colors.gridItem.default,
      shadow: 'md' as const,
    };
  });
}
