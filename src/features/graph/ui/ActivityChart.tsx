import { useState } from 'react';
import { Stack, Text, Group, ActionIcon } from '@mantine/core';
import { IconChartBar, IconChartLine } from '@tabler/icons-react';
import { ChartTypeEnum } from '@/shared/types';
import type { ChartDataPoint, ChartType } from '@/shared/types';
import { ChartFactory } from './ChartFactory';

interface ActivityChartProps {
  title: string;
  data: ChartDataPoint[];
  dataLabel: string;
  color?: string;
  height?: number;
  chartType?: ChartType;
}

/**
 * アクティビティチャートコンポーネント
 * タイトルとグラフを表示する統合コンポーネント
 * ユーザーがグラフタイプを切り替え可能
 */
export function ActivityChart({
  title,
  data,
  dataLabel,
  color = 'blue.6',
  height = 200,
  chartType: initialChartType = ChartTypeEnum.BAR,
}: ActivityChartProps) {
  // グラフタイプの状態管理
  const [currentChartType, setCurrentChartType] = useState<ChartType>(initialChartType);

  // グラフタイプ切り替えハンドラー（イベント伝播を停止）
  const handleChartTypeChange = (type: ChartType) => (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素へのイベント伝播を停止
    e.preventDefault(); // デフォルト動作を防止
    setCurrentChartType(type);
  };

  return (
    <Stack gap="sm" style={{ height: '100%', overflow: 'hidden' }}>
      <Group justify="space-between" align="center" px="md">
        <Text size="md" fw={600}>
          {title}
        </Text>
        
        {/* グラフタイプ切り替えボタン */}
        <Group gap="xs">
          <ActionIcon
            variant={currentChartType === ChartTypeEnum.BAR ? 'filled' : 'subtle'}
            color="blue"
            size="sm"
            onClick={handleChartTypeChange(ChartTypeEnum.BAR)}
            title="棒グラフで表示"
          >
            <IconChartBar size={16} />
          </ActionIcon>
          <ActionIcon
            variant={currentChartType === ChartTypeEnum.LINE ? 'filled' : 'subtle'}
            color="teal"
            size="sm"
            onClick={handleChartTypeChange(ChartTypeEnum.LINE)}
            title="折れ線グラフで表示"
          >
            <IconChartLine size={16} />
          </ActionIcon>
        </Group>
      </Group>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ChartFactory
          data={data}
          dataLabel={dataLabel}
          color={color}
          height={height}
          chartType={currentChartType}
        />
      </div>
    </Stack>
  );
}
