import { Box, Radio, Stack, Text } from '@mantine/core';
import { VALUE_TYPE_OPTIONS } from '../../config/formConstants';
import type { ActivityValueType } from '@/shared/types';

interface ValueTypeSelectProps {
  value: ActivityValueType;
  onChange: (value: ActivityValueType) => void;
  error?: string;
}

/**
 * 記録タイプ選択コンポーネント
 */
export function ValueTypeSelect({ value, onChange, error }: ValueTypeSelectProps) {
  return (
    <Box>
      <Text
        size="sm"
        fw={500}
        mb="0.5rem"
        style={{ color: '#ccc' }}
      >
        記録タイプ <span style={{ color: '#fa5252' }}>*</span>
      </Text>
      
      <Radio.Group
        value={value}
        onChange={(val) => onChange(val as ActivityValueType)}
      >
        <Stack gap="sm">
          {VALUE_TYPE_OPTIONS.map((option) => (
            <Box
              key={option.value}
              p="md"
              style={{
                backgroundColor: value === option.value ? '#2a2a2a' : '#1a1a1a',
                border: `2px solid ${value === option.value ? '#4ECDC4' : '#333'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => onChange(option.value)}
            >
              <Radio
                value={option.value}
                label={
                  <Box>
                    <Text fw={500} size="sm" style={{ color: '#fff' }}>
                      {option.icon} {option.label}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      {option.description}
                    </Text>
                  </Box>
                }
                styles={{
                  radio: {
                    backgroundColor: '#2a2a2a',
                    borderColor: '#444',
                    '&:checked': {
                      backgroundColor: '#4ECDC4',
                      borderColor: '#4ECDC4',
                    },
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </Radio.Group>
      
      {error && (
        <Text size="sm" c="red" mt="xs">
          {error}
        </Text>
      )}
    </Box>
  );
}
