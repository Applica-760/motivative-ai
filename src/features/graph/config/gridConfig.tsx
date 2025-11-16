import type { GridItemConfig } from '@/features/grid-item';
import { colors } from '@/shared/config';
import type { ChartDataPoint, ChartType } from '@/shared/types';
import { ActivityChartWidget, ChartTypeToggle } from '../ui';
import { useGraphPreferences } from '../model';
import type { ContainerSize } from '@/features/grid-item';

/**
 * アクティビティデータの型定義
 * グラフ表示用のデータ構造
 */
export interface ActivityData {
  activityId: string;
  type: string;
  title: string;
  icon: string;
  data: ChartDataPoint[];
  dataLabel: string;
  color: string;
  chartType: ChartType;
}

/**
 * Graphフォルダが提供するグリッドアイテムを生成
 * Feature-Sliced Design: 各featureが自身のグリッド設定を管理
 * 
 * シンプルなアプローチ:
 * - header.actionsにはチャート切り替えボタンを配置
 * - ActivityChartWidget内で独立して状態管理
 * 
 * @param activities - 表示するアクティビティデータの配列
 * @param startOrder - グリッドアイテムの開始順序(他のウィジェットとの調整用)
 * @param onChartClick - グラフクリック時のコールバック(オプション)
 */
export function createGraphGridItems(
  activities: ActivityData[],
  startOrder = 0,
  onChartClick?: (activityId: string) => void,
): GridItemConfig[] {
  // 各チャートの位置を計算(中央に長方形として配置)
  return activities.map((activity, index) => {
    // ランニングは1行目、読書は2行目に配置
    const row = index + 1; // 1, 2, 3...
    const column = 2; // 2列目開始(2-3列にまたがる)
    
    // 状態管理をActivityChartWidget内に委譲するシンプルなアプローチ
    // header.actionsには静的なチャート切り替えボタンを配置
    // NOTE: 現時点では、ボタンとチャートの状態は独立しています
    //       将来的に状態を共有する場合は、React Contextや状態管理ライブラリを検討
    
    // フックはコンポーネント内でのみ使用可能なため、
    // アクションとコンテンツを小さなコンポーネントでラップしてContextから値を取得する。
    const Actions = () => {
      const { getChartType, setChartType } = useGraphPreferences();
      const current = getChartType(activity.activityId) ?? activity.chartType;
      return (
        <ChartTypeToggle
          currentType={current}
          onTypeChange={(type) => setChartType(activity.activityId, type)}
        />
      );
    };

    const Content = ({ containerSize }: { containerSize: ContainerSize | undefined }) => {
      const { getChartType } = useGraphPreferences();
      const current = getChartType(activity.activityId) ?? activity.chartType;
      return (
        <ActivityChartWidget
          data={activity.data}
          dataLabel={activity.dataLabel}
          color={activity.color}
          chartType={current}
          onClick={onChartClick ? () => onChartClick(activity.activityId) : undefined}
          containerSize={containerSize}
        />
      );
    };

    return {
      id: `${activity.type}-chart`,
      order: startOrder + index,
      size: 'small-rectangle' as const,
      position: { column, row, columnSpan: 2, rowSpan: 1 },
      header: {
        icon: activity.icon,
        title: activity.title,
        actions: <Actions />,
      },
      content: (containerSize) => <Content containerSize={containerSize} />,
      backgroundColor: colors.gridItem.chart,
      shadow: 'lg' as const,
    };
  });
}