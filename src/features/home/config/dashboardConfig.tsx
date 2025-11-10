import type { GridItemConfig } from '@/features/grid-layout';
import { createActivityActionGridItems } from '@/features/activity';
import { createGraphGridItems, type ActivityData } from '@/features/graph';

/**
 * ダッシュボードのグリッドアイテム設定を生成する
 * 
 * 各featureが提供するgridConfig関数を統合し、
 * ダッシュボード全体のレイアウトを構築する。
 * 
 * Feature-Sliced Design: homeはオーケストレーターとして機能し、
 * 各featureの独立性を保ちながら統合する。
 * 
 * @param activities - アクティビティデータの配列
 * @param onChartClick - グラフクリック時のコールバック（オプション）
 */
export function createDashboardGridItems(
  activities: ActivityData[],
  onChartClick?: (activityId: string) => void
): GridItemConfig[] {
  // アクティビティアクションウィジェット（記録追加、新規アクティビティ）
  const actionItems = createActivityActionGridItems();
  
  // グラフチャートウィジェット
  // startOrderでアクションウィジェットの後に配置
  const graphItems = createGraphGridItems(activities, actionItems.length, onChartClick);
  
  return [...actionItems, ...graphItems];
}
