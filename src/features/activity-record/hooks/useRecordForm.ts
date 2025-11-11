import { useState, useCallback } from 'react';
import type { RecordFormData, RecordFormErrors } from '../model/recordFormTypes';
import { validateRecordForm } from '../model/recordValidation';
import { DEFAULT_RECORD_FORM_VALUES } from '../config/recordFormConstants';
import type { ActivityValue } from '@/shared/types';

/**
 * 記録追加フォームのカスタムフック
 * 
 * フォームの状態管理とバリデーションを提供。
 * 実際の送信処理はコンポーネント側で実装する。
 * 
 * @param initialActivityId - 初期選択されるアクティビティID（グラフクリックから開いた場合）
 */
export function useRecordForm(
  initialActivityId?: string
) {
  // フォームデータの状態（初期値がある場合はそれを使用）
  const [formData, setFormData] = useState<RecordFormData>(() => ({
    ...DEFAULT_RECORD_FORM_VALUES,
    activityId: initialActivityId || DEFAULT_RECORD_FORM_VALUES.activityId,
  }));
  
  // バリデーションエラーの状態
  const [errors, setErrors] = useState<RecordFormErrors>({});

  /**
   * フィールドを更新してエラーをクリア（共通処理）
   */
  const updateFieldWithErrorClear = useCallback(<K extends keyof RecordFormData>(
    field: K,
    value: RecordFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // フィールドを変更したらそのフィールドのエラーをクリア
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * アクティビティIDを更新
   */
  const updateActivityId = useCallback((activityId: string) => {
    updateFieldWithErrorClear('activityId', activityId);
  }, [updateFieldWithErrorClear]);

  /**
   * 値を更新
   */
  const updateValue = useCallback((value: ActivityValue) => {
    updateFieldWithErrorClear('value', value);
  }, [updateFieldWithErrorClear]);

  /**
   * 日付を更新
   */
  const updateDate = useCallback((date: string) => {
    updateFieldWithErrorClear('date', date);
  }, [updateFieldWithErrorClear]);

  /**
   * メモを更新
   */
  const updateNote = useCallback((note: string) => {
    updateFieldWithErrorClear('note', note);
  }, [updateFieldWithErrorClear]);

  /**
   * フォームをリセット
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_RECORD_FORM_VALUES);
    setErrors({});
  }, []);

  /**
   * フォームをバリデーション
   */
  const validate = useCallback(() => {
    const validationErrors = validateRecordForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  return {
    formData,
    errors,
    updateActivityId,
    updateValue,
    updateDate,
    updateNote,
    resetForm,
    validate,
  };
}
