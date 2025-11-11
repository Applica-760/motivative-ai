import { AiCharacter } from '@/features/ai';

/**
 * RightSidebar
 * Feature-Sliced Design: features/home/ui
 * 
 * ホーム画面の右サイドバー。
 * AIキャラクターを表示する。
 */
export function RightSidebar() {
  return (
    <aside>
      <AiCharacter userName="ゲストユーザさん" greeting="こんにちは！" />
    </aside>
  );
}
