import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import type { SavedLayout } from '@/features/grid-item';
import type { UserProfile, UpdateProfileData } from '@/features/account';
import { STORAGE_KEYS } from '@/shared/config';
import type { StorageService } from './types';
import { StorageError } from './types';
import { BaseStorageService } from './BaseStorageService';

/**
 * LocalStorage実装のStorageService
 * Feature-Sliced Design: shared/services
 * 
 * ブラウザのlocalStorageを使用してデータを永続化する。
 * ログインしていないユーザーや開発環境で使用される。
 * 
 * @example
 * ```typescript
 * const storage = new LocalStorageService();
 * const activities = await storage.getActivities();
 * ```
 */
export class LocalStorageService extends BaseStorageService implements StorageService {
  // ==================== Helper Methods ====================
  
  /**
   * localStorageからデータを読み込み、パース
   * @param key - ストレージキー
   * @param reviver - Date型の復元などを行う関数
   */
  private getItem<T>(key: string, reviver?: (data: T) => T): T | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const parsed = JSON.parse(data) as T;
      return reviver ? reviver(parsed) : parsed;
    } catch (error) {
      throw new StorageError(
        `Failed to read from localStorage: ${key}`,
        'read',
        error
      );
    }
  }
  
  /**
   * localStorageにデータを保存
   * @param key - ストレージキー
   * @param value - 保存するデータ
   */
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new StorageError(
        `Failed to write to localStorage: ${key}`,
        'write',
        error
      );
    }
  }
  
  /**
   * Date型のフィールドを復元
   */
  private reviveActivityDefinition(
    data: ActivityDefinition
  ): ActivityDefinition {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
  
  /**
   * Date型のフィールドを復元
   */
  private reviveActivityRecord(data: ActivityRecord): ActivityRecord {
    return {
      ...data,
      timestamp: new Date(data.timestamp),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
  
  /**
   * Date型のフィールドを復元
   */
  private reviveUserProfile(data: UserProfile): UserProfile {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
  
  // ==================== BaseStorageService Implementation ====================
  
  protected async getAllActivities(): Promise<ActivityDefinition[]> {
    const activities = this.getItem<ActivityDefinition[]>(
      STORAGE_KEYS.ACTIVITIES
    );
    
    if (!activities) {
      return [];
    }
    
    // Date型の復元
    return activities.map(activity => this.reviveActivityDefinition(activity));
  }
  
  protected async saveAllActivities(activities: ActivityDefinition[]): Promise<void> {
    this.setItem(STORAGE_KEYS.ACTIVITIES, activities);
  }
  
  protected async getAllRecords(): Promise<ActivityRecord[]> {
    const records = this.getItem<ActivityRecord[]>(STORAGE_KEYS.RECORDS);
    
    if (!records) {
      return [];
    }
    
    // Date型の復元
    return records.map(record => this.reviveActivityRecord(record));
  }
  
  protected async saveAllRecords(records: ActivityRecord[]): Promise<void> {
    this.setItem(STORAGE_KEYS.RECORDS, records);
  }
  
  // ==================== Public Interface (StorageService) ====================
  
  async getActivities(): Promise<ActivityDefinition[]> {
    return this.getAllActivities();
  }
  
  async saveActivities(activities: ActivityDefinition[]): Promise<void> {
    return this.saveAllActivities(activities);
  }
  
  async getRecords(): Promise<ActivityRecord[]> {
    return this.getAllRecords();
  }
  
  async saveRecords(records: ActivityRecord[]): Promise<void> {
    return this.saveAllRecords(records);
  }
  
  // ==================== Grid Layout ====================
  
  async getGridLayout(): Promise<SavedLayout | null> {
    return this.getItem<SavedLayout>(STORAGE_KEYS.GRID_LAYOUT_ORDER);
  }
  
  async saveGridLayout(layout: SavedLayout): Promise<void> {
    this.setItem(STORAGE_KEYS.GRID_LAYOUT_ORDER, layout);
  }
  
  // ==================== Profile ====================
  
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      // localStorageではユーザーIDをキーに含める
      const key = `${STORAGE_KEYS.PROFILE}-${userId}`;
      const profile = this.getItem<UserProfile>(key);
      
      if (!profile) {
        return null;
      }
      
      // Date型の復元
      return this.reviveUserProfile(profile);
    } catch (error) {
      console.error('[LocalStorageService] Failed to get profile:', error);
      throw new StorageError(
        'Failed to fetch profile from localStorage',
        'read',
        error
      );
    }
  }
  
  async createProfile(
    userId: string,
    profileData: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.PROFILE}-${userId}`;
      const now = new Date();
      
      const profile: UserProfile = {
        userId,
        ...profileData,
        createdAt: now,
        updatedAt: now,
      };
      
      this.setItem(key, profile);
      console.log('[LocalStorageService] Profile created for user:', userId);
    } catch (error) {
      console.error('[LocalStorageService] Failed to create profile:', error);
      throw new StorageError(
        'Failed to create profile in localStorage',
        'write',
        error
      );
    }
  }
  
  async updateProfile(userId: string, updates: UpdateProfileData): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.PROFILE}-${userId}`;
      const existingProfile = await this.getProfile(userId);
      
      if (!existingProfile) {
        throw new StorageError(
          `Profile not found for user: ${userId}`,
          'write'
        );
      }
      
      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date(),
      };
      
      this.setItem(key, updatedProfile);
      console.log('[LocalStorageService] Profile updated for user:', userId);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      
      console.error('[LocalStorageService] Failed to update profile:', error);
      throw new StorageError(
        'Failed to update profile in localStorage',
        'write',
        error
      );
    }
  }
  
  async profileExists(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId);
      return profile !== null;
    } catch (error) {
      console.error('[LocalStorageService] Failed to check profile existence:', error);
      return false;
    }
  }
  
  // ==================== Migration ====================
  
  async getMigrationFlag(): Promise<boolean> {
    try {
      const flag = this.getItem<boolean>(`${STORAGE_KEYS.MIGRATION_COMPLETED}`);
      return flag === true;
    } catch (error) {
      console.error('[LocalStorageService] Failed to get migration flag:', error);
      return false;
    }
  }
  
  async setMigrationFlag(completed: boolean): Promise<void> {
    try {
      this.setItem(STORAGE_KEYS.MIGRATION_COMPLETED, completed);
      console.log('[LocalStorageService] Migration flag set to:', completed);
    } catch (error) {
      console.error('[LocalStorageService] Failed to set migration flag:', error);
      throw new StorageError(
        'Failed to set migration flag in localStorage',
        'write',
        error
      );
    }
  }
  
  // ==================== Custom Data ====================
  
  async getCustomData(key: string): Promise<string | null> {
    try {
      const data = localStorage.getItem(key);
      return data;
    } catch (error) {
      throw new StorageError(
        `Failed to get custom data: ${key}`,
        'read',
        error
      );
    }
  }
  
  async setCustomData(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      throw new StorageError(
        `Failed to set custom data: ${key}`,
        'write',
        error
      );
    }
  }
  
  async deleteCustomData(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      throw new StorageError(
        `Failed to delete custom data: ${key}`,
        'delete',
        error
      );
    }
  }
}
