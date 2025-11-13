import { Textarea } from '@mantine/core';
import { colors } from '@/shared/config';

interface NoteFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * メモ入力フィールド
 */
export function NoteField({ value, onChange, error }: NoteFieldProps) {
  return (
    <Textarea
      label="メモ（任意）"
      placeholder="メモや感想を入力（500文字以内）"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      error={error}
      minRows={3}
      maxRows={6}
      maxLength={500}
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
          marginBottom: '0.5rem',
        },
      }}
    />
  );
}
