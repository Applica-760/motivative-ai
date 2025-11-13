import { Stack } from '@mantine/core';
import { SpeechBubble } from './SpeechBubble';
import type { SpeechBubbleMessage } from '../config/messageConfig';

interface SpeechBubbleListProps {
  /** 表示するメッセージのリスト */
  messages: SpeechBubbleMessage[];
  /** メッセージクリック時のコールバック（オプション） */
  onMessageClick?: (message: SpeechBubbleMessage) => void;
}

/**
 * AIキャラクターの吹き出しリストコンポーネント
 * Feature-Sliced Design: features/ai/ui
 * 
 * 複数のSpeechBubbleをリスト形式で表示。
 * 各吹き出しは独立してアニメーションする。
 * 新しいメッセージが上に表示される（降順）。
 * 最新のメッセージにはスライドインアニメーションが適用される。
 * 
 * 責務:
 * - メッセージリストの反復表示
 * - メッセージクリックイベントの伝播
 * - 最新メッセージの識別
 * 
 * @example
 * ```tsx
 * <SpeechBubbleList 
 *   messages={[
 *     { id: '1', text: 'こんにちは！' },
 *     { id: '2', text: '今日も頑張りましょう！' }
 *   ]} 
 * />
 * ```
 */
export function SpeechBubbleList({ messages, onMessageClick }: SpeechBubbleListProps) {
  // メッセージを逆順で表示（新しいものが上）
  const reversedMessages = [...messages].reverse();
  
  // 最新メッセージのID（配列の最後の要素）
  const latestMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;

  return (
    <Stack gap="md" align="center" style={{ width: '100%' }}>
      {reversedMessages.map((message) => (
        <SpeechBubble
          key={message.id}
          message={message}
          onClick={onMessageClick ? () => onMessageClick(message) : undefined}
          isNew={message.id === latestMessageId}
        />
      ))}
    </Stack>
  );
}
