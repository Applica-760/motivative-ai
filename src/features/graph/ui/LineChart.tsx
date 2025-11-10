import { LineChart as MantineLineChart } from '@mantine/charts';
import type { BaseChartProps } from '@/shared/types';

/**
 * 折れ線グラフコンポーネント
 * Mantineの折れ線グラフをラップし、統一されたインターフェースを提供
 * 値が0のデータポイントはnullに変換して、点と線を描画しない（横軸は固定）
 */
export function LineChart({
  data,
  dataLabel,
  color = 'teal.6',
}: Omit<BaseChartProps, 'height'>) {
  // 値が0のデータポイントをnullに変換（横軸は全期間保持、点と線のみ非表示）
  const processedData = data.map(point => ({
    date: point.date,
    value: point.value > 0 ? point.value : null,
  }));

  return (
    <MantineLineChart
      h="100%"
      data={processedData}
      dataKey="date"
      series={[
        { name: 'value', label: dataLabel, color },
      ]}
      tickLine="y"
      gridAxis="y"
      withLegend={false}
      curveType="linear"
      strokeWidth={2}
      dotProps={{ r: 4, strokeWidth: 2 }}
      connectNulls={false}
    />
  );
}
