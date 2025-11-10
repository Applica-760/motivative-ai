/**
 * Form Alert Component
 * Feature-Sliced Design: features/auth/ui/components
 * 
 * フォームエラー表示用の共通Alertコンポーネント
 */

import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import type { AuthError } from '../../model/types';

/**
 * FormAlertのProps
 */
export interface FormAlertProps {
  /** AuthContextからのエラー */
  error?: AuthError | null;
  /** クライアントサイドバリデーションエラー */
  validationError?: string | null;
  /** 閉じるボタンクリック時のコールバック */
  onClose: () => void;
}

/**
 * FormAlert
 * 
 * ログイン/サインアップフォームで使用するエラー表示コンポーネント
 * 
 * @example
 * ```tsx
 * <FormAlert
 *   error={authError}
 *   validationError={validationError}
 *   onClose={handleClearError}
 * />
 * ```
 */
export function FormAlert({ error, validationError, onClose }: FormAlertProps) {
  // エラーがない場合は何も表示しない
  if (!error && !validationError) {
    return null;
  }
  
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="エラー"
      color="red"
      onClose={onClose}
      withCloseButton
    >
      {validationError || error?.message}
    </Alert>
  );
}
