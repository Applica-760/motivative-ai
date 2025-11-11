import { useState } from 'react';
import { Button, Divider, Stack } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { StyledModal } from '@/shared/ui/StyledModal';
import { useAuth } from '@/features/auth';
import { useProfile } from '../model/ProfileContext';
import { ProfileForm } from './ProfileForm';
import type { UpdateProfileData } from '../model/types';

interface ProfileModalProps {
  /** モーダルの開閉状態 */
  opened: boolean;
  /** モーダルを閉じる時のコールバック */
  onClose: () => void;
}

/**
 * ProfileModal
 * Feature-Sliced Design: features/account/ui
 * 
 * プロフィール編集モーダル
 * StyledModalを使用し、ProfileFormを内包する
 */
export function ProfileModal({ opened, onClose }: ProfileModalProps) {
  const { profile, updateProfile, createProfile } = useProfile();
  const { signOut } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  /**
   * ログアウト処理
   */
  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      notifications.show({
        title: 'ログアウト',
        message: 'ログアウトしました',
        color: 'blue',
      });
    } catch (error) {
      console.error('[ProfileModal] Logout failed:', error);
      notifications.show({
        title: 'エラー',
        message: 'ログアウトに失敗しました',
        color: 'red',
      });
    }
  };
  
  /**
   * 保存処理
   */
  const handleSave = async (data: UpdateProfileData) => {
    setIsSaving(true);
    
    try {
      // 既存プロフィールがあれば更新、なければ作成
      if (profile) {
        await updateProfile(data);
        notifications.show({
          title: '保存完了',
          message: 'プロフィールを更新しました',
          color: 'green',
        });
      } else {
        await createProfile(data);
        notifications.show({
          title: '作成完了',
          message: 'プロフィールを作成しました',
          color: 'green',
        });
      }
      
      onClose();
    } catch (error) {
      console.error('[ProfileModal] Failed to save profile:', error);
      notifications.show({
        title: 'エラー',
        message: 'プロフィールの保存に失敗しました',
        color: 'red',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      title={profile ? 'プロフィール設定' : 'プロフィールを作成'}
      size="lg"
    >
      <Stack gap="md">
        <ProfileForm
          initialDisplayName={profile?.displayName}
          initialGender={profile?.gender}
          initialIconColor={profile?.iconColor}
          initialAvatarIcon={profile?.avatarIcon}
          initialAiMessage={profile?.aiMessage}
          onSave={handleSave}
          onCancel={onClose}
          isSaving={isSaving}
        />
        
        <Divider />
        
        <Button
          variant="subtle"
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          fullWidth
        >
          ログアウト
        </Button>
      </Stack>
    </StyledModal>
  );
}
