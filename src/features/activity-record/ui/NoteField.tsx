import { Textarea } from '@mantine/core';

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
          backgroundColor: '#2a2a2a',
          borderColor: '#444',
          color: '#fff',
          '&:focus': {
            borderColor: '#4ECDC4',
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
