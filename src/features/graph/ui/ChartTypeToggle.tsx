import { Group, ActionIcon } from '@mantine/core';
import { IconChartBar, IconChartLine } from '@tabler/icons-react';
import { ChartTypeEnum } from '@/shared/types';
import type { ChartType } from '@/shared/types';

interface ChartTypeToggleProps {
  /** 現在のチャートタイプ */
  currentType: ChartType;
  /** チャートタイプ変更時のハンドラー */
  onTypeChange: (type: ChartType) => void;
}

/**
 * チャートタイプ切り替えボタン
 * 
 * グリッドヘッダーのactionsとして使用されることを想定
 * 棒グラフと折れ線グラフの切り替えが可能
 */
export function ChartTypeToggle({ currentType, onTypeChange }: ChartTypeToggleProps) {
  const handleToggle = (type: ChartType) => (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素へのイベント伝播を停止
    e.preventDefault(); // デフォルト動作を防止
    onTypeChange(type);
  };

  return (
    <Group gap="xs" wrap="nowrap">
      <ActionIcon
        variant={currentType === ChartTypeEnum.BAR ? 'filled' : 'subtle'}
        color="blue"
        size="sm"
        onClick={handleToggle(ChartTypeEnum.BAR)}
        title="棒グラフで表示"
      >
        <IconChartBar size={16} />
      </ActionIcon>
      <ActionIcon
        variant={currentType === ChartTypeEnum.LINE ? 'filled' : 'subtle'}
        color="teal"
        size="sm"
        onClick={handleToggle(ChartTypeEnum.LINE)}
        title="折れ線グラフで表示"
      >
        <IconChartLine size={16} />
      </ActionIcon>
    </Group>
  );
}
