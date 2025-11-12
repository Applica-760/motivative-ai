import { useState } from 'react';
import { QuickActionButton } from '@/shared/components';
import { ACTIVITY_GRADIENTS } from '@/features/activity/config/constants';
import { AddRecordModal } from '../modals';

interface AddRecordButtonProps {
  /** クリック時のアクション（オプション、内部でモーダルを開く） */
  onClick?: () => void;
  /** 無効化フラグ（アクティビティが存在しない場合など） */
  disabled?: boolean;
}

/**
 * アクティビティ記録追加ボタン
 * 
 * システムの中核機能として特別な位置づけ:
 * - 既存のアクティビティに新しい記録を追加する
 * - プリセットのスタイル（変更不可）
 * - アクティビティドメインと強く結合
 * 
 * 特徴:
 * - グリッドレイアウトの1×1（正方形）に配置
 * - クリックでモーダルを開き、記録追加フォームを表示
 * - アクティビティが存在しない場合は無効化される
 */
export function AddRecordButton({ onClick, disabled = false }: AddRecordButtonProps) {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    console.log('[Activity] 記録を追加ボタンがクリックされました');
    setOpened(true);
    onClick?.();
  };

  return (
    <>
      <QuickActionButton
        icon="➕"
        title="記録を追加"
        description=""
        gradient={ACTIVITY_GRADIENTS.addRecord}
        onClick={handleClick}
        disabled={disabled}
      />
      <AddRecordModal opened={opened} onClose={() => setOpened(false)} />
    </>
  );
}
