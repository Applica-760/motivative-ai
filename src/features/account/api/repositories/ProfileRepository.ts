import type { StorageService } from '@/shared/services/storage';
import type { UserProfile, UpdateProfileData } from '../../model/types';

/**
 * ProfileRepository
 * Feature-Sliced Design: features/account/api/repositories
 * 
 * StorageServiceを通じてユーザープロフィール情報のCRUD操作を提供する。
 * ログイン状態に応じて、localStorage/Firestoreが自動で切り替わる。
 * 
 * @example
 * ```typescript
 * const storage = useStorage();
 * const repository = new ProfileRepository(storage);
 * const profile = await repository.getProfile('user-id');
 * ```
 */
export class ProfileRepository {
  private readonly storage: StorageService;
  
  constructor(storage: StorageService) {
    this.storage = storage;
  }
  
  /**
   * プロフィールを取得
   * 
   * @param userId - ユーザーID
   * @returns プロフィール情報、存在しない場合はnull
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      return await this.storage.getProfile(userId);
    } catch (error) {
      console.error('[ProfileRepository] Failed to get profile:', error);
      throw error;
    }
  }
  
  /**
   * プロフィールを作成
   * 
   * @param userId - ユーザーID
   * @param profileData - プロフィール情報
   */
  async createProfile(userId: string, profileData: Omit<UserProfile, 'userId' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      await this.storage.createProfile(userId, profileData);
      console.log('[ProfileRepository] Profile created for user:', userId);
    } catch (error) {
      console.error('[ProfileRepository] Failed to create profile:', error);
      throw error;
    }
  }
  
  /**
   * プロフィールを更新
   * 
   * @param userId - ユーザーID
   * @param updateData - 更新するプロフィール情報
   */
  async updateProfile(userId: string, updateData: UpdateProfileData): Promise<void> {
    try {
      await this.storage.updateProfile(userId, updateData);
      console.log('[ProfileRepository] Profile updated for user:', userId);
    } catch (error) {
      console.error('[ProfileRepository] Failed to update profile:', error);
      throw error;
    }
  }
  
  /**
   * プロフィールが存在するかチェック
   * 
   * @param userId - ユーザーID
   * @returns プロフィールが存在すればtrue
   */
  async exists(userId: string): Promise<boolean> {
    try {
      return await this.storage.profileExists(userId);
    } catch (error) {
      console.error('[ProfileRepository] Failed to check profile existence:', error);
      return false;
    }
  }
}
