import { Button, Text, Group, ActionIcon } from '@mantine/core';
import { IconMenu2, IconChevronRight } from '@tabler/icons-react';
import { colors } from '@/shared/config';

interface ActivityButtonProps {
  icon: string;
  label: string;
  color?: string;
  onClick?: () => void;
}

export function ActivityButton({ icon, label, color = 'gray', onClick }: ActivityButtonProps) {
  return (
    <Button
      variant="light"
      fullWidth
      radius="md"
      size="lg"
      color={color}
      onClick={onClick}
      style={{
        boxShadow: `0 2px 8px ${colors.shadow.light}`,
        transition: 'all 0.2s ease',
      }}
      styles={{
        inner: {
          justifyContent: 'space-between',
        },
        label: {
          width: '100%',
        },
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 16px ${colors.shadow.medium}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow.light}`;
      }}
    >
      <Group justify="space-between" style={{ width: '100%' }} wrap="nowrap">
        <Group gap="sm" wrap="nowrap">
          <Text size="xl">{icon}</Text>
          <Text size="md" fw={500}>
            {label}
          </Text>
        </Group>
        <Group gap={4} wrap="nowrap" style={{ marginRight: -8 }}>
          <ActionIcon variant="transparent" size="sm" color="gray">
            <IconMenu2 size={18} />
          </ActionIcon>
          <ActionIcon variant="transparent" size="sm" color="gray">
            <IconChevronRight size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </Button>
  );
}
