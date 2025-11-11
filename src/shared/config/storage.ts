/**
 * localStorage キーの一元管理
 * Feature-Sliced Design: shared/config
 * 
 * アプリケーション全体で使用されるlocalStorageのキーを定数として定義。
 * キーの重複を防ぎ、変更時の影響範囲を明確にする。
 */

export const STORAGE_KEYS = {
  /** グリッドレイアウトのアイテム順序 */
  GRID_LAYOUT_ORDER: 'grid-layout-order',
  
  /** アクティビティ定義 */
  ACTIVITIES: 'motivative-ai-activities',
  
  /** アクティビティ記録 */
  RECORDS: 'motivative-ai-records',
  
  /** ユーザープロフィール */
  PROFILE: 'motivative-ai-profile',
  
  /** ユーザー設定（将来の拡張用） */
  USER_PREFERENCES: 'user-preferences',
  
  /** テーマ設定（将来の拡張用） */
  THEME: 'theme',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
