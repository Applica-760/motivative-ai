import { useMemo } from 'react';
import { Center, Loader } from '@mantine/core';
import type { GridItemConfig } from '@/features/grid-layout';
import { useActivityContext } from '@/features/activity';
import { convertActivityRecordsToChartData } from '@/features/activity-analytics';
import type { ActivityData } from '@/features/graph';
import { ChartTypeEnum } from '@/shared/types';
import { createDashboardGridItems } from './dashboardConfig';

/**
 * DashboardCompositionのProps
 */
interface DashboardCompositionProps {
  /** グラフクリック時のコールバック（オプション） */
  onChartClick?: (activityId: string) => void;
  /** カレンダークリック時のコールバック（オプション） */
  onCalendarClick?: (activityId: string) => void;
  /** テキストログクリック時のコールバック（オプション） */
  onTextLogClick?: (activityId: string) => void;
  /** グリッドアイテムを受け取るレンダー関数 */
  children: (gridItems: GridItemConfig[]) => React.ReactNode;
}

/**
 * DashboardComposition
 * Feature-Sliced Design: app/compositions
 * 
 * ダッシュボード画面のFeature統合ロジックを担当。
 * 
 * 責務:
 * 1. ActivityContextからデータを取得
 * 2. ローディング状態の管理
 * 3. グラフ表示用のデータに変換
 * 4. 各FeatureのGridItemConfigを統合
 * 5. 統合されたGridItemConfigをレンダー関数に渡す
 * 
 * home featureはUI表示のみを担当し、データ取得と統合はこの層が担う。
 * 
 * @example
 * ```tsx
 * <DashboardComposition>
 *   {(gridItems) => <DraggableGrid items={gridItems} />}
 * </DashboardComposition>
 * ```
 */
export function DashboardComposition({ 
  onChartClick,
  onCalendarClick,
  onTextLogClick,
  children 
}: DashboardCompositionProps) {
  // ActivityContextからデータを取得
  const { activities: activityDefinitions, records, isLoading } = useActivityContext();

  // グラフ表示用のデータに変換
  const chartActivities = useMemo<ActivityData[]>(() => {
    const activities: ActivityData[] = [];

    // 全てのアクティビティを動的に処理
    for (const activity of activityDefinitions) {
      // number型またはduration型のアクティビティのみをグラフ化対象とする
      if (activity.valueType !== 'number' && activity.valueType !== 'duration') {
        continue;
      }

      // このアクティビティの記録を取得
      const activityRecords = records.filter(r => r.activityId === activity.id);
      
      // 記録の有無に関わらず、グラフを表示
      // 記録がない場合は空配列を渡し、「データがありません」状態で表示
      const chartData = activityRecords.length > 0
        ? convertActivityRecordsToChartData(activityRecords)
        : [];
      
      activities.push({
        activityId: activity.id,
        type: activity.id, // typeとしてIDを使用
        title: activity.title,
        icon: activity.icon,
        dataLabel: `${activity.title} (${activity.unit || ''})`,
        color: activity.color || '#4ECDC4', // デフォルトカラー
        data: chartData,
        chartType: ChartTypeEnum.BAR, // デフォルトでBARチャートを使用
      });
    }

    return activities;
  }, [activityDefinitions, records]);

  // グリッドアイテムを生成
  const gridItems = useMemo(
    () => createDashboardGridItems(
      chartActivities, 
      activityDefinitions, 
      records,
      onChartClick, 
      onCalendarClick,
      onTextLogClick
    ),
    [chartActivities, activityDefinitions, records, onChartClick, onCalendarClick, onTextLogClick]
  );

  // ローディング中は読み込み表示
  if (isLoading) {
    return (
      <Center h="400px">
        <Loader size="lg" />
      </Center>
    );
  }

  // レンダー関数にグリッドアイテムを渡す
  return <>{children(gridItems)}</>;
}
