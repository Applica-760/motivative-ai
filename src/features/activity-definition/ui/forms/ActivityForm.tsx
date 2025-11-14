import { Box, Stack, Text, Divider } from '@mantine/core';
import { useState } from 'react';
import { colors } from '@/shared/config';
import { useActivityForm } from '../../hooks/useActivityForm';
import { TitleField } from './TitleField';
import { IconPicker } from './IconPicker';
import { ValueTypeSelect } from './ValueTypeSelect';
import { UnitField } from './UnitField';
import { ColorPicker } from './ColorPicker';
import { FormActions } from '@/shared/ui';
import type { ActivityFormData } from '../../model/formTypes';

interface ActivityFormProps {
  /** フォーム送信成功時のコールバック */
  onSuccess?: (data: ActivityFormData) => void;
  /** キャンセル時のコールバック */
  onCancel?: () => void;
  /** 編集モード時の初期値 */
  initialData?: ActivityFormData;
  /** 送信ボタンのテキスト（デフォルト: "作成する"） */
  submitButtonText?: string;
}

/**
 * アクティビティ作成フォーム
 * 
 * アクティビティの新規作成に必要な情報を入力するフォーム。
 * 各フィールドは独立したコンポーネントとして実装され、
 * useActivityFormフックで統合的に管理される。
 * 
 * フィールド:
 * - アクティビティ名（必須）
 * - アイコン（必須）
 * - 記録タイプ（必須）
 * - 単位（数値型・期間型の場合のみ必須）
 * - カラー（必須）
 */
export function ActivityForm({ 
  onSuccess, 
  onCancel, 
  initialData,
  submitButtonText = '作成する'
}: ActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    formData,
    errors,
    updateField,
    validate,
    resetForm,
  } = useActivityForm(initialData);

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
      console.error('[ActivityForm] Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="lg">
        {/* 基本情報セクション */}
        <Box>
          <Text size="sm" fw={600} mb="md" style={{ color: colors.action.primary }}>
            基本情報
          </Text>
          <Stack gap="md">
            <TitleField
              value={formData.title}
              onChange={(value) => updateField('title', value)}
              error={errors.title}
            />
            
            <IconPicker
              value={formData.icon}
              onChange={(value) => updateField('icon', value)}
              error={errors.icon}
            />
          </Stack>
        </Box>

        <Divider color={colors.divider.default} />

        {/* 記録設定セクション */}
        <Box>
          <Text size="sm" fw={600} mb="md" style={{ color: colors.action.primary }}>
            記録設定
          </Text>
          <Stack gap="md">
            <ValueTypeSelect
              value={formData.valueType}
              onChange={(value) => updateField('valueType', value)}
              error={errors.valueType}
            />
            
            <UnitField
              value={formData.unit || ''}
              onChange={(value) => updateField('unit', value)}
              valueType={formData.valueType}
              error={errors.unit}
            />
          </Stack>
        </Box>

        <Divider color={colors.divider.default} />

        {/* デザイン設定セクション */}
        <Box>
          <Text size="sm" fw={600} mb="md" style={{ color: colors.action.primary }}>
            デザイン
          </Text>
          <ColorPicker
            value={formData.color}
            onChange={(value) => updateField('color', value)}
            error={errors.color}
          />
        </Box>

        {/* アクションボタン */}
        <FormActions
          isSubmitting={isSubmitting}
          submitText={submitButtonText}
          onCancel={onCancel}
        />
      </Stack>
    </form>
  );
}
