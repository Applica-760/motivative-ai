import { BarChart as MantineBarChart } from '@mantine/charts';
import type { BaseChartProps } from '@/shared/types';

/**
 * 棒グラフコンポーネント
 * Mantineの棒グラフをラップし、統一されたインターフェースを提供
 */
export function BarChart({
  data,
  dataLabel,
  color = 'blue.6',
}: Omit<BaseChartProps, 'height'>) {
  return (
    <MantineBarChart
      h="100%"
      data={data}
      dataKey="date"
      series={[
        { name: 'value', label: dataLabel, color },
      ]}
      tickLine="y"
      gridAxis="y"
      withLegend={false}
      barProps={{ radius: 4, maxBarSize: 40 }}
    />
  );
}
