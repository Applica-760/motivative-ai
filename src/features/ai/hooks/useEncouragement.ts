import { useState, useCallback, useRef } from 'react';
import { getRandomEncouragement } from '../config/encouragementMessages';
import type { SpeechBubbleMessage } from '../config/messageConfig';

/**
 * 励ましメッセージ管理フック
 * Feature-Sliced Design: features/ai/hooks
 * 
 * 責務:
 * - 励ましメッセージの状態管理
 * - ランダムなメッセージの追加
 * - メッセージのクリア
 * - アニメーション中の連打防止
 * 
 * @example
 * ```tsx
 * const { messages, addEncouragement, clearMessages, isAnimating } = useEncouragement();
 * 
 * // クリック時にメッセージ追加
 * <button onClick={addEncouragement} disabled={isAnimating}>励まして！</button>
 * 
 * // メッセージ表示
 * <SpeechBubbleList messages={messages} />
 * ```
 */
export function useEncouragement() {
  const [messages, setMessages] = useState<SpeechBubbleMessage[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<number | null>(null);

  /**
   * ランダムな励ましメッセージを追加
   * クリックから表示まで200msの遅延を追加
   * アニメーション中は追加処理を受け付けない（連打防止）
   */
  const addEncouragement = useCallback(() => {
    // アニメーション中は処理しない
    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    setTimeout(() => {
      const encouragement = getRandomEncouragement();
      const newMessage: SpeechBubbleMessage = {
        id: `msg-${Date.now()}`,
        text: encouragement.text,
        createdAt: new Date(),
      };
      
      setMessages((prev) => [...prev, newMessage]);

      // アニメーション完了まで待つ（200ms遅延 + 400msアニメーション）
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 400); // アニメーション時間と同じ
    }, 200); // 200msの遅延
  }, [isAnimating]);

  /**
   * すべてのメッセージをクリア
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * 特定のメッセージを削除
   */
  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  return {
    /** 表示中のメッセージリスト */
    messages,
    /** ランダムな励ましメッセージを追加 */
    addEncouragement,
    /** すべてのメッセージをクリア */
    clearMessages,
    /** 特定のメッセージを削除 */
    removeMessage,
    /** アニメーション中かどうか */
    isAnimating,
  };
}
