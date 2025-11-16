import { useState } from 'react';
import { Stack, Text, Group, ActionIcon } from '@mantine/core';
import { IconChartBar, IconChartLine } from '@tabler/icons-react';
import { ChartTypeEnum } from '@/shared/types';
import type { ChartDataPoint, ChartType } from '@/shared/types';
import type { ContainerSize } from '@/features/grid-layout';
import { ChartFactory } from './ChartFactory';
import './ActivityChart.css';

interface ActivityChartProps {
  title: string;
  data: ChartDataPoint[];
  dataLabel: string;
  color?: string;
  height?: number;
  chartType?: ChartType;
  /** コンテナサイズ（表示/非表示制御のみに使用） */
  containerSize?: ContainerSize;
}

/**
 * アクティビティチャートコンポーネント
 * タイトルとグラフを表示する統合コンポーネント
 * ユーザーがグラフタイプを切り替え可能
 * 
 * スタイリング:
 * - レイアウト・サイズはContainer Query CSS (ActivityChart.css) で管理
 * - 表示/非表示などのロジックはJavaScriptで管理
 */
export function ActivityChart({
  title,
  data,
  dataLabel,
  color = 'blue.6',
  height = 200,
  chartType: initialChartType = ChartTypeEnum.BAR,
  containerSize,
}: ActivityChartProps) {
  // グラフタイプの状態管理
  const [currentChartType, setCurrentChartType] = useState<ChartType>(initialChartType);

  // グラフタイプ切り替えハンドラー（イベント伝播を停止）
  const handleChartTypeChange = (type: ChartType) => (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素へのイベント伝播を停止
    e.preventDefault(); // デフォルト動作を防止
    setCurrentChartType(type);
  };
  
  // JavaScriptで管理する必要があるもの: 表示/非表示のロジックのみ
  const shouldShowControls = !containerSize || containerSize.category !== 'xs';

  return (
    <Stack 
      gap="sm"
      className="activity-chart-container"
      style={{ 
        height: '100%', 
        overflow: 'hidden',
      }}
    >
      <Group 
        justify="space-between" 
        align="center" 
        px="md"
        className="activity-chart-header"
      >
        <Text 
          fw={600}
          className="activity-chart-title"
        >
          {title}
        </Text>
        
        {/* グラフタイプ切り替えボタン（極小サイズでは非表示） */}
        {shouldShowControls && (
          <Group 
            gap="xs"
            className="activity-chart-controls"
          >
            <ActionIcon
              variant={currentChartType === ChartTypeEnum.BAR ? 'filled' : 'subtle'}
              color="blue"
              size="sm"
              onClick={handleChartTypeChange(ChartTypeEnum.BAR)}
              title="棒グラフで表示"
              className="activity-chart-button"
            >
              <IconChartBar size={16} className="activity-chart-icon" />
            </ActionIcon>
            <ActionIcon
              variant={currentChartType === ChartTypeEnum.LINE ? 'filled' : 'subtle'}
              color="teal"
              size="sm"
              onClick={handleChartTypeChange(ChartTypeEnum.LINE)}
              title="折れ線グラフで表示"
              className="activity-chart-button"
            >
              <IconChartLine size={16} className="activity-chart-icon" />
            </ActionIcon>
          </Group>
        )}
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
