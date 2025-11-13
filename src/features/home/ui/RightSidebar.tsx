import { useMemo } from 'react';
import { AiCharacter, useEncouragement } from '@/features/ai';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/account';
import type { SpeechBubbleMessage } from '@/features/ai';

/**
 * RightSidebar
 * Feature-Sliced Design: features/home/ui
 * 
 * ホーム画面の右サイドバー。
 * AIキャラクターを表示する。
 * ログイン時はプロフィールのユーザー名を表示。
 * キャラクターをクリックすると励ましメッセージが追加される。
 */
export function RightSidebar() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();
  const { messages: encouragementMessages, addEncouragement } = useEncouragement();

  // ログイン時はプロフィールのユーザー名を使用、未ログイン時は「ゲストユーザさん」
  const userName = isAuthenticated && profile?.displayName
    ? `${profile.displayName}さん`
    : 'ゲストユーザさん';

  // 初期メッセージ（挨拶）を構築
  const greetingMessages: SpeechBubbleMessage[] = useMemo(() => [
    {
      id: 'greeting',
      text: `${userName}\nこんにちは！`,
    },
    {
      id: 'motivation',
      text: '今日も頑張りましょう！',
    },
  ], [userName]);

  // 挨拶メッセージ + 励ましメッセージを結合
  const allMessages = useMemo(() => [
    ...greetingMessages,
    ...encouragementMessages,
  ], [greetingMessages, encouragementMessages]);

  return (
    <aside>
      <AiCharacter 
        messages={allMessages}
        onCharacterClick={addEncouragement}
      />
    </aside>
  );
}
