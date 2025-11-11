import { Box, Stack, Text, Divider } from '@mantine/core';
import { useState } from 'react';
import { useRecordForm } from '../../hooks/useRecordForm';
import { ActivitySelect } from './ActivitySelect';
import { ValueInput } from './ValueInput';
import { DateField } from './DateField';
import { NoteField } from './NoteField';
import { FormActions } from '@/shared/components';
import type { RecordFormData } from '../../model/recordFormTypes';

interface RecordFormProps {
  /** フォーム送信成功時のコールバック */
  onSuccess?: (data: RecordFormData) => void;
  /** キャンセル時のコールバック */
  onCancel?: () => void;
  /** 初期選択されるアクティビティID（グラフクリックから開いた場合） */
  initialActivityId?: string;
}

/**
 * 記録追加フォーム
 * 
 * 既存のアクティビティに新しい記録を追加するフォーム。
 * アクティビティの記録タイプに応じて、適切な入力フィールドを表示。
 * 
 * フィールド:
 * - アクティビティ選択（必須）
 * - 値入力（必須、記録タイプに応じて変化）
 * - 日付（必須、デフォルトは今日）
 * - メモ（任意、500文字以内）
 */
export function RecordForm({ onSuccess, onCancel, initialActivityId }: RecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    formData,
    errors,
    updateActivityId,
    updateValue,
    updateDate,
    updateNote,
    validate,
    resetForm,
  } = useRecordForm(initialActivityId);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション実行
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 成功コールバック実行（実際の送信処理は親コンポーネント側で実装）
      await onSuccess?.(formData);
      
      // フォームをリセット
      resetForm();
    } catch (error) {
      console.error('[RecordForm] Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="lg">
        {/* アクティビティ選択セクション */}
        <Box>
          <Text size="sm" fw={600} mb="md" style={{ color: '#4ECDC4' }}>
            アクティビティ
          </Text>
          <ActivitySelect
            value={formData.activityId}
            onChange={updateActivityId}
            error={errors.activityId}
          />
        </Box>

        <Divider color="#333" />

        {/* 値入力セクション */}
        <Box>
          <Text size="sm" fw={600} mb="md" style={{ color: '#4ECDC4' }}>
            記録内容
          </Text>
          <Stack gap="md">
            <ValueInput
              activityId={formData.activityId}
              value={formData.value}
              onChange={updateValue}
              error={errors.value}
            />
            
            <DateField
              value={formData.date}
              onChange={updateDate}
              error={errors.date}
            />
          </Stack>
        </Box>

        <Divider color="#333" />

        {/* メモセクション */}
        <Box>
          <Text size="sm" fw={600} mb="md" style={{ color: '#4ECDC4' }}>
            メモ
          </Text>
          <NoteField
            value={formData.note || ''}
            onChange={updateNote}
            error={errors.note}
          />
        </Box>

        {/* アクションボタン */}
        <FormActions
          isSubmitting={isSubmitting}
          submitText="記録を追加"
          onCancel={onCancel}
          disableSubmit={!formData.activityId}
        />
      </Stack>
    </form>
  );
}
