import type { GridItemConfig } from '@/features/grid-layout';
import { colors } from '@/shared/config';
import type { ChartDataPoint, ChartType } from '@/shared/types';
import { ActivityChartWidget } from '../ui';

/**
 * アクティビティデータの型定義
 * グラフ表示用のデータ構造
 */
export interface ActivityData {
  activityId: string;
  type: string;
  title: string;
  data: ChartDataPoint[];
  dataLabel: string;
  color: string;
  chartType: ChartType;
}

/**
 * Graphフォルダが提供するグリッドアイテムを生成
 * Feature-Sliced Design: 各featureが自身のグリッド設定を管理
 * 
 * @param activities - 表示するアクティビティデータの配列
 * @param startOrder - グリッドアイテムの開始順序（他のウィジェットとの調整用）
 * @param onChartClick - グラフクリック時のコールバック（オプション）
 */
export function createGraphGridItems(
  activities: ActivityData[],
  startOrder = 0,
  onChartClick?: (activityId: string) => void
): GridItemConfig[] {
  // 各チャートの位置を計算（中央に長方形として配置）
  return activities.map((activity, index) => {
    // ランニングは1行目、読書は2行目に配置
    const row = index + 1; // 1, 2, 3...
    const column = 2; // 2列目開始（2-3列にまたがる）
    
    return {
      id: `${activity.type}-chart`,
      order: startOrder + index,
      size: 'small-rectangle' as const,
      position: { column, row, columnSpan: 2, rowSpan: 1 },
      content: (
        <ActivityChartWidget
          title={activity.title}
          data={activity.data}
          dataLabel={activity.dataLabel}
          color={activity.color}
          chartType={activity.chartType}
          onClick={onChartClick ? () => onChartClick(activity.activityId) : undefined}
        />
      ),
      backgroundColor: colors.gridItem.chart,
      shadow: 'lg' as const,
    };
  });
}
