import { Center, Text, Stack } from '@mantine/core';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { ChartTypeEnum, type BaseChartProps, type ChartType } from '@/shared/types';

/**
 * グラフタイプに応じて適切なチャートコンポーネントを返す
 * データが空の場合は「データがありません」メッセージを表示
 */
export function ChartFactory({
  data,
  dataLabel,
  color,
  chartType = ChartTypeEnum.BAR,
}: BaseChartProps & { chartType?: ChartType }) {
  // データが空の場合は空状態を表示
  if (!data || data.length === 0) {
    return (
      <Center h="100%">
        <Stack gap="xs" align="center">
          <Text size="sm" c="dimmed">
            📊
          </Text>
          <Text size="xs" c="dimmed">
            データがありません
          </Text>
        </Stack>
      </Center>
    );
  }

  switch (chartType) {
    case ChartTypeEnum.LINE:
      return <LineChart data={data} dataLabel={dataLabel} color={color} />;
    case ChartTypeEnum.BAR:
    default:
      return <BarChart data={data} dataLabel={dataLabel} color={color} />;
  }
}
