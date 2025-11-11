import type { ActivityDefinition } from '@/shared/types';

/**
 * カレンダーコンポーネントのプロパティ
 */
export interface ActivityCalendarProps {
  /** アクティビティの定義 */
  activity: ActivityDefinition;
  /** カレンダーの高さ（デフォルト: 300） */
  height?: number;
}

/**
 * カレンダーの日付データ
 */
export interface CalendarDateData {
  /** 日付 */
  date: Date;
  /** 達成状態（trueの場合は達成、falseの場合は未達成） */
  isAchieved: boolean;
}
