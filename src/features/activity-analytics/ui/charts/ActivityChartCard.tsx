import { ChartCard } from '@/shared/ui';
import { ActivityChart } from '@/features/graph/ui';
import type { ChartDataPoint, ChartType } from '@/shared/types';

interface ActivityChartCardProps {
  title: string;
  data: ChartDataPoint[];
  dataLabel: string;
  color?: string;
  height?: number;
  chartType?: ChartType;
}

/**
 * アクティビティ専用のチャートカード
 * 
 * ActivityドメインとGraphドメインの接続点:
 * - ChartCard (汎用的な横長カード)
 * - ActivityChart (グラフ描画)
 * を組み合わせてアクティビティ用に最適化
 * 
 * グリッドレイアウトの2×1サイズ（横長）に配置される
 */
export function ActivityChartCard(props: ActivityChartCardProps) {
  return (
    <ChartCard>
      <ActivityChart {...props} />
    </ChartCard>
  );
}
