import { Card, Text, Stack, ThemeIcon, rem } from '@mantine/core';
import { colors } from '@/shared/config';

/**
 * グラデーション設定
 */
export interface ActionGradient {
  from: string;
  to: string;
  deg?: number;
}

/**
 * QuickActionButtonのプロパティ
 */
export interface QuickActionButtonProps {
  /** アイコン（絵文字） */
  icon: string;
  /** タイトル */
  title: string;
  /** 説明文 */
  description: string;
  /** グラデーション設定 */
  gradient: ActionGradient;
  /** クリック時のアクション */
  onClick?: () => void;
  /** 無効化フラグ */
  disabled?: boolean;
}

/**
 * 正方形のクイックアクションボタン
 * グリッドレイアウトの1×1サイズで使用される標準的なアクションボタン
 * 
 * 使用例:
 * - アクティビティ記録追加
 * - 新規アクティビティ作成
 * - 設定を開く
 * - レポートを見る
 * など、汎用的なアクション
 */
export function QuickActionButton({
  icon,
  title,
  description,
  gradient,
  onClick,
  disabled = false,
}: QuickActionButtonProps) {
  return (
    <Card
      shadow="none"
      padding="xl"
      radius="lg"
      onClick={disabled ? undefined : onClick}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'none',
        minHeight: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Stack align="center" gap="xl">
        <ThemeIcon
          size={80}
          radius="xl"
          variant="gradient"
          gradient={{ from: gradient.from, to: gradient.to, deg: gradient.deg ?? 45 }}
          style={{
            boxShadow: `0 4px 12px ${colors.shadow.blue}`,
          }}
        >
          <Text size={rem(36)} fw={700}>
            {icon}
          </Text>
        </ThemeIcon>
        <Stack align="center" gap="xs">
          <Text
            size="xl"
            fw={600}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {title}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {description}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}
