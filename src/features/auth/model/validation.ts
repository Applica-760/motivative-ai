/**
 * Form Validation
 * Feature-Sliced Design: features/auth/model
 * 
 * UI層で使用するフォームバリデーションロジック
 */

/**
 * バリデーション結果
 */
export interface ValidationResult {
  /** バリデーションが成功したか */
  isValid: boolean;
  /** エラーメッセージ（バリデーション失敗時） */
  error?: string;
}

/**
 * メールアドレスのバリデーション
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'メールアドレスを入力してください' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'メールアドレスの形式が正しくありません' };
  }
  
  return { isValid: true };
}

/**
 * パスワードのバリデーション
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'パスワードを入力してください' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'パスワードは6文字以上で入力してください' };
  }
  
  return { isValid: true };
}

/**
 * パスワード確認のバリデーション
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: 'パスワード（確認）を入力してください' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'パスワードが一致しません' };
  }
  
  return { isValid: true };
}

/**
 * ログインフォームのバリデーション
 */
export function validateLoginForm(
  email: string,
  password: string
): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.isValid) {
    return emailResult;
  }
  
  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) {
    return passwordResult;
  }
  
  return { isValid: true };
}

/**
 * サインアップフォームのバリデーション
 */
export function validateSignUpForm(
  email: string,
  password: string,
  confirmPassword: string
): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.isValid) {
    return emailResult;
  }
  
  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) {
    return passwordResult;
  }
  
  const confirmResult = validatePasswordConfirmation(password, confirmPassword);
  if (!confirmResult.isValid) {
    return confirmResult;
  }
  
  return { isValid: true };
}
