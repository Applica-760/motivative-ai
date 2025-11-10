/**
 * Form Switch Link Component
 * Feature-Sliced Design: features/auth/ui/components
 * 
 * ログイン/サインアップフォーム切り替え用リンク
 */

import { Text } from '@mantine/core';

/**
 * FormSwitchLinkのProps
 */
export interface FormSwitchLinkProps {
  /** リンク前のテキスト */
  text: string;
  /** リンクテキスト */
  linkText: string;
  /** リンククリック時のコールバック */
  onClick: () => void;
  /** 無効化フラグ */
  disabled?: boolean;
}

/**
 * FormSwitchLink
 * 
 * ログイン/サインアップフォームを切り替えるためのリンクコンポーネント
 * 
 * @example
 * ```tsx
 * <FormSwitchLink
 *   text="アカウントをお持ちでない方は"
 *   linkText="新規登録"
 *   onClick={() => setView('signup')}
 *   disabled={isLoading}
 * />
 * ```
 */
export function FormSwitchLink({
  text,
  linkText,
  onClick,
  disabled = false,
}: FormSwitchLinkProps) {
  return (
    <Text size="sm" ta="center">
      {text}{' '}
      <Text
        component="button"
        type="button"
        c="blue"
        style={{
          textDecoration: 'underline',
          cursor: disabled ? 'default' : 'pointer',
          border: 'none',
          background: 'none',
          opacity: disabled ? 0.6 : 1,
        }}
        onClick={onClick}
        disabled={disabled}
      >
        {linkText}
      </Text>
    </Text>
  );
}
