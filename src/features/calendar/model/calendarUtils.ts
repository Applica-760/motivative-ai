/**
 * カレンダーに関するユーティリティ関数
 * ビジネスロジックをUI層から分離
 */

/**
 * 年月を "YYYY.M" 形式でフォーマット
 */
export function formatYearMonth(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth() + 1}`;
}

/**
 * 2つの日付が同じ月かどうかを判定
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * 2つの日付が同じ日かどうかを判定
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    isSameMonth(date1, date2) &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 月の最初の日を取得
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * 月の最後の日を取得
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * 月内の全日付を配列で取得
 */
export function getDaysInMonth(date: Date): Date[] {
  const lastDay = getLastDayOfMonth(date);
  const days: Date[] = [];
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), day));
  }
  
  return days;
}
