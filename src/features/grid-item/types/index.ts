import type { ReactNode } from 'react';
import type { GridPosition, SavedLayout } from '@/shared/types';
import type { ContainerSize } from '../hooks/useContainerSize';

/**
 * グリッドアイテムのサイズ定義
 * - small-square: 正方形のグリッドアイテム（2列に並ぶ）
 * - small-rectangle: 長方形のグリッドアイテム（全幅）
 * - small-vertical: 縦長の長方形グリッドアイテム（2行分の高さ）
 * - medium: 中サイズ（将来の拡張用）
 * - large: 大サイズ（将来の拡張用）
 */
export type GridItemSize = 'small-square' | 'small-rectangle' | 'small-vertical' | 'medium' | 'large';

/**
 * グリッドアイテムの位置情報とレイアウト保存の型
 * shared層から再エクスポート（storage層との共有のため）
 */
export type { GridPosition, SavedLayout };

/**
 * グリッドアイテムのコンテンツレンダー関数
 * コンテナサイズに応じて動的にレンダリングするための関数型
 */
export type GridItemRenderFunction = (containerSize: ContainerSize) => ReactNode;

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
  /** 
   * ヘッダー情報（オプション）
   * アイコンとタイトルを統一的なスタイルで表示
   */
  header?: {
    /** アイコン（絵文字） */
    icon: string;
    /** タイトル */
    title: string;
    /** 右側に配置する追加要素（チャート切り替えボタンなど） */
    actions?: ReactNode;
  };
  /** 
   * 表示するコンテンツ
   * - ReactNode: 静的なコンテンツ
   * - GridItemRenderFunction: コンテナサイズに応じて動的にレンダリング
   */
  content: ReactNode | GridItemRenderFunction;
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
  'small-vertical': { base: 1, sm: 2, md: 2 },
  'medium': { base: 1, sm: 1, md: 2 },
  'large': { base: 1, sm: 1, md: 1 },
};

/**
 * グリッドの列数定義
 */
export const GRID_COLUMNS = {
  DESKTOP: 5,
  MOBILE: 2,
} as const;

/**
 * セルサイズの型定義
 */
export interface CellSize {
  width: number;
  height: number;
}
