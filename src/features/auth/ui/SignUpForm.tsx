import { useState } from 'react';
import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useAuth } from '../model/AuthContext';
import { validateSignUpForm } from '../model/validation';
import type { SignUpCredentials } from '../model/types';
import { FormAlert } from './components/FormAlert';
import { FormSwitchLink } from './components/FormSwitchLink';

/**
 * SignUpFormのProps
 */
export interface SignUpFormProps {
  /**
   * サインアップ成功時のコールバック
   */
  onSuccess?: () => void;
  
  /**
   * ログインフォームへの切り替えコールバック
   */
  onSwitchToLogin?: () => void;
}

/**
 * SignUpForm
 * 
 * サインアップフォームコンポーネント。
 * Mantine UIを使用したモダンなデザイン。
 * 
 * @example
 * ```tsx
 * <SignUpForm 
 *   onSuccess={() => navigate('/dashboard')}
 *   onSwitchToLogin={() => setView('login')}
 * />
 * ```
 */
export function SignUpForm({ onSuccess, onSwitchToLogin }: SignUpFormProps) {
  const { signUp, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // クライアント側バリデーション
    const validation = validateSignUpForm(email, password, confirmPassword);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      return;
    }
    
    setValidationError(null);
    clearError();
    
    try {
      const credentials: SignUpCredentials = {
        email,
        password,
        displayName: displayName || undefined,
      };
      
      await signUp(credentials);
      
      // サインアップ成功
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // エラーはAuthContextで管理されている
      console.error('Sign up failed:', err);
    }
  };
  
  const handleClearError = () => {
    setValidationError(null);
    clearError();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <FormAlert
          error={error}
          validationError={validationError}
          onClose={handleClearError}
        />
        
        <TextInput
          label="表示名（オプション）"
          placeholder="山田太郎"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={isLoading}
        />
        
        <TextInput
          label="メールアドレス"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          disabled={isLoading}
        />
        
        <PasswordInput
          label="パスワード"
          placeholder="6文字以上"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <PasswordInput
          label="パスワード（確認）"
          placeholder="もう一度入力してください"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
        >
          アカウント作成
        </Button>
        
        {onSwitchToLogin && (
          <FormSwitchLink
            text="既にアカウントをお持ちの方は"
            linkText="ログイン"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          />
        )}
      </Stack>
    </form>
  );
}
