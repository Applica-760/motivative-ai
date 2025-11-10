import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { ChartTypeEnum, type BaseChartProps, type ChartType } from '@/shared/types';

/**
 * グラフタイプに応じて適切なチャートコンポーネントを返す
 */
export function ChartFactory({
  data,
  dataLabel,
  color,
  chartType = ChartTypeEnum.BAR,
}: BaseChartProps & { chartType?: ChartType }) {
  switch (chartType) {
    case ChartTypeEnum.LINE:
      return <LineChart data={data} dataLabel={dataLabel} color={color} />;
    case ChartTypeEnum.BAR:
    default:
      return <BarChart data={data} dataLabel={dataLabel} color={color} />;
  }
}
