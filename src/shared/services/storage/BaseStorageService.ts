import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { StorageError } from './types';

/**
 * StorageServiceの基底クラス
 * Feature-Sliced Design: shared/services/storage
 * 
 * LocalStorageとFirebaseStorageで共通のCRUD操作パターンを提供。
 * 各実装はストレージ固有の処理（getAll/saveAll）のみを実装すればよい。
 */
export abstract class BaseStorageService {
  // ==================== Abstract Methods ====================
  // 各実装が提供する必要があるメソッド
  
  protected abstract getAllActivities(): Promise<ActivityDefinition[]>;
  protected abstract saveAllActivities(activities: ActivityDefinition[]): Promise<void>;
  protected abstract getAllRecords(): Promise<ActivityRecord[]>;
  protected abstract saveAllRecords(records: ActivityRecord[]): Promise<void>;
  
  // ==================== Common Activities Methods ====================
  
  /**
   * アクティビティを追加
   * 共通ロジック: updatedAtの更新、配列への追加、保存
   */
  async addActivity(activity: ActivityDefinition): Promise<ActivityDefinition> {
    const activities = await this.getAllActivities();
    const newActivity = {
      ...activity,
      updatedAt: new Date(),
    };
    
    activities.push(newActivity);
    await this.saveAllActivities(activities);
    
    return newActivity;
  }
  
  /**
   * アクティビティを更新
   * 共通ロジック: 存在確認、updatedAtの更新、保存
   */
  async updateActivity(
    id: string,
    updates: Partial<ActivityDefinition>
  ): Promise<ActivityDefinition> {
    const activities = await this.getAllActivities();
    const index = activities.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new StorageError(
        `Activity not found: ${id}`,
        'write'
      );
    }
    
    const updatedActivity = {
      ...activities[index],
      ...updates,
      id, // IDは変更不可
      updatedAt: new Date(),
    };
    
    activities[index] = updatedActivity;
    await this.saveAllActivities(activities);
    
    return updatedActivity;
  }
  
  /**
   * アクティビティを削除
   * 共通ロジック: 存在確認、フィルタリング、保存
   */
  async deleteActivity(id: string): Promise<void> {
    const activities = await this.getAllActivities();
    const filtered = activities.filter(a => a.id !== id);
    
    if (filtered.length === activities.length) {
      throw new StorageError(
        `Activity not found: ${id}`,
        'delete'
      );
    }
    
    await this.saveAllActivities(filtered);
  }
  
  // ==================== Common Records Methods ====================
  
  /**
   * 記録を追加
   * 共通ロジック: updatedAtの更新、配列への追加、保存
   */
  async addRecord(record: ActivityRecord): Promise<ActivityRecord> {
    const records = await this.getAllRecords();
    const newRecord = {
      ...record,
      updatedAt: new Date(),
    };
    
    records.push(newRecord);
    await this.saveAllRecords(records);
    
    return newRecord;
  }
  
  /**
   * 記録を更新
   * 共通ロジック: 存在確認、updatedAtの更新、保存
   */
  async updateRecord(
    id: string,
    updates: Partial<ActivityRecord>
  ): Promise<ActivityRecord> {
    const records = await this.getAllRecords();
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new StorageError(
        `Record not found: ${id}`,
        'write'
      );
    }
    
    const updatedRecord = {
      ...records[index],
      ...updates,
      id, // IDは変更不可
      updatedAt: new Date(),
    };
    
    records[index] = updatedRecord;
    await this.saveAllRecords(records);
    
    return updatedRecord;
  }
  
  /**
   * 記録を削除
   * 共通ロジック: 存在確認、フィルタリング、保存
   */
  async deleteRecord(id: string): Promise<void> {
    const records = await this.getAllRecords();
    const filtered = records.filter(r => r.id !== id);
    
    if (filtered.length === records.length) {
      throw new StorageError(
        `Record not found: ${id}`,
        'delete'
      );
    }
    
    await this.saveAllRecords(filtered);
  }
  
  /**
   * 特定のアクティビティに関連する記録を取得
   * 共通ロジック: フィルタリング
   */
  async getRecordsByActivityId(activityId: string): Promise<ActivityRecord[]> {
    const records = await this.getAllRecords();
    return records.filter(r => r.activityId === activityId);
  }
}
