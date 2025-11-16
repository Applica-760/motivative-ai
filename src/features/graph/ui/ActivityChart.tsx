import { ChartTypeEnum } from '@/shared/types';
import type { ChartDataPoint, ChartType } from '@/shared/types';
import { ChartFactory } from './ChartFactory';
import './ActivityChart.css';

interface ActivityChartProps {
  data: ChartDataPoint[];
  dataLabel: string;
  color?: string;
  height?: number;
  chartType?: ChartType;
  /** チャートタイプ変更時のコールバック */
  onChartTypeChange?: (type: ChartType) => void;
}

/**
 * アクティビティチャートコンポーネント
 * グラフを表示する統合コンポーネント
 * 
 * 注意: 
 * - タイトル、アイコン、チャート切り替えボタンは GridItemHeader で表示されます
 * - このコンポーネントはチャート本体のみを表示します
 */
export function ActivityChart({
  data,
  dataLabel,
  color = 'blue.6',
  height = 200,
  chartType = ChartTypeEnum.BAR,
}: ActivityChartProps) {
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <ChartFactory
        data={data}
        dataLabel={dataLabel}
        color={color}
        height={height}
        chartType={chartType}
      />
    </div>
  );
}
