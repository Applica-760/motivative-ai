import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import type { UserProfile, UpdateProfileData } from '../../model/types';

/**
 * ProfileRepository
 * Feature-Sliced Design: features/account/api/repositories
 * 
 * Firestoreとの通信を担当し、ユーザープロフィール情報のCRUD操作を提供する。
 * 
 * データ構造:
 * users/{userId}/profile/data
 */
export class ProfileRepository {
  private readonly collectionName = 'users';
  private readonly firestore: Firestore;
  
  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }
  
  /**
   * プロフィールを取得
   * 
   * @param userId - ユーザーID
   * @returns プロフィール情報、存在しない場合はnull
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profileRef = doc(this.firestore, this.collectionName, userId, 'profile', 'data');
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        console.log('[ProfileRepository] Profile not found for user:', userId);
        return null;
      }
      
      const data = profileSnap.data();
      return {
        userId: data.userId,
        displayName: data.displayName,
        gender: data.gender,
        iconColor: data.iconColor,
        avatarIcon: data.avatarIcon,
        aiMessage: data.aiMessage,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
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
      const profileRef = doc(this.firestore, this.collectionName, userId, 'profile', 'data');
      
      await setDoc(profileRef, {
        userId,
        displayName: profileData.displayName,
        gender: profileData.gender,
        iconColor: profileData.iconColor,
        avatarIcon: profileData.avatarIcon,
        aiMessage: profileData.aiMessage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
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
      const profileRef = doc(this.firestore, this.collectionName, userId, 'profile', 'data');
      
      // 存在確認
      const profileSnap = await getDoc(profileRef);
      if (!profileSnap.exists()) {
        throw new Error('Profile not found');
      }
      
      await updateDoc(profileRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      
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
      const profileRef = doc(this.firestore, this.collectionName, userId, 'profile', 'data');
      const profileSnap = await getDoc(profileRef);
      return profileSnap.exists();
    } catch (error) {
      console.error('[ProfileRepository] Failed to check profile existence:', error);
      return false;
    }
  }
}
