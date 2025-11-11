import { Paper, Stack, Text, Center } from '@mantine/core';
import { useEyeTracking, useParallax } from '../hooks';
import { CharacterEyes } from './CharacterEyes';
import { ParallaxBackground } from './ParallaxBackground';

interface AiCharacterProps {
  /** ユーザー名（表示用） */
  userName?: string;
  /** 挨拶メッセージ */
  greeting?: string;
}

/**
 * AIキャラクターコンポーネント
 * Feature-Sliced Design: features/ai/ui
 * 
 * マウスを追跡する目とパララックス背景を持つAIキャラクター。
 * 将来的にチャット機能を統合する予定。
 * 
 * 責務:
 * - キャラクターの目のアニメーション
 * - パララックス背景エフェクト
 * - ユーザーへの挨拶表示
 * 
 * @example
 * ```tsx
 * <AiCharacter userName="ゲストユーザさん" greeting="こんにちは！" />
 * ```
 */
export function AiCharacter({ userName = 'ゲストユーザさん', greeting = 'こんにちは！' }: AiCharacterProps) {
  const { eyesRef, pupilPosition } = useEyeTracking();
  const { containerRef, getParallaxOffset } = useParallax();

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Paper p="lg" style={{ position: 'relative', overflow: 'hidden', minHeight: '320px' }}>
        {/* パララックス背景 */}
        <ParallaxBackground getParallaxOffset={getParallaxOffset} />

        {/* メインコンテンツ */}
        <Stack gap="xl" align="center" style={{ position: 'relative', zIndex: 1 }}>
          {/* マウス追跡する目 */}
          <Center style={{ marginTop: '80px' }}>
            <CharacterEyes pupilPosition={pupilPosition} eyesRef={eyesRef} />
          </Center>

          {/* 吹き出し */}
          <Paper
            shadow="md"
            p="md"
            radius="lg"
            withBorder
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '250px',
              marginTop: '120px',
            }}
          >
            <Stack gap={0}>
              <Text size="lg" fw={600} ta="center">
                {userName}
              </Text>
              <Text size="lg" fw={600} ta="center">
                {greeting}
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </div>
  );
}
