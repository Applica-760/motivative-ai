import type { StorageService } from '@/shared/services/storage';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { secondsToMinutes } from '../../model/timerUtils';

/**
 * Timer用のRepository
 * 
 * 3層アーキテクチャのDomain層に位置し、以下の責務を持つ:
 * - Activity/Record操作（StorageServiceを通して）
 * - Timer状態の永続化
 * - 選択アクティビティの永続化
 * 
 * ActivityContextへの直接依存を排除し、StorageServiceを介してデータアクセス
 */
export class TimerRepository {
  private readonly TIMER_STATE_KEY = 'timer-state';
  private readonly SELECTED_ACTIVITY_KEY = 'timer-selected-activity';
  private readonly storage: StorageService;
  
  constructor(storage: StorageService) {
    this.storage = storage;
  }

  // ==================== Activity関連 ====================
  
  /**
   * duration型のアクティビティを取得
   * 
   * @returns アーカイブされていないduration型のアクティビティ一覧
   * @throws StorageError ストレージアクセスに失敗した場合
   */
  async getDurationActivities(): Promise<ActivityDefinition[]> {
    try {
      const activities = await this.storage.getActivities();
      return activities.filter(
        (activity) => activity.valueType === 'duration' && !activity.isArchived
      );
    } catch (error) {
      console.error('[TimerRepository] Failed to get duration activities:', error);
      throw error;
    }
  }

  /**
   * 記録を追加
   * 
   * @param activityId - 記録対象のアクティビティID
   * @param seconds - 経過秒数
   * @param note - 記録に付与するメモ（オプション）
   * @throws StorageError ストレージアクセスに失敗した場合
   */
  async addRecord(
    activityId: string,
    seconds: number,
    note?: string
  ): Promise<void> {
    try {
      const minutes = secondsToMinutes(seconds);
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

      const record: ActivityRecord = {
        id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        activityId,
        value: {
          type: 'duration',
          value: minutes,
          unit: 'minutes',
        },
        date: dateStr,
        timestamp: now,
        note: note || 'タイマーから記録',
        createdAt: now,
        updatedAt: now,
      };

      await this.storage.addRecord(record);
      console.log('[TimerRepository] Record added:', { activityId, minutes });
    } catch (error) {
      console.error('[TimerRepository] Failed to add record:', error);
      throw error;
    }
  }

  // ==================== Timer状態管理 ====================
  
  /**
   * Timer状態を読み込み
   * 
   * @returns Timer状態オブジェクト、存在しない場合はnull
   */
  async loadTimerState(): Promise<{ seconds: number; status: string } | null> {
    try {
      const data = await this.storage.getCustomData(this.TIMER_STATE_KEY);
      if (!data) {
        return null;
      }
      
      const parsed = JSON.parse(data);
      return parsed;
    } catch (error) {
      console.error('[TimerRepository] Failed to load timer state:', error);
      return null;
    }
  }

  /**
   * Timer状態を保存
   * 
   * @param seconds - 経過秒数
   * @param status - タイマーの状態（idle/running/stopped）
   */
  async saveTimerState(seconds: number, status: string): Promise<void> {
    try {
      await this.storage.setCustomData(
        this.TIMER_STATE_KEY,
        JSON.stringify({ seconds, status })
      );
    } catch (error) {
      console.error('[TimerRepository] Failed to save timer state:', error);
      // 保存失敗は非致命的なのでthrowしない
    }
  }

  /**
   * Timer状態を削除
   */
  async clearTimerState(): Promise<void> {
    try {
      await this.storage.deleteCustomData(this.TIMER_STATE_KEY);
    } catch (error) {
      console.error('[TimerRepository] Failed to clear timer state:', error);
      // 削除失敗は非致命的なのでthrowしない
    }
  }

  // ==================== 選択アクティビティ ====================
  
  /**
   * 選択中のアクティビティIDを読み込み
   * 
   * @returns 選択中のアクティビティID、未選択の場合はnull
   */
  async loadSelectedActivity(): Promise<string | null> {
    try {
      return await this.storage.getCustomData(this.SELECTED_ACTIVITY_KEY);
    } catch (error) {
      console.error('[TimerRepository] Failed to load selected activity:', error);
      return null;
    }
  }

  /**
   * 選択中のアクティビティIDを保存
   * 
   * @param activityId - 選択するアクティビティのID
   */
  async saveSelectedActivity(activityId: string): Promise<void> {
    try {
      await this.storage.setCustomData(this.SELECTED_ACTIVITY_KEY, activityId);
    } catch (error) {
      console.error('[TimerRepository] Failed to save selected activity:', error);
      // 保存失敗は非致命的なのでthrowしない
    }
  }
}
