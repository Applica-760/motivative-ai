import { Button, Text, Group, Modal, Stack } from '@mantine/core';
import { useState } from 'react';
import { useActivityDelete } from '../../hooks';
import { colors } from '@/shared/config';
import type { ActivityDefinition } from '@/shared/types';

interface DeleteActivityButtonProps {
  /** 削除対象のアクティビティ */
  activity: ActivityDefinition;
  /** 削除成功時のコールバック */
  onSuccess?: () => void;
}

/**
 * アクティビティ削除ボタン
 * 
 * 確認モーダルを含む削除ボタン。
 * 関連レコード数を表示し、誤削除を防ぐ。
 * 
 * デザイン:
 * - 危険な操作として赤いボタンで表示
 * - フォーム末尾に区切り線と共に配置
 * - 確認モーダルで関連レコード数を表示
 * 
 * @example
 * ```tsx
 * <DeleteActivityButton
 *   activity={activity}
 *   onSuccess={() => navigate('/home')}
 * />
 * ```
 */
export function DeleteActivityButton({ activity, onSuccess }: DeleteActivityButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { isDeleting, relatedRecordsCount, handleDelete } = useActivityDelete(activity);

  const handleConfirmDelete = async () => {
    await handleDelete(() => {
      setIsConfirmOpen(false);
      onSuccess?.();
    });
  };

  return (
    <>
      {/* 区切り線 */}
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          margin: '2rem 0 1.5rem',
        }}
      />

      {/* 危険な操作セクション */}
      <Stack gap="sm">
        
        <Button
          fullWidth
          color="red"
          variant="light"
          onClick={() => setIsConfirmOpen(true)}
          disabled={isDeleting}
          leftSection={<span>🗑️</span>}
        >
          このアクティビティを削除
        </Button>
        
        <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
          削除すると、関連する記録も全て削除されます
        </Text>
      </Stack>

      {/* 確認モーダル */}
      <Modal
        opened={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="アクティビティを削除"
        centered
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          title: {
            fontSize: '1.25rem',
            fontWeight: 600,
          },
          content: {
            backgroundColor: colors.background.dark,
          },
          header: {
            backgroundColor: colors.background.dark,
          },
          body: {
            padding: '1.5rem',
          },
        }}
      >
        <Stack gap="lg">
          {/* 警告メッセージ */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(250, 82, 82, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(250, 82, 82, 0.3)',
            }}
          >
            <Text size="sm" c="red" fw={500}>
              この操作は取り消せません
            </Text>
          </div>

          {/* アクティビティ情報 */}
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              削除するアクティビティ:
            </Text>
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: colors.background.gridItemDark,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{activity.icon}</span>
              <Text size="md" fw={500}>
                {activity.title}
              </Text>
            </div>
          </Stack>

          {/* 関連レコード情報 */}
          {relatedRecordsCount > 0 && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
              }}
            >
              <Text size="sm" c="yellow">
                📊 関連する記録: {relatedRecordsCount}件
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                これらの記録も全て削除されます
              </Text>
            </div>
          )}

          {/* 確認ボタン */}
          <Group justify="flex-end" gap="md" mt="md">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              color="red"
              onClick={handleConfirmDelete}
              loading={isDeleting}
            >
              削除する
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
