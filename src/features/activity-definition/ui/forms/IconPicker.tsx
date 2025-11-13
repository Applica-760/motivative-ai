import { Box, SimpleGrid, Text } from '@mantine/core';
import { colors } from '@/shared/config';
import { ACTIVITY_ICONS } from '../../config/formConstants';

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * アイコン選択コンポーネント
 */
export function IconPicker({ value, onChange, error }: IconPickerProps) {
  return (
    <Box>
      <Text
        size="sm"
        fw={500}
        mb="0.5rem"
        style={{ color: colors.form.placeholder }}
      >
        アイコン <span style={{ color: colors.form.required }}>*</span>
      </Text>
      
      <SimpleGrid cols={6} spacing="xs" mb="xs">
        {ACTIVITY_ICONS.map((icon) => (
          <Box
            key={icon}
            onClick={() => onChange(icon)}
            style={{
              width: '100%',
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              backgroundColor: value === icon ? colors.action.primary : colors.form.background,
              border: `2px solid ${value === icon ? colors.action.primary : colors.form.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: value === icon ? colors.action.primary : colors.button.secondaryBackground,
                transform: 'scale(1.05)',
              },
            }}
          >
            {icon}
          </Box>
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
