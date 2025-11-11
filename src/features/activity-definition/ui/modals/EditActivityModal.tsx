import { Modal } from '@mantine/core';
import { ActivityForm } from '../forms';
import type { ActivityFormData } from '../../model/formTypes';
import type { ActivityDefinition } from '@/shared/types';
import { useActivityContext } from '@/features/activity/model/ActivityContext';
import { MODAL_STYLES, MODAL_OVERLAY_PROPS } from '../../config/modalStyles';

interface EditActivityModalProps {
  /** モーダルの開閉状態 */
  opened: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
  /** 編集対象のアクティビティ */
  activity: ActivityDefinition;
}

/**
 * アクティビティ編集モーダル
 * 
 * 既存のアクティビティを編集するためのモーダルダイアログ。
 * CreateActivityModalと同様のデザインとUIを提供する。
 * 
 * フォーム送信後は自動的にモーダルを閉じ、
 * アクティビティ一覧を更新する。
 */
export function EditActivityModal({ opened, onClose, activity }: EditActivityModalProps) {
  const { updateActivity } = useActivityContext();

  const handleSuccess = (data: ActivityFormData) => {
    console.log('[Activity] Updated:', data);
    
    // Contextのアクティビティを更新
    updateActivity(activity.id, {
      title: data.title,
      icon: data.icon,
      valueType: data.valueType,
      unit: data.unit,
      color: data.color,
    });
    
    // TODO: 成功通知を表示
    onClose();
  };

  // 初期値を設定
  const initialData: ActivityFormData = {
    title: activity.title,
    icon: activity.icon,
    valueType: activity.valueType,
    unit: activity.unit || '',
    color: activity.color || 'blue',
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`${activity.title} を編集`}
      centered
      size="lg"
      overlayProps={MODAL_OVERLAY_PROPS}
      styles={MODAL_STYLES}
    >
      <ActivityForm 
        onSuccess={handleSuccess} 
        onCancel={onClose}
        initialData={initialData}
        submitButtonText="更新する"
      />
    </Modal>
  );
}
