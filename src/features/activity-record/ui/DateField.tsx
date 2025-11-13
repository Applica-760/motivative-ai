import { TextInput } from '@mantine/core';
import { colors } from '@/shared/config';

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * 日付入力フィールド
 */
export function DateField({ value, onChange, error }: DateFieldProps) {
  // 今日の日付を取得（最大値として使用）
  const today = new Date().toISOString().split('T')[0];

  return (
    <TextInput
      label="日付"
      type="date"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      max={today}
      required
      error={error}
      styles={{
        input: {
          backgroundColor: colors.form.background,
          borderColor: colors.form.border,
          color: colors.form.text,
          colorScheme: 'dark',
          '&:focus': {
            borderColor: colors.form.borderFocus,
          },
          '&::-webkit-calendar-picker-indicator': {
            filter: 'invert(1)',
            cursor: 'pointer',
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
