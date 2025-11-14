import { Paper } from '@mantine/core';
import type { ReactNode } from 'react';

/**
 * ChartCardのプロパティ
 */
export interface ChartCardProps {
  /** カード内に表示するコンテンツ */
  children: ReactNode;
  /** 背景色 */
  backgroundColor?: string;
  /** パディング */
  padding?: string | number;
  /** 高さ */
  height?: string | number;
}

/**
 * 横長のチャートカード
 * グリッドレイアウトの2×1サイズ（横長）で使用される標準的なカード
 * 
 * 使用例:
 * - アクティビティグラフ
 * - 統計情報の表示
 * - ダッシュボードウィジェット
 * など、横長のコンテンツ表示
 */
export function ChartCard({
  children,
  backgroundColor,
  padding = 'lg',
  height = '100%',
}: ChartCardProps) {
  return (
    <Paper
      shadow="lg"
      radius="md"
      p={padding}
      withBorder
      style={{
        width: '100%',
        height,
        display: 'flex',
        flexDirection: 'column',
        ...(backgroundColor && {
          backgroundColor,
        }),
      }}
    >
      {children}
    </Paper>
  );
}
