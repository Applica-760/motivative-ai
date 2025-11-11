import { TextInput } from '@mantine/core';

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
          backgroundColor: '#2a2a2a',
          borderColor: '#444',
          color: '#fff',
          colorScheme: 'dark',
          '&:focus': {
            borderColor: '#4ECDC4',
          },
          '&::-webkit-calendar-picker-indicator': {
            filter: 'invert(1)',
            cursor: 'pointer',
          },
        },
        label: {
          color: '#ccc',
          marginBottom: '0.5rem',
        },
      }}
    />
  );
}
