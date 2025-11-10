import type { ReactNode } from 'react';

/**
 * グリッドアイテムのサイズ定義
 * - small-square: 正方形のグリッドアイテム（2列に並ぶ）
 * - small-rectangle: 長方形のグリッドアイテム（全幅）
 * - medium: 中サイズ（将来の拡張用）
 * - large: 大サイズ（将来の拡張用）
 */
export type GridItemSize = 'small-square' | 'small-rectangle' | 'medium' | 'large';

/**
 * グリッドアイテムの位置情報
 * n×4グリッド（モバイルはn×2）での明示的な配置を管理
 */
export interface GridPosition {
  /** 列位置（1-4 デスクトップ、1-2 モバイル） */
  column: number;
  /** 行位置（1-n） */
  row: number;
  /** 列のスパン数（1=正方形、2=長方形） */
  columnSpan: 1 | 2;
}

/**
 * グリッドアイテムの設定
 */
export interface GridItemConfig {
  /** アイテムの一意なID */
  id: string;
  /** 表示順序（ドラッグ&ドロップ時の並び替えに使用） */
  order: number;
  /** アイテムのサイズ */
  size: GridItemSize;
  /** グリッド上の配置位置（必須：明示的な位置管理） */
  position: GridPosition;
  /** 表示するコンテンツ */
  content: ReactNode;
  /** 背景色（オプション） */
  backgroundColor?: string;
  /** ボックスシャドウのカスタム設定（オプション） */
  customShadow?: {
    default: string;
    hover: string;
  };
  /** Mantineの標準シャドウ（オプション） */
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** クリック時のアクション（オプション） */
  onClick?: () => void;
  /** クリック可能かどうか（デフォルト: onClickが定義されている場合true） */
  clickable?: boolean;
}

/**
 * レスポンシブなグリッドカラム数の設定
 */
export interface GridColumns {
  base: number;
  sm: number;
  md: number;
}

/**
 * サイズごとのカラム数マッピング
 */
export const GRID_SIZE_MAP: Record<GridItemSize, GridColumns> = {
  'small-square': { base: 1, sm: 2, md: 2 },
  'small-rectangle': { base: 1, sm: 1, md: 1 },
  'medium': { base: 1, sm: 1, md: 2 },
  'large': { base: 1, sm: 1, md: 1 },
};

/**
 * グリッドの列数定義
 */
export const GRID_COLUMNS = {
  DESKTOP: 4,
  MOBILE: 2,
} as const;

/**
 * セルサイズの型定義
 */
export interface CellSize {
  width: number;
  height: number;
}

/**
 * 保存されたレイアウト情報
 */
export interface SavedLayout {
  positions: Record<string, GridPosition>;
}
