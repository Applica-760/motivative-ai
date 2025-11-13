import type { ActivityRecord, ActivityValue } from '@/shared/types';
import type { TextLogItem } from './textLogTypes';

/**
 * テキストを指定文字数で省略する
 * 
 * @param text - 元のテキスト
 * @param maxLength - 最大文字数（デフォルト: 50）
 * @returns 省略されたテキスト
 */
export function truncateText(text: string, maxLength = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * 日付を表示用フォーマットに変換
 * 
 * @param dateString - YYYY-MM-DD形式の日付文字列
 * @returns YYYY/MM/DD形式の日付文字列
 */
export function formatDisplayDate(dateString: string): string {
  return dateString.replace(/-/g, '/');
}

/**
 * ActivityRecordをTextLogItemに変換
 * 
 * @param record - アクティビティ記録
 * @returns テキストログ表示項目
 */
export function toTextLogItem(record: ActivityRecord): TextLogItem | null {
  // テキスト型以外は除外
  if (record.value.type !== 'text') {
    return null;
  }

  const text = record.value.value;
  const displayText = truncateText(text);

  return {
    id: record.id,
    date: record.date,
    text,
    displayText,
    isTruncated: text.length > displayText.length,
  };
}

/**
 * 記録配列をTextLogItem配列に変換（新しい順）
 * 
 * @param records - アクティビティ記録配列
 * @param limit - 取得する最大件数（デフォルト: 5）
 * @returns テキストログ表示項目配列
 */
export function toTextLogItems(records: ActivityRecord[], limit = 5): TextLogItem[] {
  return records
    .filter((record) => record.value.type === 'text')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(toTextLogItem)
    .filter((item): item is TextLogItem => item !== null);
}

/**
 * ActivityValueからテキストを抽出
 * 
 * @param value - アクティビティの値
 * @returns テキスト（テキスト型以外は空文字列）
 */
export function extractTextValue(value: ActivityValue): string {
  return value.type === 'text' ? value.value : '';
}
