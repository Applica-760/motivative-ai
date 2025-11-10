import { useState } from 'react';
import { UnstyledButton, Group, Avatar, Text, Box, Menu } from '@mantine/core';
import { IconUser, IconLogout, IconChevronRight } from '@tabler/icons-react';
import { useAuth } from '../model/AuthContext';
import { AuthModal } from './AuthModal';

/**
 * AuthUserButton
 * 
 * サイドバー下部に配置するユーザー情報表示ボタン。
 * 未ログイン時はログインモーダルを開き、ログイン済みの場合はログアウトメニューを表示する。
 * 
 * @example
 * ```tsx
 * <AuthUserButton />
 * ```
 */
export function AuthUserButton() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [authModalOpened, setAuthModalOpened] = useState(false);
  
  /**
   * ユーザー名を取得
   * 優先順位: displayName > email > "ゲスト"
   */
  const getUserName = (): string => {
    if (!user) return 'ゲスト';
    return user.displayName || user.email || 'ゲスト';
  };
  
  /**
   * ボタンクリック時の処理
   */
  const handleClick = () => {
    if (!isAuthenticated) {
      // 未ログイン時はモーダルを開く
      setAuthModalOpened(true);
    }
  };
  
  /**
   * ログアウト処理
   */
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // ログイン済みの場合はメニュー付きボタンを表示
  if (isAuthenticated) {
    return (
      <>
        <Menu shadow="md" width={200} position="right-end">
          <Menu.Target>
            <UnstyledButton
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
              }}
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                },
              }}
            >
              <Group gap="sm">
                <Avatar color="teal" radius="xl" size="md">
                  <IconUser size={20} />
                </Avatar>
                
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500} truncate>
                    {getUserName()}
                  </Text>
                  {user?.email && user.displayName && (
                    <Text size="xs" c="dimmed" truncate>
                      {user.email}
                    </Text>
                  )}
                </Box>
                
                <IconChevronRight size={16} opacity={0.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              color="red"
              onClick={handleLogout}
            >
              ログアウト
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </>
    );
  }
  
  // 未ログイン時はログインモーダルを開くボタン
  return (
    <>
      <UnstyledButton
        onClick={handleClick}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          transition: 'background-color 0.2s',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
        }}
        styles={{
          root: {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }}
      >
        <Group gap="sm">
          <Avatar color="gray" radius="xl" size="md">
            <IconUser size={20} />
          </Avatar>
          
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500} c="dimmed">
              {getUserName()}
            </Text>
            <Text size="xs" c="dimmed">
              クリックしてログイン
            </Text>
          </Box>
          
          <IconChevronRight size={16} opacity={0.5} />
        </Group>
      </UnstyledButton>
      
      {/* ログインモーダル */}
      <AuthModal
        opened={authModalOpened}
        onClose={() => setAuthModalOpened(false)}
      />
    </>
  );
}
