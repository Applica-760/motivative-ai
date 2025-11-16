import type { ReactNode } from 'react';
import { MantineProvider, type MantineThemeOverride } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider, useAuth, useStorageMigration } from '@/features/auth';
import { ProfileProvider } from '@/features/account';
import { ActivityProvider } from '@/features/activity';
import { StorageProvider } from '@/shared/services/storage';
import { GraphPreferencesProvider } from '@/features/graph';
import { LoadingScreen } from '@/shared/ui';
import type { AuthService } from '@/features/auth/model/types';

// Mantine Notifications用のスタイル
import '@mantine/notifications/styles.css';

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
 * マイグレーション処理を実行するコンポーネント
 * StorageProvider内部で実行される必要がある
 */
function MigrationHandler({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  // ログイン時のストレージマイグレーション処理
  // LocalStorageからFirebaseへのデータ移行を自動実行
  useStorageMigration(isAuthenticated);
  
  return <>{children}</>;
}

/**
 * StorageとActivityのProvider
 * 認証状態に応じてStorageProviderを構成
 * 
 * 認証初期化中はローディング画面を表示し、
 * データの不整合（ローカルストレージとFirebaseの切り替え）を防ぐ。
 * 
 * keyプロパティにより、認証状態が変わると完全に再マウントされ、
 * 古いデータが表示されることを防ぐ。
 */
function StorageAndActivityProviders({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // 認証初期化中はローディング画面を表示
  // この間、StorageProviderとActivityProviderはマウントされないため、
  // ローカルストレージのデータが一瞬表示されることを防ぐ
  if (isLoading) {
    return <LoadingScreen message="アプリを読み込んでいます..." />;
  }
  
  // 認証状態に応じてkeyを変更し、完全に再マウントする
  // これにより、ローカルストレージとFirebase間での状態の混在を防ぐ
  const storageKey = isAuthenticated ? `firebase-${user?.id}` : 'local';
  
  return (
    <StorageProvider
      key={storageKey}
      auth={{
        isAuthenticated,
        userId: user?.id,
      }}
    >
      <MigrationHandler>
        <ActivityProvider key={storageKey}>
          <ProfileProvider key={storageKey}>
            <GraphPreferencesProvider>
              {children}
            </GraphPreferencesProvider>
          </ProfileProvider>
        </ActivityProvider>
      </MigrationHandler>
    </StorageProvider>
  );
}

/**
 * AppProviders
 * Feature-Sliced Design: app/providers
 * 
 * アプリケーション全体で使用するProviderを統合。
 * - MantineProvider: UIテーマ
 * - Notifications: 通知システム
 * - AuthProvider: 認証状態
 * - StorageProvider: データ永続化（認証状態に応じて自動切り替え）
 * - ActivityProvider: アクティビティデータ管理
 * - ProfileProvider: プロフィール管理
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
      <Notifications position="top-right" />
      <AuthProvider service={authService}>
        <StorageAndActivityProviders>
          {children}
        </StorageAndActivityProviders>
      </AuthProvider>
    </MantineProvider>
  );
}
