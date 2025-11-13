import { Box, Select, TextInput } from '@mantine/core';
import { colors } from '@/shared/config';
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
            backgroundColor: colors.form.background,
            borderColor: colors.form.border,
            color: colors.form.textDisabled,
          },
          label: {
            color: colors.form.placeholder,
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
          dropdown: {
            backgroundColor: colors.form.background,
            borderColor: colors.form.border,
          },
          option: {
            color: colors.form.text,
            '&[data-selected]': {
              backgroundColor: colors.action.primary,
            },
            '&:hover': {
              backgroundColor: colors.button.secondaryBackground,
            },
          },
        }}
      />
    </Box>
  );
}
