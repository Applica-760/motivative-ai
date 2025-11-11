import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, AuthService, AuthState, LoginCredentials, SignUpCredentials, PasswordResetRequest } from './types';
import { AuthError, AuthErrorCode } from './types';

/**
 * AuthContextの値
 */
interface AuthContextValue extends AuthState {
  /**
   * ログイン
   * @param credentials - ログイン認証情報
   * @throws AuthError ログインに失敗した場合
   */
  signIn: (credentials: LoginCredentials) => Promise<void>;
  
  /**
   * Googleアカウントでログイン
   * @throws AuthError ログインに失敗した場合
   */
  signInWithGoogle: () => Promise<void>;
  
  /**
   * サインアップ
   * @param credentials - サインアップ認証情報
   * @throws AuthError サインアップに失敗した場合
   */
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  
  /**
   * ログアウト
   * @throws AuthError ログアウトに失敗した場合
   */
  signOut: () => Promise<void>;
  
  /**
   * パスワードリセットメールを送信
   * @param request - パスワードリセット情報
   * @throws AuthError 送信に失敗した場合
   */
  sendPasswordResetEmail: (request: PasswordResetRequest) => Promise<void>;
  
  /**
   * エラーをクリア
   */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProviderのProps
 */
interface AuthProviderProps {
  /** 子コンポーネント */
  children: ReactNode;
  
  /**
   * 使用する認証サービスの実装
   */
  service: AuthService;
}

/**
 * AuthProvider
 * 
 * 認証状態をアプリケーション全体で管理する。
 * AuthServiceの実装を注入することで、Mock/Firebase等を切り替え可能。
 * 
 * @example
 * ```tsx
 * import { AuthProvider } from '@/features/auth';
 * import { MockAuthService } from '@/features/auth/api';
 * 
 * <AuthProvider service={new MockAuthService()}>
 *   <App />
 * </AuthProvider>
 * ```
 */
export function AuthProvider({ children, service }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  
  // 認証状態の初期化と監視
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isFirstCall = true;
    
    const initAuth = async () => {
      try {
        // onAuthStateChanged の最初のコールバックが呼ばれるまで isLoading を true に保つ
        // これにより、Firebase認証の確認が完了するまでローディング画面が表示される
        unsubscribe = service.onAuthStateChanged((newUser) => {
          setUser(newUser);
          
          // 最初のコールバックで初期化完了
          if (isFirstCall) {
            isFirstCall = false;
            setIsLoading(false);
            console.log(
              '[AuthProvider] Initial auth state loaded:',
              newUser?.email || 'not authenticated'
            );
          }
        });
      } catch (err) {
        console.error('[AuthProvider] Initialization error:', err);
        setError(
          err instanceof AuthError
            ? err
            : new AuthError(
                AuthErrorCode.UNKNOWN_ERROR,
                'Failed to initialize authentication',
                err
              )
        );
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // クリーンアップ
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [service]);
  
  /**
   * ログイン処理
   */
  const signIn = useCallback(async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const user = await service.signInWithEmailAndPassword(credentials);
      setUser(user);
      
      console.log('[AuthProvider] Sign in successful:', user.email);
    } catch (err) {
      const authError = err instanceof AuthError
        ? err
        : new AuthError(
            AuthErrorCode.UNKNOWN_ERROR,
            'Failed to sign in',
            err
          );
      
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [service]);
  
  /**
   * Googleログイン処理
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const user = await service.signInWithGoogle();
      setUser(user);
      
      console.log('[AuthProvider] Google sign in successful:', user.email);
    } catch (err) {
      const authError = err instanceof AuthError
        ? err
        : new AuthError(
            AuthErrorCode.UNKNOWN_ERROR,
            'Failed to sign in with Google',
            err
          );
      
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [service]);
  
  /**
   * サインアップ処理
   */
  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const user = await service.signUpWithEmailAndPassword(credentials);
      setUser(user);
      
      console.log('[AuthProvider] Sign up successful:', user.email);
    } catch (err) {
      const authError = err instanceof AuthError
        ? err
        : new AuthError(
            AuthErrorCode.UNKNOWN_ERROR,
            'Failed to sign up',
            err
          );
      
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [service]);
  
  /**
   * ログアウト処理
   */
  const signOut = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      await service.signOut();
      setUser(null);
      
      console.log('[AuthProvider] Sign out successful');
    } catch (err) {
      const authError = err instanceof AuthError
        ? err
        : new AuthError(
            AuthErrorCode.UNKNOWN_ERROR,
            'Failed to sign out',
            err
          );
      
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [service]);
  
  /**
   * パスワードリセットメール送信
   */
  const sendPasswordResetEmail = useCallback(async (request: PasswordResetRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await service.sendPasswordResetEmail(request);
      
      console.log('[AuthProvider] Password reset email sent:', request.email);
    } catch (err) {
      const authError = err instanceof AuthError
        ? err
        : new AuthError(
            AuthErrorCode.UNKNOWN_ERROR,
            'Failed to send password reset email',
            err
          );
      
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [service]);
  
  /**
   * エラークリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    sendPasswordResetEmail,
    clearError,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth
 * 
 * 認証状態とメソッドにアクセスするカスタムフック。
 * AuthProvider内で使用する必要がある。
 * 
 * @returns 認証コンテキスト
 * @throws Error AuthProvider外で使用された場合
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, signIn, signOut } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <LoginForm />;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user.email}</p>
 *       <button onClick={signOut}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Wrap your component tree with <AuthProvider>.'
    );
  }
  
  return context;
}
