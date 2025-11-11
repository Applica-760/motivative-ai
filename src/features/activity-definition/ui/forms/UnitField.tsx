import { Box, Select, TextInput } from '@mantine/core';
import { NUMBER_UNIT_PRESETS } from '../../config/formConstants';

interface UnitFieldProps {
  value: string;
  onChange: (value: string) => void;
  valueType: string;
  error?: string;
}

/**
 * 単位入力フィールド
 * 
 * 数値型または期間型の場合に表示
 * プリセットから選択するか、カスタム単位を入力可能
 */
export function UnitField({ value, onChange, valueType, error }: UnitFieldProps) {
  // 数値型または期間型以外では表示しない
  if (valueType !== 'number' && valueType !== 'duration') {
    return null;
  }

  // 期間型の場合は固定で「分」
  if (valueType === 'duration') {
    return (
      <TextInput
        label="単位"
        value="分"
        disabled
        styles={{
          input: {
            backgroundColor: '#2a2a2a',
            borderColor: '#444',
            color: '#888',
          },
          label: {
            color: '#ccc',
            marginBottom: '0.5rem',
          },
        }}
      />
    );
  }

  // 数値型の場合はプリセット選択可能
  const selectData = [
    ...NUMBER_UNIT_PRESETS.map((unit) => ({ value: unit, label: unit })),
    { value, label: value }, // 現在の値も含める
  ].filter((item, index, self) => 
    index === self.findIndex((t) => t.value === item.value)
  );

  return (
    <Box>
      <Select
        label="単位"
        placeholder="単位を選択"
        value={value}
        onChange={(val) => val && onChange(val)}
        data={selectData}
        searchable
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
          dropdown: {
            backgroundColor: '#2a2a2a',
            borderColor: '#444',
          },
          option: {
            color: '#fff',
            '&[data-selected]': {
              backgroundColor: '#4ECDC4',
            },
            '&:hover': {
              backgroundColor: '#333',
            },
          },
        }}
      />
    </Box>
  );
}
