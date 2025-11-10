import { type ReactNode } from 'react';
import { StorageProvider } from './StorageProvider';
import { useAuth } from '@/features/auth';

/**
 * StorageProviderWithAuth
 * Feature-Sliced Design: shared/services/storage
 * 
 * 認証状態を自動的にStorageProviderに連携するラッパーコンポーネント。
 * useAuth()で認証情報を取得し、ログイン状態に応じてストレージを切り替える。
 * 
 * - ログインなし: LocalStorageService
 * - ログインあり: FirebaseStorageService
 * 
 * @example
 * ```tsx
 * <AuthProvider service={authService}>
 *   <StorageProviderWithAuth>
 *     <ActivityProvider>
 *       <App />
 *     </ActivityProvider>
 *   </StorageProviderWithAuth>
 * </AuthProvider>
 * ```
 */
export function StorageProviderWithAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <StorageProvider
      auth={{
        isAuthenticated,
        userId: user?.id,
      }}
    >
      {children}
    </StorageProvider>
  );
}
