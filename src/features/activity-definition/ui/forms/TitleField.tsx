import { TextInput } from '@mantine/core';
import { colors } from '@/shared/config';

interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * アクティビティ名入力フィールド
 */

export function TitleField({ value, onChange, error }: TitleFieldProps) {
  return (
    <TextInput
      label="タイトル"
      placeholder="例: 読書、運動、瞑想"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      required
      error={error}
      styles={{
        input: {
          backgroundColor: colors.form.background,
          borderColor: colors.form.border,
          color: colors.form.text,
          '&:focus': {
            borderColor: colors.form.borderFocus,
          },
        },
        label: {
          color: colors.form.placeholder,
        },
      }}
    />
  );
}
