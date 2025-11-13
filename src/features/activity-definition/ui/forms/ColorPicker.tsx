import { Box, SimpleGrid, Text } from '@mantine/core';
import { colors } from '@/shared/config';
import { ACTIVITY_COLORS } from '../../config/formConstants';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * カラー選択コンポーネント
 */
export function ColorPicker({ value, onChange, error }: ColorPickerProps) {
  return (
    <Box>
      <Text
        size="sm"
        fw={500}
        mb="0.5rem"
        style={{ color: colors.form.placeholder }}
      >
        カラー <span style={{ color: colors.form.required }}>*</span>
      </Text>
      
      <SimpleGrid cols={6} spacing="xs" mb="xs">
        {ACTIVITY_COLORS.map((color) => (
          <Box
            key={color.value}
            onClick={() => onChange(color.value)}
            title={color.label}
            style={{
              width: '100%',
              aspectRatio: '1',
              backgroundColor: color.value,
              border: value === color.value ? `3px solid ${colors.form.text}` : `2px solid ${colors.form.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: value === color.value ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        ))}
      </SimpleGrid>
      
      {error && (
        <Text size="sm" c="red" mt="xs">
          {error}
        </Text>
      )}
    </Box>
  );
}
