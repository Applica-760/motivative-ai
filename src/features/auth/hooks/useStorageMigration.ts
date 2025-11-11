import { useEffect, useRef } from 'react';
import { useStorage } from '@/shared/services/storage';
import { 
  migrateLocalStorageToFirebase, 
  isMigrationCompleted,
  type MigrationResult,
} from '@/features/auth/model';

/**
 * ストレージマイグレーションフック
 * Feature-Sliced Design: features/auth/hooks
 * 
 * ログイン時にLocalStorageからFirebaseへのデータマイグレーションを自動実行する。
 * 以下の条件でマイグレーションが実行される：
 * 
 * 1. ユーザーが認証済み（isAuthenticated === true）
 * 2. マイグレーションが未完了（初回ログイン時のみ）
 * 3. 前回の認証状態と異なる（ログアウト→ログインの切り替え時）
 * 
 * マイグレーション対象：
 * - アクティビティ定義
 * - アクティビティ記録
 * - グリッドレイアウト設定
 * 
 * @param isAuthenticated - 認証状態
 * 
 * @example
 * ```tsx
 * function AuthProvider({ children }) {
 *   const { isAuthenticated, user } = useAuth();
 *   
 *   // マイグレーションを自動実行
 *   useStorageMigration(isAuthenticated);
 *   
 *   return <>{children}</>;
 * }
 * ```
 */
export function useStorageMigration(isAuthenticated: boolean): void {
  const storage = useStorage();
  const previousAuthState = useRef<boolean>(false);
  const migrationInProgress = useRef<boolean>(false);
  
  useEffect(() => {
    // 認証状態が変わった場合のみ実行
    const authStateChanged = previousAuthState.current !== isAuthenticated;
    
    // マイグレーション実行条件
    const shouldMigrate = 
      isAuthenticated &&                  // ログイン済み
      !isMigrationCompleted() &&          // マイグレーション未完了
      authStateChanged &&                 // 認証状態が変わった
      !migrationInProgress.current;       // マイグレーション中でない
    
    if (shouldMigrate) {
      console.log('[useStorageMigration] Starting migration from LocalStorage to Firebase');
      migrationInProgress.current = true;
      
      migrateLocalStorageToFirebase(storage)
        .then((result: MigrationResult) => {
          if (result.success) {
            console.log('[useStorageMigration] Migration completed successfully:', result.migratedData);
          } else {
            console.error('[useStorageMigration] Migration completed with errors:', result.errors);
          }
        })
        .catch((error: unknown) => {
          console.error('[useStorageMigration] Migration failed:', error);
        })
        .finally(() => {
          migrationInProgress.current = false;
        });
    }
    
    // 認証状態を記録
    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated, storage]);
}
