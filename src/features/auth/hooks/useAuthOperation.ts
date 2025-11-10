/**
 * Auth Operation Hook
 * Feature-Sliced Design: features/auth/hooks
 * 
 * 認証操作の共通処理を抽出したカスタムフック
 */

import { useState, useCallback } from 'react';
import { AuthError, AuthErrorCode } from '../model/types';

/**
 * 認証操作の実行結果
 */
interface AuthOperationResult {
  /** 実行関数 */
  execute: () => Promise<void>;
  /** ローディング状態 */
  isLoading: boolean;
  /** エラー */
  error: AuthError | null;
  /** エラークリア */
  clearError: () => void;
}

/**
 * 認証操作の共通処理を抽出したフック
 * 
 * @param operation - 実行する操作
 * @param operationName - 操作名（ログ用）
 * @returns 実行結果
 * 
 * @example
 * ```tsx
 * const { execute, isLoading, error } = useAuthOperation(
 *   async () => {
 *     const user = await service.signIn(credentials);
 *     setUser(user);
 *   },
 *   'Sign in'
 * );
 * ```
 */
export function useAuthOperation(
  operation: () => Promise<void>,
  operationName: string
): AuthOperationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  
  const execute = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      await operation();
      
      console.log(`[AuthProvider] ${operationName} successful`);
    } catch (err) {
      const authError = err instanceof AuthError
        ? err
        : new AuthError(
            AuthErrorCode.UNKNOWN_ERROR,
            `Failed to ${operationName}`,
            err
          );
      
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [operation, operationName]);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    execute,
    isLoading,
    error,
    clearError,
  };
}
