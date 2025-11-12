import type { GridItemConfig } from '@/features/grid-layout';
import type { ActivityDefinition } from '@/shared/types';
// 一時的にコメントアウト - 将来的に復元する可能性あり
// import { createActivityActionGridItems } from '@/features/activity';
import { createGraphGridItems, type ActivityData } from '@/features/graph';
import { createCalendarGridItems } from '@/features/calendar';

/**
 * ダッシュボードのグリッドアイテム設定を生成する
 * Feature-Sliced Design: app/compositions
 * 
 * 各featureが提供するgridConfig関数を統合し、
 * ダッシュボード全体のレイアウトを構築する。
 * 
 * app層がオーケストレーターとして機能し、
 * 各featureの独立性を保ちながら統合する。
 * 
 * @param activities - アクティビティデータの配列（グラフ用）
 * @param activityDefinitions - アクティビティ定義の配列（カレンダー用）
 * @param onChartClick - グラフクリック時のコールバック（オプション）
 * @param onCalendarClick - カレンダークリック時のコールバック（オプション）
 */
export function createDashboardGridItems(
  activities: ActivityData[],
  activityDefinitions: ActivityDefinition[],
  onChartClick?: (activityId: string) => void,
  onCalendarClick?: (activityId: string) => void
): GridItemConfig[] {
  // アクティビティアクションウィジェット（記録追加、新規アクティビティ）
  // 一時的にコメントアウト - 将来的に復元する可能性あり
  // const actionItems = createActivityActionGridItems();
  const actionItems: GridItemConfig[] = [];
  
  // グラフチャートウィジェット
  // startOrderでアクションウィジェットの後に配置
  const graphItems = createGraphGridItems(activities, actionItems.length, onChartClick);
  
  // カレンダーウィジェット
  // startOrderでグラフウィジェットの後に配置
  const calendarItems = createCalendarGridItems(
    activityDefinitions,
    actionItems.length + graphItems.length,
    onCalendarClick
  );
  
  return [...actionItems, ...graphItems, ...calendarItems];
}
