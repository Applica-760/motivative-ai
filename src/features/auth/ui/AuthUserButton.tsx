import { useState, useMemo } from 'react';
import { UnstyledButton, Group, Avatar, Text, Box } from '@mantine/core';
import { IconUser, IconChevronRight } from '@tabler/icons-react';
import { useAuth } from '../model/AuthContext';
import { AuthModal } from './AuthModal';
import { ProfileModal, useProfile, getAvatarIcon } from '@/features/account';

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
  const { user, isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [profileModalOpened, setProfileModalOpened] = useState(false);
  
  /**
   * ユーザー名を取得
   * 優先順位: profile.displayName > user.displayName > email > "ゲスト"
   */
  const getUserName = (): string => {
    if (!user) return 'ゲスト';
    // プロフィール情報があればそちらを優先
    if (profile?.displayName) return profile.displayName;
    return user.displayName || user.email || 'ゲスト';
  };
  
  /**
   * アバターアイコンコンポーネントを取得
   */
  const AvatarIconComponent = useMemo(() => {
    if (profile?.avatarIcon) {
      return getAvatarIcon(profile.avatarIcon);
    }
    return IconUser;
  }, [profile?.avatarIcon]);
  
  /**
   * アバターの色を取得
   */
  const avatarColor = useMemo((): string => {
    if (profile?.iconColor) {
      return profile.iconColor;
    }
    return 'teal';
  }, [profile?.iconColor]);
  
  /**
   * ボタンクリック時の処理
   */
  const handleClick = () => {
    if (!isAuthenticated) {
      // 未ログイン時はログインモーダルを開く
      setAuthModalOpened(true);
    } else {
      // ログイン済みの場合はプロフィールモーダルを開く
      setProfileModalOpened(true);
    }
  };
  
  // ログイン済みの場合はメニュー付きボタンを表示
  if (isAuthenticated) {
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
            <Avatar 
              radius="xl" 
              size="md"
              style={{ backgroundColor: avatarColor }}
            >
              <AvatarIconComponent size={20} />
            </Avatar>
            
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" fw={500} truncate>
                {getUserName()}
              </Text>
            </Box>
            
            <IconChevronRight size={16} opacity={0.5} />
          </Group>
        </UnstyledButton>
        
        {/* プロフィールモーダル */}
        <ProfileModal
          opened={profileModalOpened}
          onClose={() => setProfileModalOpened(false)}
        />
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
