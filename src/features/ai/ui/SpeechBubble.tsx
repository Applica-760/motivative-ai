import { Paper, Stack, Text } from '@mantine/core';
import { useState, useEffect, useMemo } from 'react';
import { colors } from '@/shared/config';
import type { SpeechBubbleMessage } from '../config/messageConfig';
import { formatMessageText } from '../utils';

interface SpeechBubbleProps {
  /** 表示するメッセージ */
  message: SpeechBubbleMessage;
  /** クリック時のコールバック（オプション） */
  onClick?: () => void;
  /** 新規メッセージかどうか（スライドインアニメーション用） */
  isNew?: boolean;
}

/**
 * AIキャラクターの吹き出しコンポーネント
 * Feature-Sliced Design: features/ai/ui
 * 
 * ActivityButtonと同じ浮かび上がりアニメーションを実装。
 * 新規メッセージは上から滑らかにスライドインする。
 * 
 * アニメーション仕様:
 * - 初回表示: translateY(-20px) → translateY(0) のスライドイン（0.4s ease-out）
 * - ホバー時: translateY(-4px) で上に4px浮き上がる
 * - ホバー時: boxShadow を強調
 * - transition: 0.2s ease
 * 
 * 責務:
 * - 単一のメッセージ表示
 * - スライドインアニメーション
 * - ホバーアニメーション
 * 
 * @example
 * ```tsx
 * <SpeechBubble message={{ id: '1', text: 'こんにちは！' }} isNew />
 * ```
 */
export function SpeechBubble({ message, onClick, isNew = false }: SpeechBubbleProps) {
  const [isAnimating, setIsAnimating] = useState(isNew);
  const [isExpanding, setIsExpanding] = useState(isNew);

  // メッセージテキストを整形（改行挿入とフォントサイズ最適化）
  const formattedMessage = useMemo(() => formatMessageText(message.text), [message.text]);

  useEffect(() => {
    if (isNew) {
      // 次のフレームで展開開始（ブラウザの最適化を活用）
      requestAnimationFrame(() => {
        setIsExpanding(false);
      });
      
      // アニメーション完了後にフラグをオフ
      const animationTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 400);
      
      return () => {
        clearTimeout(animationTimer);
      };
    }
  }, [isNew]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '300px',
        // GPU アクセラレーションを利用: scaleY + transform-origin でスムーズに展開
        transformOrigin: 'top',
        transform: isExpanding ? 'scaleY(0)' : 'scaleY(1)',
        opacity: isExpanding ? 0 : 1,
        // will-change でブラウザに事前に最適化を指示
        willChange: isExpanding ? 'transform, opacity' : 'auto',
        transition: isExpanding 
          ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease-out' 
          : 'all 0.2s ease',
      }}
    >
      <Paper
        shadow="md"
        p="md"
        radius="lg"
        withBorder
        onClick={onClick}
        style={{
          position: 'relative',
          width: '100%',
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: `0 2px 8px ${colors.shadow.light}`,
          // スライドインアニメーション: 内側のコンテンツを上から20px下にスライド
          // translateを使ってGPUアクセラレーション
          transform: isAnimating ? 'translate3d(0, -20px, 0)' : 'translate3d(0, 0, 0)',
          opacity: isAnimating ? 0 : 1,
          // will-change でブラウザに事前に最適化を指示
          willChange: isAnimating ? 'transform, opacity' : 'auto',
          // cubic-bezierでより滑らかなイージング
          transition: isAnimating 
            ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out' 
            : 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!isAnimating) {
            e.currentTarget.style.transform = 'translate3d(0, -4px, 0)';
            e.currentTarget.style.boxShadow = `0 8px 16px ${colors.shadow.medium}`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isAnimating) {
            e.currentTarget.style.transform = 'translate3d(0, 0, 0)';
            e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow.light}`;
          }
        }}
      >
        <Stack gap={0}>
          <Text 
            fw={600} 
            ta="center"
            style={{
              fontSize: `${formattedMessage.fontSize}rem`,
              lineHeight: formattedMessage.lineCount > 2 ? '1.6' : '1.7',
              whiteSpace: 'pre-wrap', // 改行を有効化
              wordBreak: 'keep-all', // 日本語の自然な改行
              overflowWrap: 'break-word', // 長い単語は折り返し
            }}
          >
            {formattedMessage.text}
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}
