import type { ActivityRecord, ActivityValue } from '@/shared/types';

/**
 * 日付をYYYY-MM-DD形式の文字列に変換
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 今日の日付をYYYY-MM-DD形式で取得
 */
export function getTodayDateString(): string {
  return formatDateString(new Date());
}

/**
 * ActivityValueから数値を抽出（グラフ表示用）
 * 数値型以外は0を返す
 */
export function extractNumericValue(value: ActivityValue): number {
  switch (value.type) {
    case 'number':
      return value.value;
    case 'duration':
      return value.value;
    case 'boolean':
      return value.value ? 1 : 0;
    default:
      return 0;
  }
}

/**
 * ActivityValueを表示用の文字列に変換
 */
export function formatActivityValue(value: ActivityValue): string {
  switch (value.type) {
    case 'number':
      return value.unit ? `${value.value}${value.unit}` : String(value.value);
    case 'duration':
      return `${value.value}分`;
    case 'boolean':
      return value.value ? '実施' : '未実施';
    case 'text':
      return value.value;
    case 'image':
      return '画像';
    default:
      return '';
  }
}

/**
 * 記録を日付でソート（新しい順）
 */
export function sortRecordsByDate(records: ActivityRecord[]): ActivityRecord[] {
  return [...records].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * 記録の合計値を計算（数値型のみ）
 */
export function calculateTotalValue(records: ActivityRecord[]): number {
  return records.reduce((sum, record) => {
    return sum + extractNumericValue(record.value);
  }, 0);
}

/**
 * 記録の平均値を計算（数値型のみ）
 */
export function calculateAverageValue(records: ActivityRecord[]): number {
  if (records.length === 0) return 0;
  const total = calculateTotalValue(records);
  return total / records.length;
}

