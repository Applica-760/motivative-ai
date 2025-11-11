import { RecordForm } from '../RecordForm';
import type { RecordFormData } from '../../model/recordFormTypes';
import { useActivityContext } from '@/features/activity/model/ActivityContext';
import { StyledModal } from '@/shared/ui';

interface AddRecordModalProps {
  /** モーダルの開閉状態 */
  opened: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
  /** 事前選択されたアクティビティID（グラフクリックから開いた場合） */
  preselectedActivityId?: string;
}

/**
 * 記録追加モーダル
 * 
 * 既存のアクティビティに新しい記録を追加するためのモーダルダイアログ。
 * 黒ベースの角丸デザインで、背景クリックで閉じることができる。
 * 
 * フォーム送信後は自動的にモーダルを閉じ、
 * アクティビティの記録一覧を更新する。
 */
export function AddRecordModal({ opened, onClose, preselectedActivityId }: AddRecordModalProps) {
  const { addRecord } = useActivityContext();

  const handleSuccess = async (data: RecordFormData) => {
    console.log('[AddRecordModal] Adding record:', data);
    
    try {
      // Contextに記録を追加（非同期処理を待つ）
      await addRecord({
        activityId: data.activityId,
        value: data.value,
        date: data.date,
        note: data.note,
      });
      
      console.log('[AddRecordModal] Record added successfully');
      
      // TODO: 成功通知を表示
      onClose();
    } catch (error) {
      console.error('[AddRecordModal] Failed to add record:', error);
      // エラーハンドリング（モーダルは閉じない）
    }
  };

  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      title="記録を追加"
      size="md"
    >
      <RecordForm 
        onSuccess={handleSuccess} 
        onCancel={onClose}
        initialActivityId={preselectedActivityId}
      />
    </StyledModal>
  );
}
