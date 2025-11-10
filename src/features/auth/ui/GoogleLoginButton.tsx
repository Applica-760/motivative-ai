import { Button } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useAuth } from '../model/AuthContext';

/**
 * GoogleLoginButtonのProps
 */
export interface GoogleLoginButtonProps {
  /**
   * ログイン成功時のコールバック
   */
  onSuccess?: () => void;
  
  /**
   * 全幅表示するかどうか
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * GoogleLoginButton
 * 
 * Googleアカウントでログインするためのボタン。
 * useAuthフックを使用してGoogleログイン処理を実行する。
 * 
 * @example
 * ```tsx
 * <GoogleLoginButton 
 *   onSuccess={() => console.log('Logged in!')}
 * />
 * ```
 */
export function GoogleLoginButton({ onSuccess, fullWidth = true }: GoogleLoginButtonProps) {
  const { signInWithGoogle, isLoading, clearError } = useAuth();
  
  const handleGoogleLogin = async () => {
    try {
      clearError();
      
      await signInWithGoogle();
      
      // ログイン成功
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // エラーはAuthContextで管理されている
      console.error('Google login failed:', err);
    }
  };
  
  return (
    <Button
      leftSection={<IconBrandGoogle size={20} />}
      variant="default"
      fullWidth={fullWidth}
      onClick={handleGoogleLogin}
      loading={isLoading}
      styles={{
        root: {
          border: '1px solid #4285f4',
          '&:hover': {
            backgroundColor: 'rgba(66, 133, 244, 0.1)',
          },
        },
      }}
    >
      Googleでログイン
    </Button>
  );
}
