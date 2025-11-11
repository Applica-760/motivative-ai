import { Box, Loader, Text, Stack } from '@mantine/core';
import { colors } from '@/shared/config';

/**
 * LoadingScreenのProps
 */
interface LoadingScreenProps {
  /** ローディングメッセージ */
  message?: string;
  /** ローダーのサイズ */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 最小の高さ（画面全体に表示する場合は100vh） */
  minHeight?: string;
}

/**
 * LoadingScreen
 * Feature-Sliced Design: shared/ui
 * 
 * アプリケーション全体で使用できる汎用ローディング画面。
 * 認証初期化、データ読み込み中などに表示する。
 * 
 * @example
 * ```tsx
 * // 認証初期化中
 * <LoadingScreen message="認証情報を確認中..." />
 * 
 * // データ読み込み中
 * <LoadingScreen message="データを読み込んでいます..." size="sm" minHeight="400px" />
 * ```
 */
export function LoadingScreen({ 
  message = '読み込み中...',
  size = 'md',
  minHeight = '100vh',
}: LoadingScreenProps) {
  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        backgroundColor: colors.background.dark,
      }}
    >
      <Stack align="center" gap="md">
        <Loader size={size} color="blue" type="dots" />
        <Text size="sm" c="dimmed">
          {message}
        </Text>
      </Stack>
    </Box>
  );
}
