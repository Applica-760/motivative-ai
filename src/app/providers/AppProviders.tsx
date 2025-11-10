import type { ReactNode } from 'react';
import { MantineProvider, type MantineThemeOverride } from '@mantine/core';
import { AuthProvider, useAuth } from '@/features/auth';
import { ActivityProvider } from '@/features/activity';
import { StorageProvider } from '@/shared/services/storage';
import type { AuthService } from '@/features/auth/model/types';

/**
 * AppProvidersのProps
 */
interface AppProvidersProps {
  /** 子コンポーネント */
  children: ReactNode;
  /** 認証サービスの実装 */
  authService: AuthService;
  /** Mantineテーマ（オプション） */
  theme?: MantineThemeOverride;
}

/**
 * StorageとActivityのProvider
 * 認証状態に応じてStorageProviderを構成
 */
function StorageAndActivityProviders({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <StorageProvider
      auth={{
        isAuthenticated,
        userId: user?.id,
      }}
    >
      <ActivityProvider>
        {children}
      </ActivityProvider>
    </StorageProvider>
  );
}

/**
 * AppProviders
 * Feature-Sliced Design: app/providers
 * 
 * アプリケーション全体で使用するProviderを統合。
 * - MantineProvider: UIテーマ
 * - AuthProvider: 認証状態
 * - StorageProvider: データ永続化（認証状態に応じて自動切り替え）
 * - ActivityProvider: アクティビティデータ管理
 * 
 * @example
 * ```tsx
 * import { AppProviders } from '@/app/providers';
 * import { FirebaseAuthService } from '@/features/auth/api';
 * 
 * <AppProviders authService={new FirebaseAuthService()}>
 *   <App />
 * </AppProviders>
 * ```
 */
export function AppProviders({ children, authService, theme }: AppProvidersProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AuthProvider service={authService}>
        <StorageAndActivityProviders>
          {children}
        </StorageAndActivityProviders>
      </AuthProvider>
    </MantineProvider>
  );
}
