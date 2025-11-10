import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockAuthService } from './MockAuthService';
import { AuthError, AuthErrorCode } from '../model/types';

describe('MockAuthService', () => {
  let service: MockAuthService;

  beforeEach(() => {
    // 新しいサービスインスタンスを作成（メモリベース）
    service = new MockAuthService();
  });

  describe('SignUp (新規登録)', () => {
    it('有効な認証情報でアカウントを作成できる', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      };

      const user = await service.signUpWithEmailAndPassword(credentials);

      expect(user.email).toBe(credentials.email);
      expect(user.displayName).toBe(credentials.displayName);
      expect(user.id).toBeTruthy();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.emailVerified).toBe(false);
    });

    it('サインアップ後、getCurrentUserで取得できる', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await service.signUpWithEmailAndPassword(credentials);
      
      const currentUser = await service.getCurrentUser();
      expect(currentUser).not.toBeNull();
      expect(currentUser?.email).toBe(credentials.email);
    });

    it('無効なメールアドレスでエラーが発生する', async () => {
      const credentials = {
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(
        service.signUpWithEmailAndPassword(credentials)
      ).rejects.toThrow(AuthError);
      
      await expect(
        service.signUpWithEmailAndPassword(credentials)
      ).rejects.toMatchObject({
        code: AuthErrorCode.INVALID_EMAIL,
      });
    });

    it('短すぎるパスワードでエラーが発生する', async () => {
      const credentials = {
        email: 'test@example.com',
        password: '12345', // 5文字（最低6文字必要）
      };

      await expect(
        service.signUpWithEmailAndPassword(credentials)
      ).rejects.toThrow(AuthError);
      
      await expect(
        service.signUpWithEmailAndPassword(credentials)
      ).rejects.toMatchObject({
        code: AuthErrorCode.WEAK_PASSWORD,
      });
    });
  });

  describe('SignIn (ログイン)', () => {
    it('任意の認証情報でログインできる（簡略化版）', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await service.signInWithEmailAndPassword(credentials);

      expect(user.email).toBe(credentials.email);
      expect(user.id).toBeTruthy();
    });

    it('ログイン後、getCurrentUserで取得できる', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      await service.signInWithEmailAndPassword(credentials);
      
      const currentUser = await service.getCurrentUser();
      expect(currentUser).not.toBeNull();
      expect(currentUser?.email).toBe(credentials.email);
    });

    it('無効なメールアドレスでエラーが発生する', async () => {
      const credentials = {
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(
        service.signInWithEmailAndPassword(credentials)
      ).rejects.toThrow(AuthError);
      
      await expect(
        service.signInWithEmailAndPassword(credentials)
      ).rejects.toMatchObject({
        code: AuthErrorCode.INVALID_EMAIL,
      });
    });

    it('短すぎるパスワードでエラーが発生する', async () => {
      const credentials = {
        email: 'test@example.com',
        password: '12345',
      };

      await expect(
        service.signInWithEmailAndPassword(credentials)
      ).rejects.toThrow(AuthError);
    });
  });

  describe('Google SignIn (Googleログイン)', () => {
    it('Googleアカウントでログインできる', async () => {
      const user = await service.signInWithGoogle();

      expect(user.email).toBe('test.google@example.com');
      expect(user.displayName).toBe('Google Test User');
      expect(user.emailVerified).toBe(true);
    });

    it('Googleログイン後、getCurrentUserで取得できる', async () => {
      await service.signInWithGoogle();
      
      const currentUser = await service.getCurrentUser();
      expect(currentUser).not.toBeNull();
      expect(currentUser?.email).toBe('test.google@example.com');
    });
  });

  describe('SignOut (ログアウト)', () => {
    beforeEach(async () => {
      await service.signUpWithEmailAndPassword({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('ログアウト後、getCurrentUserがnullを返す', async () => {
      await service.signOut();
      
      const currentUser = await service.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('Password Reset (パスワードリセット)', () => {
    it('パスワードリセットメールを送信できる', async () => {
      // モック実装なので、エラーが発生しないことを確認
      await expect(
        service.sendPasswordResetEmail({ email: 'test@example.com' })
      ).resolves.not.toThrow();
    });

    it('無効なメールアドレスでエラーが発生する', async () => {
      await expect(
        service.sendPasswordResetEmail({ email: 'invalid-email' })
      ).rejects.toThrow(AuthError);
      
      await expect(
        service.sendPasswordResetEmail({ email: 'invalid-email' })
      ).rejects.toMatchObject({
        code: AuthErrorCode.INVALID_EMAIL,
      });
    });
  });

  describe('Auth State Change Listener (認証状態の監視)', () => {
    it('認証状態変更時にリスナーが呼ばれる', async () => {
      const listener = vi.fn();
      const unsubscribe = service.onAuthStateChanged(listener);

      // 初回呼び出し（現在の状態）を待つ
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(listener).toHaveBeenCalledWith(null);

      // サインアップ
      await service.signUpWithEmailAndPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      // リスナーが呼ばれたことを確認
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenLastCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
        })
      );

      unsubscribe();
    });

    it('unsubscribe後、リスナーが呼ばれない', async () => {
      const listener = vi.fn();
      const unsubscribe = service.onAuthStateChanged(listener);

      await new Promise(resolve => setTimeout(resolve, 200));
      const callCountBeforeUnsubscribe = listener.mock.calls.length;

      // unsubscribe
      unsubscribe();

      // サインアップ
      await service.signUpWithEmailAndPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      // リスナーが呼ばれていないことを確認
      expect(listener).toHaveBeenCalledTimes(callCountBeforeUnsubscribe);
    });

    it('ログアウト時にリスナーがnullで呼ばれる', async () => {
      const listener = vi.fn();
      service.onAuthStateChanged(listener);

      // サインアップ
      await service.signUpWithEmailAndPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      listener.mockClear();

      // ログアウト
      await service.signOut();

      // リスナーが null で呼ばれたことを確認
      expect(listener).toHaveBeenCalledWith(null);
    });
  });
});
