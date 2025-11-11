import { AiCharacter } from '@/features/ai';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/account';

/**
 * RightSidebar
 * Feature-Sliced Design: features/home/ui
 * 
 * ホーム画面の右サイドバー。
 * AIキャラクターを表示する。
 * ログイン時はプロフィールのユーザー名を表示。
 */
export function RightSidebar() {
  const { isAuthenticated } = useAuth();
  const { profile } = useProfile();

  // ログイン時はプロフィールのユーザー名を使用、未ログイン時は「ゲストユーザさん」
  const userName = isAuthenticated && profile?.displayName
    ? `${profile.displayName}さん`
    : 'ゲストユーザさん';

  return (
    <aside>
      <AiCharacter userName={userName} greeting="こんにちは！" />
    </aside>
  );
}
