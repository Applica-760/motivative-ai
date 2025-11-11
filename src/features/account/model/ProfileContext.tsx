import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { getFirestore } from 'firebase/firestore';
import { useAuth } from '@/features/auth';
import type { UserProfile, UpdateProfileData, Gender } from './types';
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
   * @param displayName - ユーザー名
   * @param gender - 性別
   * @param iconColor - アイコン色
   * @param avatarIcon - アバターアイコン
   * @param aiMessage - AIメッセージ
   */
  createProfile: (
    displayName: string,
    gender: Gender,
    iconColor: string,
    avatarIcon: string,
    aiMessage: string
  ) => Promise<void>;
  
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // ProfileRepositoryインスタンスを作成
  const repository = useMemo(() => {
    const firestore = getFirestore();
    return new ProfileRepository(firestore);
  }, []);
  
  /**
   * プロフィールを取得
   */
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const profileData = await repository.getProfile(userId);
      setProfile(profileData);
      
      if (!profileData) {
        console.log('[ProfileProvider] No profile found for user:', userId);
      }
    } catch (err) {
      console.error('[ProfileProvider] Failed to fetch profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  }, [repository]);
  
  /**
   * プロフィールを作成
   */
  const createProfile = useCallback(async (
    displayName: string,
    gender: Gender,
    iconColor: string,
    avatarIcon: string,
    aiMessage: string
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await repository.createProfile(user.id, {
        displayName,
        gender,
        iconColor,
        avatarIcon,
        aiMessage,
      });
      
      // 作成後、プロフィールを再取得
      await fetchProfile(user.id);
      
      console.log('[ProfileProvider] Profile created successfully');
    } catch (err) {
      console.error('[ProfileProvider] Failed to create profile:', err);
      const error = err instanceof Error ? err : new Error('Failed to create profile');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, repository, fetchProfile]);
  
  /**
   * プロフィールを更新
   */
  const updateProfile = useCallback(async (updateData: UpdateProfileData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await repository.updateProfile(user.id, updateData);
      
      // 更新後、プロフィールを再取得
      await fetchProfile(user.id);
      
      console.log('[ProfileProvider] Profile updated successfully');
    } catch (err) {
      console.error('[ProfileProvider] Failed to update profile:', err);
      const error = err instanceof Error ? err : new Error('Failed to update profile');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, repository, fetchProfile]);
  
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
