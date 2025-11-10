/**
 * Auth Service Validators
 * Feature-Sliced Design: features/auth/model
 * 
 * AuthService実装で使用するバリデーター
 * バリデーション失敗時はAuthErrorをthrowする
 */

import { AuthError, AuthErrorCode } from './types';

/**
 * AuthService用バリデーター
 */
export class AuthValidators {
  /**
   * メールアドレスのバリデーション
   * @throws AuthError バリデーション失敗時
   */
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AuthError(
        AuthErrorCode.INVALID_EMAIL,
        'Invalid email address format'
      );
    }
  }
  
  /**
   * パスワードのバリデーション
   * @throws AuthError バリデーション失敗時
   */
  static validatePassword(password: string): void {
    if (password.length < 6) {
      throw new AuthError(
        AuthErrorCode.WEAK_PASSWORD,
        'Password must be at least 6 characters long'
      );
    }
  }
}
