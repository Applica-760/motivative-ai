import type { User, AuthService, LoginCredentials, SignUpCredentials, PasswordResetRequest } from '../model/types';
import { AuthValidators } from '../model/validators';

/**
 * MockAuthService
 * 
 * 開発・テスト用の認証サービス実装。
 * シンプルなメモリベースの実装で、複雑なlocalStorage管理を排除。
 * 
 * 注意: 本番環境では使用しないこと。
 * - データは一時的（ページリロードで消える）
 * - セキュリティ機能なし
 * - デモ・テスト目的のみ
 * 
 * @example
 * ```typescript
 * const authService = new MockAuthService();
 * const user = await authService.signUpWithEmailAndPassword({
 *   email: 'test@example.com',
 *   password: 'password123',
 * });
 * ```
 */
export class MockAuthService implements AuthService {
  private currentUser: User | null = null;
  private authStateListeners: Array<(user: User | null) => void> = [];
  
  // モックデータ（簡略化）
  private readonly MOCK_USER: User = {
    id: 'mock-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: undefined,
    emailVerified: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };
  
  private readonly MOCK_GOOGLE_USER: User = {
    id: 'google-user-456',
    email: 'test.google@example.com',
    displayName: 'Google Test User',
    photoURL: 'https://via.placeholder.com/150',
    emailVerified: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };
  
  /**
   * ネットワーク遅延をシミュレート
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 認証状態の変更を通知
   */
  private notifyAuthStateChange(user: User | null): void {
    this.authStateListeners.forEach(listener => {
      try {
        listener(user);
      } catch (error) {
        console.error('[MockAuthService] Listener error:', error);
      }
    });
  }
  
  /**
   * 現在のユーザーを取得
   */
  async getCurrentUser(): Promise<User | null> {
    await this.delay(100);
    return this.currentUser;
  }
  
  /**
   * メールアドレスとパスワードでログイン
   */
  async signInWithEmailAndPassword(credentials: LoginCredentials): Promise<User> {
    // バリデーション
    AuthValidators.validateEmail(credentials.email);
    AuthValidators.validatePassword(credentials.password);
    
    // ネットワーク遅延をシミュレート
    await this.delay(500);
    
    // シンプルな認証（任意のメール/パスワードで成功）
    const user: User = {
      ...this.MOCK_USER,
      email: credentials.email,
      lastLoginAt: new Date(),
    };
    
    this.currentUser = user;
    this.notifyAuthStateChange(user);
    
    console.log('[MockAuthService] Sign in successful:', user.email);
    return user;
  }
  
  /**
   * Googleアカウントでログイン（モック実装）
   */
  async signInWithGoogle(): Promise<User> {
    // ネットワーク遅延をシミュレート
    await this.delay(800);
    
    const user: User = {
      ...this.MOCK_GOOGLE_USER,
      lastLoginAt: new Date(),
    };
    
    this.currentUser = user;
    this.notifyAuthStateChange(user);
    
    console.log('[MockAuthService] Google sign in successful (mock)');
    return user;
  }
  
  /**
   * 新規アカウントを作成
   */
  async signUpWithEmailAndPassword(credentials: SignUpCredentials): Promise<User> {
    // バリデーション
    AuthValidators.validateEmail(credentials.email);
    AuthValidators.validatePassword(credentials.password);
    
    // ネットワーク遅延をシミュレート
    await this.delay(500);
    
    const now = new Date();
    const user: User = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      displayName: credentials.displayName,
      photoURL: undefined,
      emailVerified: false,
      createdAt: now,
      lastLoginAt: now,
    };
    
    this.currentUser = user;
    this.notifyAuthStateChange(user);
    
    console.log('[MockAuthService] Sign up successful:', user.email);
    return user;
  }
  
  /**
   * ログアウト
   */
  async signOut(): Promise<void> {
    // ネットワーク遅延をシミュレート
    await this.delay(200);
    
    this.currentUser = null;
    this.notifyAuthStateChange(null);
    
    console.log('[MockAuthService] Sign out successful');
  }
  
  /**
   * パスワードリセットメールを送信（モック実装）
   */
  async sendPasswordResetEmail(request: PasswordResetRequest): Promise<void> {
    // バリデーション
    AuthValidators.validateEmail(request.email);
    
    // ネットワーク遅延をシミュレート
    await this.delay(500);
    
    console.log('[MockAuthService] Password reset email sent (mock):', request.email);
  }
  
  /**
   * 認証状態の変更を監視
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // 初回実行: 現在の状態を通知
    this.getCurrentUser()
      .then(callback)
      .catch(error => {
        console.error('[MockAuthService] onAuthStateChanged error:', error);
        callback(null);
      });
    
    // クリーンアップ関数を返す
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }
}
