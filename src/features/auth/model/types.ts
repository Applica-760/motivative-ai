/**
 * Authentication Types
 * Feature-Sliced Design: features/auth/model
 * 
 * 認証に関連する型定義
 */

/**
 * ユーザー情報
 */
export interface User {
  /** ユーザーID（一意） */
  id: string;
  
  /** メールアドレス */
  email: string;
  
  /** 表示名（オプション） */
  displayName?: string;
  
  /** プロフィール画像URL（オプション） */
  photoURL?: string;
  
  /** アカウント作成日時 */
  createdAt: Date;
  
  /** 最終ログイン日時 */
  lastLoginAt: Date;
  
  /** メール認証済みフラグ */
  emailVerified: boolean;
}

/**
 * 認証エラーの種類
 */
export type AuthErrorCode =
  | 'auth/invalid-email'
  | 'auth/invalid-password'
  | 'auth/user-not-found'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-token'
  | 'auth/session-expired'
  | 'auth/network-error'
  | 'auth/service-unavailable'
  | 'auth/unknown';

/**
 * 認証エラーコードの定数
 */
export const AuthErrorCode = {
  INVALID_EMAIL: 'auth/invalid-email' as const,
  INVALID_PASSWORD: 'auth/invalid-password' as const,
  USER_NOT_FOUND: 'auth/user-not-found' as const,
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use' as const,
  WEAK_PASSWORD: 'auth/weak-password' as const,
  INVALID_TOKEN: 'auth/invalid-token' as const,
  SESSION_EXPIRED: 'auth/session-expired' as const,
  NETWORK_ERROR: 'auth/network-error' as const,
  SERVICE_UNAVAILABLE: 'auth/service-unavailable' as const,
  UNKNOWN_ERROR: 'auth/unknown' as const,
};

/**
 * 認証エラー
 */
export class AuthError extends Error {
  public readonly code: AuthErrorCode;
  public readonly cause?: unknown;
  
  constructor(code: AuthErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.cause = cause;
  }
}

/**
 * ログイン認証情報
 */
export interface LoginCredentials {
  /** メールアドレス */
  email: string;
  /** パスワード */
  password: string;
}

/**
 * サインアップ認証情報
 */
export interface SignUpCredentials {
  /** メールアドレス */
  email: string;
  /** パスワード */
  password: string;
  /** 表示名（オプション） */
  displayName?: string;
}

/**
 * パスワードリセット情報
 */
export interface PasswordResetRequest {
  /** メールアドレス */
  email: string;
}

/**
 * 認証サービスのインターフェース
 * localStorage、Firebase Auth等の実装を抽象化
 */
export interface AuthService {
  /**
   * 現在のユーザーを取得
   * @returns ログイン中のユーザー、またはnull
   */
  getCurrentUser(): Promise<User | null>;
  
  /**
   * メールアドレスとパスワードでログイン
   * @param credentials - ログイン認証情報
   * @returns ログインしたユーザー
   * @throws AuthError ログインに失敗した場合
   */
  signInWithEmailAndPassword(credentials: LoginCredentials): Promise<User>;
  
  /**
   * Googleアカウントでログイン
   * @returns ログインしたユーザー
   * @throws AuthError ログインに失敗した場合
   */
  signInWithGoogle(): Promise<User>;
  
  /**
   * 新規アカウントを作成
   * @param credentials - サインアップ認証情報
   * @returns 作成されたユーザー
   * @throws AuthError アカウント作成に失敗した場合
   */
  signUpWithEmailAndPassword(credentials: SignUpCredentials): Promise<User>;
  
  /**
   * ログアウト
   * @throws AuthError ログアウトに失敗した場合
   */
  signOut(): Promise<void>;
  
  /**
   * パスワードリセットメールを送信
   * @param request - パスワードリセット情報
   * @throws AuthError 送信に失敗した場合
   */
  sendPasswordResetEmail(request: PasswordResetRequest): Promise<void>;
  
  /**
   * 認証状態の変更を監視
   * @param callback - ユーザー状態が変更された時に呼ばれるコールバック
   * @returns 監視を解除する関数
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

/**
 * 認証状態
 */
export interface AuthState {
  /** 現在のユーザー */
  user: User | null;
  /** 認証状態の初期化中フラグ */
  isLoading: boolean;
  /** 認証済みフラグ */
  isAuthenticated: boolean;
  /** エラー */
  error: AuthError | null;
}
