import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { StyledModal } from '@/shared/ui/StyledModal';
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
  const [isSaving, setIsSaving] = useState(false);
  
  /**
   * 保存処理
   */
  const handleSave = async (data: UpdateProfileData) => {
    try {
      setIsSaving(true);
      
      if (profile) {
        // 既存プロフィールを更新
        await updateProfile(data);
        notifications.show({
          title: '保存完了',
          message: 'プロフィールを更新しました',
          color: 'green',
        });
      } else {
        // 新規プロフィールを作成
        await createProfile(
          data.displayName || '',
          data.gender || '未設定',
          data.iconColor || '#228be6',
          data.avatarIcon || 'IconUser',
          data.aiMessage || ''
        );
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
    </StyledModal>
  );
}
