import { Paper, Stack, Text, Loader, Box } from '@mantine/core';
import { useState } from 'react';
import { ActivityButton } from '@/shared/ui';
import { useActivities } from '@/features/activity/hooks';
import { EditActivityModal } from '@/features/activity-definition/ui/modals';
import { AuthUserButton } from '@/features/auth';
import type { ActivityDefinition } from '@/shared/types';

export function LeftSidebar() {
  const { activities, isLoading } = useActivities();
  const [editingActivity, setEditingActivity] = useState<ActivityDefinition | null>(null);

  const handleActivityClick = (activity: ActivityDefinition) => {
    setEditingActivity(activity);
  };

  const handleCloseEditModal = () => {
    setEditingActivity(null);
  };

  return (
    <aside style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper p="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Text size="lg" fw={600} c="dimmed" mb="md">
          アクティビティ一覧
        </Text>
        
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap="md">
            {isLoading ? (
              <Box style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Loader size="md" color="teal" />
              </Box>
            ) : activities.length === 0 ? (
              <Box
                p="md"
                style={{
                  backgroundColor: '#2a2a2a',
                  borderRadius: '8px',
                  border: '1px dashed #444',
                  textAlign: 'center',
                }}
              >
                <Text size="sm" c="dimmed">
                  アクティビティが登録されていません
                </Text>
                <Text size="xs" c="dimmed" mt="xs">
                  「新しいアクティビティ」から作成してください
                </Text>
              </Box>
            ) : (
              activities.map((activity) => (
                <ActivityButton
                  key={activity.id}
                  icon={activity.icon}
                  label={activity.title}
                  color={activity.color}
                  onClick={() => handleActivityClick(activity)}
                />
              ))
            )}
          </Stack>
        </Box>
        
        {/* ユーザー認証ボタン */}
        <Box mt="md" pt="md" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <AuthUserButton />
        </Box>
      </Paper>

      {/* 編集モーダル */}
      {editingActivity && (
        <EditActivityModal
          opened={!!editingActivity}
          onClose={handleCloseEditModal}
          activity={editingActivity}
        />
      )}
    </aside>
  );
}
