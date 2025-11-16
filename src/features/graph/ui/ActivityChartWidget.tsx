import { Box } from '@mantine/core';
import { ActivityChart } from './ActivityChart';
import type { ChartDataPoint, ChartType } from '@/shared/types';
import type { ContainerSize } from '@/features/grid-layout';

interface ActivityChartWidgetProps {
  title: string;
  data: ChartDataPoint[];
  dataLabel: string;
  color?: string;
  height?: number;
  chartType?: ChartType;
  onClick?: () => void;
  /** コンテナサイズ（表示/非表示制御のみに使用） */
  containerSize?: ContainerSize;
}

/**
 * ActivityChartをウィジェットとして提供
 * グリッドアイテムに注入できる形式でラップ
 * 
 * クリック可能な場合は、適切なスタイルとアクセシビリティ属性を追加
 */
export function ActivityChartWidget({ 
  onClick, 
  containerSize,
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
      aria-label={isClickable ? `${chartProps.title}の記録を追加` : undefined}
    >
      <ActivityChart {...chartProps} containerSize={containerSize} />
    </Box>
  );
}
