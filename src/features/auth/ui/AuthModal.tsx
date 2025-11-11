import { useState } from 'react';
import { Tabs, Divider, Stack } from '@mantine/core';
import { StyledModal } from '@/shared/ui';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { GoogleLoginButton } from './GoogleLoginButton';

/**
 * AuthModalのProps
 */
export interface AuthModalProps {
  /**
   * モーダルの開閉状態
   */
  opened: boolean;
  
  /**
   * モーダルを閉じる際のコールバック
   */
  onClose: () => void;
  
  /**
   * 初期表示するタブ
   * @default 'login'
   */
  defaultTab?: 'login' | 'signup';
}

/**
 * AuthModal
 * 
 * ログイン/新規登録を切り替えるモーダルコンポーネント。
 * ログイン成功時は自動的にモーダルが閉じる。
 * 
 * @example
 * ```tsx
 * const [opened, setOpened] = useState(false);
 * 
 * <AuthModal 
 *   opened={opened}
 *   onClose={() => setOpened(false)}
 *   defaultTab="login"
 * />
 * ```
 */
export function AuthModal({ opened, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string | null>(defaultTab);
  
  /**
   * ログイン/サインアップ成功時の処理
   */
  const handleAuthSuccess = () => {
    // モーダルを閉じる
    onClose();
    
    // タブをログインに戻す（次回開いた時のため）
    setActiveTab('login');
  };
  
  /**
   * タブ切り替え処理
   */
  const handleSwitchToSignUp = () => {
    setActiveTab('signup');
  };
  
  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };
  
  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      title="アカウント"
      size="md"
    >
      <Stack gap="md">
        {/* Googleログインボタン */}
        <GoogleLoginButton onSuccess={handleAuthSuccess} />
        
        <Divider label="または" labelPosition="center" />
        
        {/* ログイン/サインアップタブ */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List grow>
            <Tabs.Tab value="login">ログイン</Tabs.Tab>
            <Tabs.Tab value="signup">新規登録</Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="login" pt="md">
            <LoginForm 
              onSuccess={handleAuthSuccess}
              onSwitchToSignUp={handleSwitchToSignUp}
            />
          </Tabs.Panel>
          
          <Tabs.Panel value="signup" pt="md">
            <SignUpForm 
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </StyledModal>
  );
}
