import { Paper, Stack, Center } from '@mantine/core';
import { useEyeTracking, useParallax } from '../hooks';
import { CharacterEyes } from './CharacterEyes';
import { ParallaxBackground } from './ParallaxBackground';
import { SpeechBubbleList } from './SpeechBubbleList';
import type { SpeechBubbleMessage } from '../config/messageConfig';

interface AiCharacterProps {
  /** 表示するメッセージのリスト */
  messages: SpeechBubbleMessage[];
  /** メッセージクリック時のコールバック（オプション） */
  onMessageClick?: (message: SpeechBubbleMessage) => void;
  /** キャラクタークリック時のコールバック（オプション） */
  onCharacterClick?: () => void;
}

/**
 * AIキャラクターコンポーネント
 * Feature-Sliced Design: features/ai/ui
 * 
 * マウスを追跡する目とパララックス背景を持つAIキャラクター。
 * 複数の吹き出しメッセージをリスト表示。
 * キャラクター（目）をクリックすると励ましメッセージを表示。
 * 将来的にチャット機能を統合する予定。
 * 
 * 責務:
 * - キャラクターの目のアニメーション
 * - パララックス背景エフェクト
 * - メッセージリストの表示
 * - クリックインタラクション
 * 
 * @example
 * ```tsx
 * <AiCharacter 
 *   messages={messages}
 *   onCharacterClick={addEncouragement}
 * />
 * ```
 */
export function AiCharacter({ messages, onMessageClick, onCharacterClick }: AiCharacterProps) {
  const { eyesRef, pupilPosition } = useEyeTracking();
  const { containerRef, getParallaxOffset } = useParallax();

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Paper p="lg" style={{ position: 'relative' }}>
        {/* パララックス背景（固定高さコンテナ） */}
        <div 
          style={{ 
            position: 'relative', 
            height: '320px', 
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <ParallaxBackground 
            getParallaxOffset={getParallaxOffset}
            onCircleClick={onCharacterClick}
          />
        </div>

        {/* メインコンテンツ */}
        <Stack 
          gap="xl" 
          align="center" 
          style={{ 
            position: 'relative', 
            zIndex: 5, 
            pointerEvents: 'none',
            marginTop: '-320px', // パララックスコンテナと重ねる
          }}
        >
          {/* マウス追跡する目 */}
          <Center 
            style={{ 
              marginTop: '80px', 
              pointerEvents: 'auto', 
              position: 'relative', 
              zIndex: 20,
              cursor: onCharacterClick ? 'pointer' : 'default',
            }}
            onClick={onCharacterClick}
          >
            <CharacterEyes pupilPosition={pupilPosition} eyesRef={eyesRef} />
          </Center>

          {/* 吹き出しリスト */}
          <div style={{ marginTop: '120px', width: '100%', pointerEvents: 'auto' }}>
            <SpeechBubbleList messages={messages} onMessageClick={onMessageClick} />
          </div>
        </Stack>
      </Paper>
    </div>
  );
}
