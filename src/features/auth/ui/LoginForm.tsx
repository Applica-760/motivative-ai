import { useState } from 'react';
import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useAuth } from '../model/AuthContext';
import { validateLoginForm } from '../model/validation';
import type { LoginCredentials } from '../model/types';
import { FormAlert } from './components/FormAlert';
import { FormSwitchLink } from './components/FormSwitchLink';

/**
 * LoginFormのProps
 */
export interface LoginFormProps {
  /**
   * ログイン成功時のコールバック
   */
  onSuccess?: () => void;
  
  /**
   * サインアップフォームへの切り替えコールバック
   */
  onSwitchToSignUp?: () => void;
}

/**
 * LoginForm
 * 
 * ログインフォームコンポーネント。
 * Mantine UIを使用したモダンなデザイン。
 * 
 * @example
 * ```tsx
 * <LoginForm 
 *   onSuccess={() => navigate('/dashboard')}
 *   onSwitchToSignUp={() => setView('signup')}
 * />
 * ```
 */
export function LoginForm({ onSuccess, onSwitchToSignUp }: LoginFormProps) {
  const { signIn, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // クライアント側バリデーション
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      return;
    }
    
    setValidationError(null);
    clearError();
    
    try {
      const credentials: LoginCredentials = {
        email,
        password,
      };
      
      await signIn(credentials);
      
      // ログイン成功
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // エラーはAuthContextで管理されている
      console.error('Login failed:', err);
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
          placeholder="パスワードを入力"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
        >
          ログイン
        </Button>
        
        {onSwitchToSignUp && (
          <FormSwitchLink
            text="アカウントをお持ちでない方は"
            linkText="新規登録"
            onClick={onSwitchToSignUp}
            disabled={isLoading}
          />
        )}
      </Stack>
    </form>
  );
}
