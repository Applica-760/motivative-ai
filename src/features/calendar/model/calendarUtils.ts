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

/**
 * 指定した日付の週の開始日（日曜日）を取得
 */
export function getStartOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay(); // 0 (日曜) - 6 (土曜)
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 指定した日付の週の終了日（土曜日）を取得
 */
export function getEndOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (6 - day));
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 今週と先週の2週間分の日付を取得（日曜始まり）
 */
export function getTwoWeeksDates(baseDate: Date = new Date()): Date[][] {
  // 今週の開始日（日曜）
  const thisWeekStart = getStartOfWeek(baseDate);
  
  // 先週の開始日（日曜）
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  
  // 先週の7日間
  const lastWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(lastWeekStart);
    date.setDate(date.getDate() + i);
    lastWeek.push(date);
  }
  
  // 今週の7日間
  const thisWeek: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(thisWeekStart);
    date.setDate(date.getDate() + i);
    thisWeek.push(date);
  }
  
  return [lastWeek, thisWeek];
}

/**
 * 日付を "M/D" 形式でフォーマット
 */
export function formatMonthDay(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * 曜日を取得（日本語短縮形）
 */
export function getWeekdayShort(date: Date): string {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return weekdays[date.getDay()];
}
