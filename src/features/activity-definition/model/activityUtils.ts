/**
 * アクティビティ定義用のユーティリティ関数
 */

/**
 * アクティビティ用のユニークIDを生成
 */
export function generateActivityId(): string {
  return `activity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
