import {
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
  type UserCredential,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/shared/config/firebase';
import type { User, AuthService, LoginCredentials, SignUpCredentials, PasswordResetRequest } from '../model/types';
import { AuthError, AuthErrorCode } from '../model/types';
import { AuthValidators } from '../model/validators';

/**
 * Firebase UserをアプリケーションのUser型に変換
 */
function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
    emailVerified: firebaseUser.emailVerified,
    createdAt: firebaseUser.metadata.creationTime 
      ? new Date(firebaseUser.metadata.creationTime) 
      : new Date(),
    lastLoginAt: firebaseUser.metadata.lastSignInTime 
      ? new Date(firebaseUser.metadata.lastSignInTime) 
      : new Date(),
  };
}

/**
 * FirebaseのエラーをAuthErrorに変換
 */
function mapFirebaseError(error: unknown): AuthError {
  if (error instanceof Error) {
    // Firebase Auth のエラーコードをパース
    const errorCode = (error as { code?: string }).code || '';
    
    switch (errorCode) {
      case 'auth/invalid-email':
        return new AuthError(
          AuthErrorCode.INVALID_EMAIL,
          'メールアドレスが正しくありません',
          error
        );
      
      case 'auth/user-not-found':
        return new AuthError(
          AuthErrorCode.USER_NOT_FOUND,
          'ユーザーが見つかりません',
          error
        );
      
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return new AuthError(
          AuthErrorCode.INVALID_PASSWORD,
          'パスワードが正しくありません',
          error
        );
      
      case 'auth/email-already-in-use':
        return new AuthError(
          AuthErrorCode.EMAIL_ALREADY_IN_USE,
          'このメールアドレスは既に使用されています',
          error
        );
      
      case 'auth/weak-password':
        return new AuthError(
          AuthErrorCode.WEAK_PASSWORD,
          'パスワードは6文字以上にしてください',
          error
        );
      
      case 'auth/network-request-failed':
        return new AuthError(
          AuthErrorCode.NETWORK_ERROR,
          'ネットワークエラーが発生しました。接続を確認してください',
          error
        );
      
      case 'auth/too-many-requests':
        return new AuthError(
          AuthErrorCode.SERVICE_UNAVAILABLE,
          'リクエストが多すぎます。しばらく待ってから再試行してください',
          error
        );
      
      case 'auth/popup-closed-by-user':
        return new AuthError(
          AuthErrorCode.UNKNOWN_ERROR,
          'ログインがキャンセルされました',
          error
        );
      
      default:
        return new AuthError(
          AuthErrorCode.UNKNOWN_ERROR,
          error.message || 'Unknown authentication error',
          error
        );
    }
  }
  
  return new AuthError(
    AuthErrorCode.UNKNOWN_ERROR,
    'Unknown error occurred',
    error
  );
}

/**
 * FirebaseAuthService
 * Feature-Sliced Design: features/auth/api
 * 
 * Firebase Authenticationを使用した認証サービスの実装。
 * 
 * @example
 * ```typescript
 * const authService = new FirebaseAuthService();
 * const user = await authService.signInWithEmailAndPassword({
 *   email: 'user@example.com',
 *   password: 'password123',
 * });
 * ```
 */
export class FirebaseAuthService implements AuthService {
  private readonly auth: Auth;
  
  /**
   * @param auth - Firebase Auth instance（省略時は自動取得）
   */
  constructor(auth?: Auth) {
    this.auth = auth || getFirebaseAuth();
    console.log('[FirebaseAuthService] Initialized');
  }
  
  /**
   * 現在のユーザーを取得
   */
  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = this.auth.currentUser;
    return firebaseUser ? mapFirebaseUser(firebaseUser) : null;
  }
  
  /**
   * メールアドレスとパスワードでログイン
   */
  async signInWithEmailAndPassword(credentials: LoginCredentials): Promise<User> {
    try {
      // バリデーション
      AuthValidators.validateEmail(credentials.email);
      AuthValidators.validatePassword(credentials.password);
      
      const userCredential: UserCredential = await firebaseSignInWithEmail(
        this.auth,
        credentials.email,
        credentials.password
      );
      
      const user = mapFirebaseUser(userCredential.user);
      console.log('[FirebaseAuthService] Sign in successful:', user.email);
      
      return user;
    } catch (error) {
      console.error('[FirebaseAuthService] Sign in failed:', error);
      throw mapFirebaseError(error);
    }
  }
  
  /**
   * Googleアカウントでログイン
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      // 日本語UIを優先
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = mapFirebaseUser(userCredential.user);
      
      console.log('[FirebaseAuthService] Google sign in successful:', user.email);
      
      return user;
    } catch (error) {
      console.error('[FirebaseAuthService] Google sign in failed:', error);
      throw mapFirebaseError(error);
    }
  }
  
  /**
   * 新規アカウントを作成
   */
  async signUpWithEmailAndPassword(credentials: SignUpCredentials): Promise<User> {
    try {
      // バリデーション
      AuthValidators.validateEmail(credentials.email);
      AuthValidators.validatePassword(credentials.password);
      
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );
      
      const user = mapFirebaseUser(userCredential.user);
      console.log('[FirebaseAuthService] Sign up successful:', user.email);
      
      return user;
    } catch (error) {
      console.error('[FirebaseAuthService] Sign up failed:', error);
      throw mapFirebaseError(error);
    }
  }
  
  /**
   * ログアウト
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
      console.log('[FirebaseAuthService] Sign out successful');
    } catch (error) {
      console.error('[FirebaseAuthService] Sign out failed:', error);
      throw mapFirebaseError(error);
    }
  }
  
  /**
   * パスワードリセットメールを送信
   */
  async sendPasswordResetEmail(request: PasswordResetRequest): Promise<void> {
    try {
      // バリデーション
      AuthValidators.validateEmail(request.email);
      
      await firebaseSendPasswordReset(this.auth, request.email);
      console.log('[FirebaseAuthService] Password reset email sent:', request.email);
    } catch (error) {
      console.error('[FirebaseAuthService] Failed to send password reset email:', error);
      throw mapFirebaseError(error);
    }
  }
  
  /**
   * 認証状態の変更を監視
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const unsubscribe = firebaseOnAuthStateChanged(
      this.auth,
      (firebaseUser) => {
        const user = firebaseUser ? mapFirebaseUser(firebaseUser) : null;
        callback(user);
      },
      (error) => {
        console.error('[FirebaseAuthService] Auth state change error:', error);
        callback(null);
      }
    );
    
    return unsubscribe;
  }
}
