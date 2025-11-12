import { Paper, Stack, Text, Loader, Box } from '@mantine/core';
import { useState } from 'react';
import { ActivityButton } from '@/shared/ui';
import { useActivities } from '@/features/activity/hooks';
import { EditActivityModal, CreateActivityModal } from '@/features/activity-definition/ui/modals';
import { AuthUserButton } from '@/features/auth';
import { colors } from '@/shared/config';
import type { ActivityDefinition } from '@/shared/types';

export function LeftSidebar() {
  const { activities, isLoading } = useActivities();
  const [editingActivity, setEditingActivity] = useState<ActivityDefinition | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleActivityClick = (activity: ActivityDefinition) => {
    setEditingActivity(activity);
  };

  const handleCloseEditModal = () => {
    setEditingActivity(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <aside style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper p="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Text size="lg" fw={600} c="dimmed" mb="md">
          アクティビティ一覧
        </Text>
        
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          <Stack gap="md" mt="xs">
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
          
          {/* 新しいアクティビティボタン（特別なスタイル） */}
          {!isLoading && (
            <Box mt="md">
              <ActivityButton
                icon="＋"
                label=""
                color="teal"
                onClick={handleOpenCreateModal}
                backgroundColor={colors.background.gridItemDark}
                borderColor="white"
              />
            </Box>
          )}
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

      {/* 作成モーダル */}
      <CreateActivityModal
        opened={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </aside>
  );
}
