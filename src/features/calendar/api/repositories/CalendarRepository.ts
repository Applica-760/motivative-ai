import type { StorageService } from '@/shared/services/storage';
import type { ActivityRecord } from '@/shared/types';
import { isSameDay } from '../../model';

/**
 * カレンダーに関するデータアクセスを管理するRepository
 * 
 * レイヤードアーキテクチャのDomain層に位置し、
 * Presentation層とInfrastructure層を仲介する
 */
export class CalendarRepository {
  private storage: StorageService;

  constructor(storage: StorageService) {
    this.storage = storage;
  }

  /**
   * 特定のアクティビティの指定月の記録を取得
   * 
   * @param activityId - アクティビティID
   * @param year - 年
   * @param month - 月（1-12）
   * @returns その月の記録の配列
   */
  async getMonthlyRecords(
    activityId: string,
    year: number,
    month: number
  ): Promise<ActivityRecord[]> {
    try {
      const allRecords = await this.storage.getRecords();
      
      // 指定されたアクティビティかつ指定された月の記録をフィルタリング
      return allRecords.filter((record) => {
        if (record.activityId !== activityId) return false;
        
        const recordDate = new Date(record.date);
        return (
          recordDate.getFullYear() === year &&
          recordDate.getMonth() === month - 1
        );
      });
    } catch (error) {
      console.error('[CalendarRepository] Failed to get monthly records:', error);
      throw error;
    }
  }

  /**
   * 特定の日付に記録が存在するかチェック
   * 
   * @param activityId - アクティビティID
   * @param date - チェックする日付
   * @returns 記録が存在する場合true
   */
  async hasRecordOnDate(
    activityId: string,
    date: Date
  ): Promise<boolean> {
    try {
      const allRecords = await this.storage.getRecords();
      
      return allRecords.some((record) => {
        if (record.activityId !== activityId) return false;
        
        const recordDate = new Date(record.date);
        return isSameDay(recordDate, date);
      });
    } catch (error) {
      console.error('[CalendarRepository] Failed to check record on date:', error);
      throw error;
    }
  }

  /**
   * 指定された日付範囲の記録を取得
   * 
   * @param activityId - アクティビティID
   * @param startDate - 開始日
   * @param endDate - 終了日
   * @returns その期間の記録の配列
   */
  async getRecordsInRange(
    activityId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ActivityRecord[]> {
    try {
      const allRecords = await this.storage.getRecords();
      
      return allRecords.filter((record) => {
        if (record.activityId !== activityId) return false;
        
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });
    } catch (error) {
      console.error('[CalendarRepository] Failed to get records in range:', error);
      throw error;
    }
  }
}
