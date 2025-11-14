import { useState } from 'react';
import { QuickActionButton } from '@/shared/ui';
import { ACTIVITY_DEFINITION_GRADIENTS } from '../../config/constants';
import { CreateActivityModal } from '../modals';

interface CreateActivityButtonProps {
  /** クリック時のアクション（オプション、内部でモーダルを開く） */
  onClick?: () => void;
  /** 無効化フラグ */
  disabled?: boolean;
}

/**
 * アクティビティ作成ボタン
 * 
 * システムの中核機能として特別な位置づけ:
 * - 新しいアクティビティを作成する
 * - プリセットのスタイル（変更不可）
 * - アクティビティドメインと強く結合
 * 
 * 特徴:
 * - グリッドレイアウトの1×1（正方形）に配置
 * - クリックでモーダルを開き、アクティビティ作成フォームを表示
 * - タイトル、アイコン、記録する値の型などを設定
 */
export function CreateActivityButton({ onClick, disabled = false }: CreateActivityButtonProps) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    console.log('[Activity] 新しいアクティビティボタンがクリックされました');
    setOpened(true);
    onClick?.();
  };

  return (
    <>
      <QuickActionButton
        icon="✨"
        title="アクティビティを作成"
        description=""
        gradient={ACTIVITY_DEFINITION_GRADIENTS.create}
        onClick={handleClick}
        disabled={disabled}
      />
      <CreateActivityModal opened={opened} onClose={() => setOpened(false)} />
    </>
  );
}
