import type { ActivityRecord } from '@/shared/types';

/**
 * 記録用のユニークIDを生成
 */
export function generateRecordId(): string {
  return `record-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 指定した期間内の記録をフィルタリング
 */
export function filterRecordsByDateRange(
  records: ActivityRecord[],
  startDate: Date,
  endDate: Date
): ActivityRecord[] {
  return records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
}

/**
 * 指定したアクティビティIDの記録をフィルタリング
 */
export function filterRecordsByActivityId(
  records: ActivityRecord[],
  activityId: string
): ActivityRecord[] {
  return records.filter(record => record.activityId === activityId);
}
