/**
 * グラフ表示用のデータポイント
 */
export interface ChartDataPoint {
  /** 日付（表示ラベル） */
  date: string;
  /** 値（数値） */
  value: number;
}

/**
 * グラフの表示タイプ
 */
export const ChartType = {
  BAR: 'bar',
  LINE: 'line',
} as const;

export type ChartType = typeof ChartType[keyof typeof ChartType];

/**
 * グラフの共通プロパティ
 */
export interface BaseChartProps {
  /** グラフデータ */
  data: ChartDataPoint[];
  /** データラベル（凡例） */
  dataLabel: string;
  /** グラフの色 */
  color?: string;
  /** グラフの高さ（px） */
  height?: number;
}

/**
 * アクティビティチャートのプロパティ
 */
export interface ActivityChartData {
  /** チャートのタイトル */
  title: string;
  /** グラフデータ */
  data: ChartDataPoint[];
  /** データラベル */
  dataLabel: string;
  /** グラフの色 */
  color?: string;
  /** グラフの高さ */
  height?: number;
  /** グラフタイプ（デフォルトは棒グラフ） */
  chartType?: ChartType;
}
