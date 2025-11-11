import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useAuth } from '@/features/auth';
import { useStorage } from '@/shared/services/storage';
import type { UserProfile, UpdateProfileData } from './types';
import { ProfileRepository } from '../api/repositories';

/**
 * ProfileContextの値
 */
interface ProfileContextValue {
  /** 現在のプロフィール */
  profile: UserProfile | null;
  
  /** ロード中フラグ */
  isLoading: boolean;
  
  /** エラー */
  error: Error | null;
  
  /**
   * プロフィールを更新
   * @param updateData - 更新するプロフィール情報
   */
  updateProfile: (updateData: UpdateProfileData) => Promise<void>;
  
  /**
   * プロフィールを作成（初回のみ）
   * @param profileData - プロフィール情報
   */
  createProfile: (profileData: UpdateProfileData) => Promise<void>;
  
  /**
   * プロフィールを再読み込み
   */
  refetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

/**
 * ProfileProviderのProps
 */
interface ProfileProviderProps {
  /** 子コンポーネント */
  children: ReactNode;
}

/**
 * ProfileProvider
 * Feature-Sliced Design: features/account/model
 * 
 * ユーザープロフィール情報をアプリケーション全体で管理する。
 * 認証状態（auth feature）と連携し、ログイン時に自動でプロフィールをロードする。
 * StorageServiceパターンにより、ログイン状態に応じてlocalStorage/Firestoreが自動切り替え。
 * 
 * @example
 * ```tsx
 * import { ProfileProvider } from '@/features/account';
 * 
 * <ProfileProvider>
 *   <App />
 * </ProfileProvider>
 * ```
 */
export function ProfileProvider({ children }: ProfileProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const storage = useStorage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // ProfileRepositoryインスタンスを作成（StorageServiceを注入）
  const repository = useMemo(() => {
    return new ProfileRepository(storage);
  }, [storage]);
  
  /**
   * プロフィールを取得（内部用ヘルパー）
   */
  const fetchProfile = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const profileData = await repository.getProfile(userId);
      setProfile(profileData);
      
      if (!profileData) {
        console.log('[ProfileProvider] No profile found for user:', userId);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch profile');
      console.error('[ProfileProvider] Failed to fetch profile:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);
  
  /**
   * 非同期操作の共通ラッパー
   */
  const withAsyncHandler = useCallback(async <T,>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await operation();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(errorMessage);
      console.error(`[ProfileProvider] ${errorMessage}:`, error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * プロフィールを作成
   */
  const createProfile = useCallback(async (profileData: UpdateProfileData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    await withAsyncHandler(async () => {
      await repository.createProfile(user.id, {
        displayName: profileData.displayName || '',
        gender: profileData.gender || '未設定',
        iconColor: profileData.iconColor || '#228be6',
        avatarIcon: profileData.avatarIcon || 'IconUser',
        aiMessage: profileData.aiMessage || '',
      });
      
      await fetchProfile(user.id);
      console.log('[ProfileProvider] Profile created successfully');
    }, 'Failed to create profile');
  }, [user, repository, fetchProfile, withAsyncHandler]);
  
  /**
   * プロフィールを更新
   */
  const updateProfile = useCallback(async (updateData: UpdateProfileData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    await withAsyncHandler(async () => {
      await repository.updateProfile(user.id, updateData);
      await fetchProfile(user.id);
      console.log('[ProfileProvider] Profile updated successfully');
    }, 'Failed to update profile');
  }, [user, repository, fetchProfile, withAsyncHandler]);
  
  /**
   * プロフィールを再読み込み
   */
  const refetchProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);
  
  // 認証状態が変わったらプロフィールをロード
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile(user.id);
    } else {
      // ログアウト時はプロフィールをクリア
      setProfile(null);
      setError(null);
    }
  }, [isAuthenticated, user, fetchProfile]);
  
  const value: ProfileContextValue = {
    profile,
    isLoading,
    error,
    updateProfile,
    createProfile,
    refetchProfile,
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * useProfile
 * 
 * プロフィール状態とメソッドにアクセスするカスタムフック。
 * ProfileProvider内で使用する必要がある。
 * 
 * @returns プロフィールコンテキスト
 * @throws Error ProfileProvider外で使用された場合
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { profile, updateProfile } = useProfile();
 *   
 *   if (!profile) {
 *     return <div>プロフィールが設定されていません</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>ユーザー名: {profile.displayName}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  
  if (!context) {
    throw new Error(
      'useProfile must be used within a ProfileProvider. ' +
      'Wrap your component tree with <ProfileProvider>.'
    );
  }
  
  return context;
}
