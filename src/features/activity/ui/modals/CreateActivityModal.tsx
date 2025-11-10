import { Modal } from '@mantine/core';
import { ActivityForm } from '../forms';
import type { ActivityFormData } from '../../model/formTypes';
import { useActivityContext } from '../../model/ActivityContext';
import { MODAL_STYLES, MODAL_OVERLAY_PROPS } from '../../config/modalStyles';

interface CreateActivityModalProps {
  /** モーダルの開閉状態 */
  opened: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
}

/**
 * アクティビティ作成モーダル
 * 
 * 新しいアクティビティを作成するためのモーダルダイアログ。
 * 黒ベースの角丸デザインで、背景クリックで閉じることができる。
 * 
 * フォーム送信後は自動的にモーダルを閉じ、
 * アクティビティ一覧を更新する。
 */
export function CreateActivityModal({ opened, onClose }: CreateActivityModalProps) {
  const { addActivity } = useActivityContext();

  const handleSuccess = async (data: ActivityFormData) => {
    console.log('[CreateActivityModal] Creating activity:', data);
    
    try {
      // Contextにアクティビティを追加（非同期処理を待つ）
      await addActivity({
        title: data.title,
        icon: data.icon,
        valueType: data.valueType,
        unit: data.unit,
        color: data.color,
      });
      
      console.log('[CreateActivityModal] Activity created successfully');
      
      // TODO: 成功通知を表示
      onClose();
    } catch (error) {
      console.error('[CreateActivityModal] Failed to create activity:', error);
      // エラーハンドリング（モーダルは閉じない）
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="新しいアクティビティ"
      centered
      size="lg"
      overlayProps={MODAL_OVERLAY_PROPS}
      styles={MODAL_STYLES}
    >
      <ActivityForm onSuccess={handleSuccess} onCancel={onClose} />
    </Modal>
  );
}
