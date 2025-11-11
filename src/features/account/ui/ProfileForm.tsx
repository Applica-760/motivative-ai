import { useState, useMemo } from 'react';
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
import { AVATAR_ICONS, DEFAULT_COLORS, getAvatarIcon, GENDER_OPTIONS, VALIDATION_RULES } from '../config';

// スタイル定数
const STYLES = {
  preview: {
    textAlign: 'center' as const,
    paddingTop: '1rem',
  },
  avatarContainer: {
    margin: '0 auto',
  },
  colorButton: (isSelected: boolean) => ({
    width: 40,
    height: 40,
    borderRadius: '8px',
    border: isSelected ? '3px solid white' : '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.2s',
    cursor: 'pointer',
  }),
  iconButton: (isSelected: boolean) => ({
    padding: '0.75rem',
    borderRadius: '8px',
    border: isSelected ? '2px solid' : '2px solid transparent',
    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
    transition: 'all 0.2s',
  }),
} as const;

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
  
  // 選択中のアイコンコンポーネント
  const SelectedIconComponent = useMemo(() => getAvatarIcon(avatarIcon), [avatarIcon]);
  
  /**
   * バリデーション
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!displayName.trim()) {
      newErrors.displayName = 'ユーザー名を入力してください';
    } else if (displayName.length > VALIDATION_RULES.DISPLAY_NAME_MAX_LENGTH) {
      newErrors.displayName = `ユーザー名は${VALIDATION_RULES.DISPLAY_NAME_MAX_LENGTH}文字以内で入力してください`;
    }
    
    if (aiMessage.length > VALIDATION_RULES.AI_MESSAGE_MAX_LENGTH) {
      newErrors.aiMessage = `AIメッセージは${VALIDATION_RULES.AI_MESSAGE_MAX_LENGTH}文字以内で入力してください`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * 保存処理
   */
  const handleSave = async () => {
    if (!validate()) return;
    
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
  
  return (
    <Stack gap="md">
      {/* プレビュー */}
      <Box style={STYLES.preview}>
        <Avatar
          size={80}
          radius="xl"
          style={{ ...STYLES.avatarContainer, backgroundColor: iconColor }}
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
        maxLength={VALIDATION_RULES.DISPLAY_NAME_MAX_LENGTH}
      />
      
      {/* 性別 */}
      <Select
        label="性別"
        placeholder="性別を選択"
        data={GENDER_OPTIONS}
        value={gender}
        onChange={(value) => value && setGender(value as Gender)}
        allowDeselect={false}
      />
      
      {/* アイコン色 */}
      <Box>
        <Text size="sm" fw={500} mb="xs">
          アイコンの色
        </Text>
        <Group gap="xs">
          {DEFAULT_COLORS.map((color) => (
            <UnstyledButton
              key={color}
              onClick={() => setIconColor(color)}
              style={{
                ...STYLES.colorButton(iconColor === color),
                backgroundColor: color,
              }}
              styles={{
                root: {
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            />
          ))}
        </Group>
        <ColorInput
          placeholder="カスタムカラーを入力 (例: #ff6b6b)"
          value={iconColor}
          onChange={setIconColor}
          format="hex"
          mt="xs"
          size="xs"
          styles={{
            input: {
              fontSize: '0.75rem',
            },
          }}
        />
      </Box>
      
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
                  ...STYLES.iconButton(isSelected),
                  borderColor: isSelected ? iconColor : 'transparent',
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
        maxLength={VALIDATION_RULES.AI_MESSAGE_MAX_LENGTH}
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
