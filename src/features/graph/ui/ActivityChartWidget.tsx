import { Box } from '@mantine/core';
import { ActivityChart } from './ActivityChart';
import type { ChartDataPoint, ChartType } from '@/shared/types';
import type { ContainerSize } from '@/features/grid-layout';

interface ActivityChartWidgetProps {
  data: ChartDataPoint[];
  dataLabel: string;
  color?: string;
  height?: number;
  chartType?: ChartType;
  onClick?: () => void;
  /** コンテナサイズ（表示/非表示制御のみに使用） */
  containerSize?: ContainerSize;
  /** チャートタイプ変更時のコールバック */
  onChartTypeChange?: (type: ChartType) => void;
}

/**
 * ActivityChartをウィジェットとして提供
 * グリッドアイテムに注入できる形式でラップ
 * 
 * クリック可能な場合は、適切なスタイルとアクセシビリティ属性を追加
 * 
 * 注意: 
 * - タイトル、アイコン、チャート切り替えボタンは GridItemHeader で表示されます
 * - このコンポーネントはチャート本体のみを表示します
 */
export function ActivityChartWidget({ 
  onClick, 
  onChartTypeChange,
  ...chartProps 
}: ActivityChartWidgetProps) {
  const isClickable = !!onClick;

  return (
    <Box
      onClick={onClick}
      style={{
        height: '100%',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={isClickable ? 'グラフの記録を追加' : undefined}
    >
      <ActivityChart 
        {...chartProps} 
        onChartTypeChange={onChartTypeChange}
      />
    </Box>
  );
}
