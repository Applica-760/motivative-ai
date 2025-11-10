import type { ActivityRecord } from '@/shared/types';
import type { StorageService } from '@/shared/services/storage';
import type { RecordRepository } from './RecordRepository.interface';
import { generateRecordId } from '../../model/activityUtils';

/**
 * RecordRepositoryの実装
 * Feature-Sliced Design: features/activity/api
 * 
 * StorageServiceを使用してアクティビティ記録を管理。
 * ビジネスロジック（ID生成、日時管理、フィルタリング）を含む。
 */
export class RecordRepositoryImpl implements RecordRepository {
  private readonly storage: StorageService;
  
  constructor(storage: StorageService) {
    this.storage = storage;
  }
  
  /**
   * すべての記録を取得
   */
  async getAll(): Promise<ActivityRecord[]> {
    try {
      return await this.storage.getRecords();
    } catch (error) {
      console.error('[RecordRepository] Failed to get all records:', error);
      throw new Error('Failed to fetch records');
    }
  }
  
  /**
   * IDで記録を取得
   */
  async getById(id: string): Promise<ActivityRecord | null> {
    try {
      const records = await this.storage.getRecords();
      return records.find(r => r.id === id) || null;
    } catch (error) {
      console.error(`[RecordRepository] Failed to get record by id: ${id}`, error);
      throw new Error(`Failed to fetch record: ${id}`);
    }
  }
  
  /**
   * 特定のアクティビティに紐づく記録を取得
   */
  async getByActivityId(activityId: string): Promise<ActivityRecord[]> {
    try {
      return await this.storage.getRecordsByActivityId(activityId);
    } catch (error) {
      console.error(`[RecordRepository] Failed to get records by activity id: ${activityId}`, error);
      throw new Error(`Failed to fetch records for activity: ${activityId}`);
    }
  }
  
  /**
   * 期間を指定して記録を取得
   */
  async getByDateRange(startDate: string, endDate: string): Promise<ActivityRecord[]> {
    try {
      const records = await this.storage.getRecords();
      return records.filter(r => {
        const recordDate = r.date;
        return recordDate >= startDate && recordDate <= endDate;
      });
    } catch (error) {
      console.error(`[RecordRepository] Failed to get records by date range: ${startDate} - ${endDate}`, error);
      throw new Error('Failed to fetch records by date range');
    }
  }
  
  /**
   * 特定のアクティビティの特定期間の記録を取得
   */
  async getByActivityIdAndDateRange(
    activityId: string,
    startDate: string,
    endDate: string
  ): Promise<ActivityRecord[]> {
    try {
      const records = await this.storage.getRecordsByActivityId(activityId);
      return records.filter(r => {
        const recordDate = r.date;
        return recordDate >= startDate && recordDate <= endDate;
      });
    } catch (error) {
      console.error(
        `[RecordRepository] Failed to get records by activity and date range: ${activityId}, ${startDate} - ${endDate}`,
        error
      );
      throw new Error('Failed to fetch records by activity and date range');
    }
  }
  
  /**
   * 新しい記録を作成
   */
  async create(
    data: Omit<ActivityRecord, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>
  ): Promise<ActivityRecord> {
    try {
      const now = new Date();
      const newRecord: ActivityRecord = {
        ...data,
        id: generateRecordId(),
        timestamp: now,
        createdAt: now,
        updatedAt: now,
      };
      
      return await this.storage.addRecord(newRecord);
    } catch (error) {
      console.error('[RecordRepository] Failed to create record:', error);
      throw new Error('Failed to create record');
    }
  }
  
  /**
   * 記録を更新
   */
  async update(
    id: string,
    updates: Partial<Omit<ActivityRecord, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>>
  ): Promise<ActivityRecord> {
    try {
      const safeUpdates = {
        ...updates,
        updatedAt: new Date(),
      };
      
      return await this.storage.updateRecord(id, safeUpdates);
    } catch (error) {
      console.error(`[RecordRepository] Failed to update record: ${id}`, error);
      throw new Error(`Failed to update record: ${id}`);
    }
  }
  
  /**
   * 記録を削除
   */
  async delete(id: string): Promise<void> {
    try {
      await this.storage.deleteRecord(id);
    } catch (error) {
      console.error(`[RecordRepository] Failed to delete record: ${id}`, error);
      throw new Error(`Failed to delete record: ${id}`);
    }
  }
}
