/**
 * グリッドアイテム関連の共通型定義
 * Feature-Sliced Design: shared/types
 * 
 * グリッドシステムで使用される基本的なデータ構造を定義。
 * feature層（grid-item）とinfrastructure層（storage）の両方から使用される。
 */

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
  /** 行のスパン数（デフォルト: 1） */
  rowSpan?: 1 | 2;
}

/**
 * 保存されたレイアウト情報
 * StorageServiceで永続化されるデータ構造
 */
export interface SavedLayout {
  /** アイテムIDと位置のマッピング */
  positions: Record<string, GridPosition>;
}
