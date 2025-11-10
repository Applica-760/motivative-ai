import { useState, useCallback } from 'react';
import type { ActivityFormData, ActivityFormErrors } from '../model/formTypes';
import { validateActivityForm } from '../model/validation';
import { DEFAULT_FORM_VALUES } from '../config/formConstants';

/**
 * アクティビティ作成フォームのカスタムフック
 * 
 * フォームの状態管理とバリデーションを提供。
 * 実際の送信処理はコンポーネント側で実装する。
 * 
 * @param initialData - 編集モード時の初期値（省略時は新規作成モード）
 */
export function useActivityForm(
  initialData?: ActivityFormData
) {
  // フォームデータの状態（初期値がある場合はそれを使用）
  const [formData, setFormData] = useState<ActivityFormData>(
    initialData || DEFAULT_FORM_VALUES
  );
  
  // バリデーションエラーの状態
  const [errors, setErrors] = useState<ActivityFormErrors>({});

  /**
   * フォームフィールドの値を更新（エラー自動クリア）
   */
  const updateField = useCallback(<K extends keyof ActivityFormData>(
    field: K,
    value: ActivityFormData[K]
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
   * フォームをリセット
   */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_VALUES);
    setErrors({});
  }, []);

  /**
   * フォームをバリデーション
   */
  const validate = useCallback(() => {
    const validationErrors = validateActivityForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  return {
    formData,
    errors,
    updateField,
    resetForm,
    validate,
  };
}
