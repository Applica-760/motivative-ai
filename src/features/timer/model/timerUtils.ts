/**
 * タイマー関連のユーティリティ関数
 */

/**
 * 秒数を HH:MM:SS 形式にフォーマット
 * @param seconds - 秒数
 * @returns HH:MM:SS 形式の文字列
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map((val) => String(val).padStart(2, '0'))
    .join(':');
}

/**
 * 秒数を分に変換（小数点以下切り捨て）
 * @param seconds - 秒数
 * @returns 分数
 */
export function secondsToMinutes(seconds: number): number {
  return Math.floor(seconds / 60);
}

/**
 * 分を秒に変換
 * @param minutes - 分数
 * @returns 秒数
 */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

/**
 * RingProgressの進捗率を計算（最大60分まで表示）
 * @param seconds - 経過秒数
 * @returns 0-100の進捗率
 */
export function calculateProgress(seconds: number): number {
  const maxSeconds = 60 * 60; // 60分
  return Math.min((seconds / maxSeconds) * 100, 100);
}
