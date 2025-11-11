import { Box, SimpleGrid, Text } from '@mantine/core';
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
        style={{ color: '#ccc' }}
      >
        アイコン <span style={{ color: '#fa5252' }}>*</span>
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
              backgroundColor: value === icon ? '#4ECDC4' : '#2a2a2a',
              border: `2px solid ${value === icon ? '#4ECDC4' : '#444'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: value === icon ? '#4ECDC4' : '#333',
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
