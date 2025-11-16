import type { GridItemConfig } from '@/features/grid-item';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
// 一時的にコメントアウト - 将来的に復元する可能性あり
// import { createActivityActionGridItems } from '@/features/activity';
import { createGraphGridItems, type ActivityData } from '@/features/graph';
import { createCalendarGridItems } from '@/features/calendar';
import { createTextLogGridItems } from '@/features/text-log';
import { createTimerGridItems } from '@/features/timer';

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
 * @param activityDefinitions - アクティビティ定義の配列（カレンダー・テキストログ用）
 * @param records - アクティビティ記録の配列（テキストログ用）
 * @param onChartClick - グラフクリック時のコールバック（オプション）
 * @param onCalendarClick - カレンダークリック時のコールバック（オプション）
 * @param onTextLogClick - テキストログクリック時のコールバック（オプション）
 */
export function createDashboardGridItems(
  activities: ActivityData[],
  activityDefinitions: ActivityDefinition[],
  records: ActivityRecord[],
  onChartClick?: (activityId: string) => void,
  onCalendarClick?: (activityId: string) => void,
  onTextLogClick?: (activityId: string) => void
): GridItemConfig[] {
  // タイマーウィジェット（最上部に配置）
  const timerItems = createTimerGridItems();
  
  // アクティビティアクションウィジェット（記録追加、新規アクティビティ）
  // 一時的にコメントアウト - 将来的に復元する可能性あり
  // const actionItems = createActivityActionGridItems();
  const actionItems: GridItemConfig[] = [];
  
  // グラフチャートウィジェット
  // startOrderでタイマー + アクションウィジェットの後に配置
  const graphItems = createGraphGridItems(
    activities,
    timerItems.length + actionItems.length,
    onChartClick
  );
  
  // カレンダーウィジェット
  // startOrderでグラフウィジェットの後に配置
  const calendarItems = createCalendarGridItems(
    activityDefinitions,
    timerItems.length + actionItems.length + graphItems.length,
    onCalendarClick
  );
  
  // テキストログウィジェット
  // startOrderでカレンダーウィジェットの後に配置
  const textLogItems = createTextLogGridItems(
    activityDefinitions,
    records,
    timerItems.length + actionItems.length + graphItems.length + calendarItems.length,
    onTextLogClick
  );
  
  return [...timerItems, ...actionItems, ...graphItems, ...calendarItems, ...textLogItems];
}
