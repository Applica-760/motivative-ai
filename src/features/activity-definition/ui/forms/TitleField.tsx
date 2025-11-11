import { TextInput } from '@mantine/core';

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
      label="アクティビティ名"
      placeholder="例: ランニング、読書、筋トレ"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      error={error}
      required
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
