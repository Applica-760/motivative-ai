import { useState, useEffect } from 'react';
import {
  Stack,
  TextInput,
  Select,
  Textarea,
  ColorInput,
  Group,
  Button,
  Box,
  Text,
  SimpleGrid,
  UnstyledButton,
  Avatar,
} from '@mantine/core';
import type { Gender, UpdateProfileData } from '../model/types';
import { AVATAR_ICONS, DEFAULT_COLORS, getAvatarIcon } from '../config';

/**
 * 性別の選択肢
 */
const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: '未設定', label: '未設定' },
  { value: '男性', label: '男性' },
  { value: '女性', label: '女性' },
  { value: 'その他', label: 'その他' },
];

interface ProfileFormProps {
  /** 初期値: ユーザー名 */
  initialDisplayName?: string;
  /** 初期値: 性別 */
  initialGender?: Gender;
  /** 初期値: アイコン色 */
  initialIconColor?: string;
  /** 初期値: アバターアイコン */
  initialAvatarIcon?: string;
  /** 初期値: AIメッセージ */
  initialAiMessage?: string;
  /** 保存時のコールバック */
  onSave: (data: UpdateProfileData) => Promise<void>;
  /** キャンセル時のコールバック */
  onCancel: () => void;
  /** 保存中フラグ */
  isSaving?: boolean;
}

/**
 * ProfileForm
 * Feature-Sliced Design: features/account/ui
 * 
 * プロフィール情報を編集するフォームコンポーネント
 */
export function ProfileForm({
  initialDisplayName = '',
  initialGender = '未設定',
  initialIconColor = DEFAULT_COLORS[0],
  initialAvatarIcon = 'IconUser',
  initialAiMessage = '',
  onSave,
  onCancel,
  isSaving = false,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [iconColor, setIconColor] = useState(initialIconColor);
  const [avatarIcon, setAvatarIcon] = useState(initialAvatarIcon);
  const [aiMessage, setAiMessage] = useState(initialAiMessage);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 初期値が変更されたらフォームを更新
  useEffect(() => {
    setDisplayName(initialDisplayName);
    setGender(initialGender);
    setIconColor(initialIconColor);
    setAvatarIcon(initialAvatarIcon);
    setAiMessage(initialAiMessage);
  }, [initialDisplayName, initialGender, initialIconColor, initialAvatarIcon, initialAiMessage]);
  
  /**
   * バリデーション
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!displayName.trim()) {
      newErrors.displayName = 'ユーザー名を入力してください';
    } else if (displayName.length > 50) {
      newErrors.displayName = 'ユーザー名は50文字以内で入力してください';
    }
    
    if (aiMessage.length > 500) {
      newErrors.aiMessage = 'AIメッセージは500文字以内で入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * 保存処理
   */
  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    
    try {
      await onSave({
        displayName: displayName.trim(),
        gender,
        iconColor,
        avatarIcon,
        aiMessage: aiMessage.trim(),
      });
    } catch (error) {
      console.error('[ProfileForm] Failed to save:', error);
    }
  };
  
  // 選択中のアイコンコンポーネントを取得
  const SelectedIconComponent = getAvatarIcon(avatarIcon);
  
  return (
    <Stack gap="md">
      {/* プレビュー */}
      <Box style={{ textAlign: 'center', paddingTop: '1rem' }}>
        <Avatar
          size={80}
          radius="xl"
          style={{ margin: '0 auto', backgroundColor: iconColor }}
        >
          <SelectedIconComponent size={40} />
        </Avatar>
        <Text size="sm" c="dimmed" mt="sm">
          プレビュー
        </Text>
      </Box>
      
      {/* ユーザー名 */}
      <TextInput
        label="ユーザー名"
        placeholder="あなたの名前"
        required
        value={displayName}
        onChange={(e) => setDisplayName(e.currentTarget.value)}
        error={errors.displayName}
        maxLength={50}
      />
      
      {/* 性別 */}
      <Select
        label="性別"
        placeholder="性別を選択"
        data={GENDER_OPTIONS}
        value={gender}
        onChange={(value) => setGender(value as Gender)}
        allowDeselect={false}
      />
      
      {/* アイコン色 */}
      <ColorInput
        label="アイコンの色"
        placeholder="色を選択"
        value={iconColor}
        onChange={setIconColor}
        swatches={DEFAULT_COLORS}
        format="hex"
      />
      
      {/* アバター選択 */}
      <Box>
        <Text size="sm" fw={500} mb="xs">
          アバターアイコン
        </Text>
        <SimpleGrid cols={{ base: 4, sm: 6 }}>
          {AVATAR_ICONS.map((icon) => {
            const IconComponent = icon.icon;
            const isSelected = avatarIcon === icon.name;
            
            return (
              <UnstyledButton
                key={icon.name}
                onClick={() => setAvatarIcon(icon.name)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: isSelected ? `2px solid ${iconColor}` : '2px solid transparent',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    },
                  },
                }}
              >
                <Stack gap={4} align="center">
                  <IconComponent size={24} color={isSelected ? iconColor : '#999'} />
                  <Text size="xs" c={isSelected ? 'white' : 'dimmed'}>
                    {icon.label}
                  </Text>
                </Stack>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      </Box>
      
      {/* AIメッセージ */}
      <Textarea
        label="AIに伝えたいこと"
        placeholder="AIとのチャットでパーソナライズに使用される情報を入力してください"
        description="将来的に追加予定のAIチャット機能で使用されます"
        value={aiMessage}
        onChange={(e) => setAiMessage(e.currentTarget.value)}
        error={errors.aiMessage}
        minRows={3}
        maxRows={6}
        maxLength={500}
      />
      
      {/* ボタン */}
      <Group justify="flex-end" mt="md">
        <Button
          variant="subtle"
          onClick={onCancel}
          disabled={isSaving}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSave}
          loading={isSaving}
        >
          保存
        </Button>
      </Group>
    </Stack>
  );
}
