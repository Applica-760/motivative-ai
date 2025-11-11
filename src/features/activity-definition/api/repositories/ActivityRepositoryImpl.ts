import type { ActivityDefinition } from '@/shared/types';
import type { StorageService } from '@/shared/services/storage';
import type { ActivityRepository } from './ActivityRepository.interface';
import { generateActivityId } from '../../model/activityUtils';

/**
 * ActivityRepositoryの実装
 * Feature-Sliced Design: features/activity-definition/api
 * 
 * StorageServiceを使用してアクティビティ定義を管理。
 * ビジネスロジック（ID生成、日時管理、order計算）を含む。
 */
export class ActivityRepositoryImpl implements ActivityRepository {
  private readonly storage: StorageService;
  
  constructor(storage: StorageService) {
    this.storage = storage;
  }
  
  /**
   * すべてのアクティビティを取得
   */
  async getAll(): Promise<ActivityDefinition[]> {
    try {
      return await this.storage.getActivities();
    } catch (error) {
      console.error('[ActivityRepository] Failed to get all activities:', error);
      throw new Error('Failed to fetch activities');
    }
  }
  
  /**
   * IDでアクティビティを取得
   */
  async getById(id: string): Promise<ActivityDefinition | null> {
    try {
      const activities = await this.storage.getActivities();
      return activities.find(a => a.id === id) || null;
    } catch (error) {
      console.error(`[ActivityRepository] Failed to get activity by id: ${id}`, error);
      throw new Error(`Failed to fetch activity: ${id}`);
    }
  }
  
  /**
   * 新しいアクティビティを作成
   */
  async create(
    data: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ): Promise<ActivityDefinition> {
    try {
      const activities = await this.storage.getActivities();
      const maxOrder = activities.length > 0
        ? Math.max(...activities.map(a => a.order))
        : 0;
      
      const now = new Date();
      const newActivity: ActivityDefinition = {
        ...data,
        id: generateActivityId(),
        createdAt: now,
        updatedAt: now,
        order: maxOrder + 1,
        isArchived: data.isArchived ?? false,
      };
      
      return await this.storage.addActivity(newActivity);
    } catch (error) {
      console.error('[ActivityRepository] Failed to create activity:', error);
      throw new Error('Failed to create activity');
    }
  }
  
  /**
   * アクティビティを更新
   */
  async update(
    id: string,
    updates: Partial<Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>>
  ): Promise<ActivityDefinition> {
    try {
      const safeUpdates = {
        ...updates,
        updatedAt: new Date(),
      };
      
      return await this.storage.updateActivity(id, safeUpdates);
    } catch (error) {
      console.error(`[ActivityRepository] Failed to update activity: ${id}`, error);
      throw new Error(`Failed to update activity: ${id}`);
    }
  }
  
  /**
   * アクティビティを削除
   */
  async delete(id: string): Promise<void> {
    try {
      await this.storage.deleteActivity(id);
    } catch (error) {
      console.error(`[ActivityRepository] Failed to delete activity: ${id}`, error);
      throw new Error(`Failed to delete activity: ${id}`);
    }
  }
  
  /**
   * アーカイブされていないアクティビティのみを取得
   */
  async getAllActive(): Promise<ActivityDefinition[]> {
    try {
      const activities = await this.storage.getActivities();
      return activities.filter(a => !a.isArchived);
    } catch (error) {
      console.error('[ActivityRepository] Failed to get active activities:', error);
      throw new Error('Failed to fetch active activities');
    }
  }
  
  /**
   * アクティビティをアーカイブ
   */
  async archive(id: string): Promise<ActivityDefinition> {
    try {
      return await this.update(id, { isArchived: true });
    } catch (error) {
      console.error(`[ActivityRepository] Failed to archive activity: ${id}`, error);
      throw new Error(`Failed to archive activity: ${id}`);
    }
  }
  
  /**
   * アクティビティを復元（アーカイブ解除）
   */
  async restore(id: string): Promise<ActivityDefinition> {
    try {
      return await this.update(id, { isArchived: false });
    } catch (error) {
      console.error(`[ActivityRepository] Failed to restore activity: ${id}`, error);
      throw new Error(`Failed to restore activity: ${id}`);
    }
  }
}
