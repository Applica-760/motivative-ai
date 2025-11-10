import { useState, useCallback } from 'react';

/**
 * フォームフィールド値とエラー状態を管理する共通フック
 * 
 * @param initialValue - 初期値
 * @returns フィールド値、エラー、更新関数
 */
export function useFormField<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | undefined>(undefined);

  /**
   * 値を更新してエラーをクリア
   */
  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    if (error) {
      setError(undefined);
    }
  }, [error]);

  /**
   * エラーを設定
   */
  const setFieldError = useCallback((errorMessage: string | undefined) => {
    setError(errorMessage);
  }, []);

  /**
   * 値とエラーをリセット
   */
  const reset = useCallback(() => {
    setValue(initialValue);
    setError(undefined);
  }, [initialValue]);

  return {
    value,
    error,
    updateValue,
    setFieldError,
    reset,
  };
}
