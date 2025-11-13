import { Paper, Stack, Text, Loader, Box } from '@mantine/core';
import { useState, useMemo } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { ActivityButton, SortableActivityButton, AboutModal } from '@/shared/ui';
import { useActivities } from '@/features/activity/hooks';
import { useActivityContext } from '@/features/activity/model/ActivityContext';
import { EditActivityModal, CreateActivityModal } from '@/features/activity-definition/ui/modals';
import { AuthUserButton } from '@/features/auth';
import { colors } from '@/shared/config';
import type { ActivityDefinition } from '@/shared/types';

export function LeftSidebar() {
  const { activities, isLoading } = useActivities();
  const { reorderActivities } = useActivityContext();
  const [editingActivity, setEditingActivity] = useState<ActivityDefinition | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  
  // 楽観的UI用のローカル状態
  const [localActivities, setLocalActivities] = useState<ActivityDefinition[]>([]);

  // アクティビティをorder順にソート
  const sortedActivities = useMemo(() => {
    const activitiesToSort = localActivities.length > 0 ? localActivities : activities;
    return [...activitiesToSort].sort((a, b) => a.order - b.order);
  }, [activities, localActivities]);

  // activitiesが変更されたらlocalActivitiesをリセット
  useMemo(() => {
    setLocalActivities([]);
  }, [activities]);

  // ドラッグ&ドロップ用のID配列
  const activityIds = useMemo(() => {
    return sortedActivities.map(activity => activity.id);
  }, [sortedActivities]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activityIds.indexOf(active.id as string);
      const newIndex = activityIds.indexOf(over.id as string);

      // 楽観的UIの更新（即座に順序を変更）
      const newOrder = arrayMove(activityIds, oldIndex, newIndex);
      const reorderedActivities = newOrder.map((id, index) => {
        const activity = sortedActivities.find(a => a.id === id)!;
        return {
          ...activity,
          order: index,
        };
      });
      
      setLocalActivities(reorderedActivities);
      
      // バックグラウンドで永続化（失敗時はリセット）
      reorderActivities(newOrder).catch(() => {
        setLocalActivities([]);
      });
    }
  };

  return (
    <aside style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper p="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Text size="lg" fw={600} c="dimmed" mb="md">
          アクティビティ一覧
        </Text>
        
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          {isLoading ? (
            <Box style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader size="md" color="teal" />
            </Box>
          ) : sortedActivities.length === 0 ? (
            <Box
              p="md"
              mt="xs"
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
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={activityIds}
                strategy={verticalListSortingStrategy}
              >
                <Stack 
                  gap="md" 
                  mt="xs"
                  style={{
                    // コンテナにもスムーズなアニメーションを適用
                    transition: 'all 0.2s ease',
                  }}
                >
                  {sortedActivities.map((activity) => (
                    <SortableActivityButton
                      key={activity.id}
                      activity={activity}
                      onClick={() => handleActivityClick(activity)}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          )}
          
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
        
        {/* アプリ情報とユーザー認証ボタン */}
        <Box mt="md" pt="md" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {/* MotivativeAIとは？テキスト */}
          <Text
            size="sm"
            c="dimmed"
            mb="md"
            style={{
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#fff',
              },
            }}
            onClick={() => setIsAboutModalOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '';
            }}
          >
            Motivative AIとは？
          </Text>
          
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

      {/* Motivative AIとは？モーダル */}
      <AboutModal
        opened={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </aside>
  );
}
