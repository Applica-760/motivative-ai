import type { GridItemConfig } from '@/features/grid-layout';
import { colors } from '@/shared/config';
import { TimerWidget } from '../ui/TimerWidget';

/**
 * Timerフィーチャーが提供するグリッドアイテムを生成
 * Feature-Sliced Design: 各featureが自身のグリッド設定を管理
 * 
 * タイマーウィジェットを1×2の縦長グリッドとして提供
 * 
 * @param startOrder - グリッドアイテムの開始順序（他のウィジェットとの調整用）
 */
export function createTimerGridItems(startOrder = 0): GridItemConfig[] {
  return [
    {
      id: 'timer-widget',
      order: startOrder,
      size: 'small-vertical',
      position: {
        column: 1,
        row: 3,
        columnSpan: 1,
        rowSpan: 2,
      },
      header: {
        icon: '⏱️',
        title: 'タイマー',
      },
      content: (containerSize) => <TimerWidget containerSize={containerSize} />,
      backgroundColor: colors.gridItem.default,
      shadow: 'md',
    },
  ];
}
