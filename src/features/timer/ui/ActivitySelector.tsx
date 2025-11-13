import { Select, Text, Box } from '@mantine/core';
import { useActivityContext } from '@/features/activity';
import { useMemo } from 'react';

interface ActivitySelectorProps {
  /** 選択中のアクティビティID */
  selectedActivityId: string | null;
  /** アクティビティ選択時のハンドラ */
  onSelect: (activityId: string) => void;
}

/**
 * duration型のアクティビティを選択するセレクトボックス
 * 
 * タイマーで記録するアクティビティを選択できる
 */
export function ActivitySelector({ selectedActivityId, onSelect }: ActivitySelectorProps) {
  const { activities, isLoading } = useActivityContext();

  // duration型のアクティビティのみフィルタリング
  const durationActivities = useMemo(() => {
    return activities.filter(
      (activity) => activity.valueType === 'duration' && !activity.isArchived
    );
  }, [activities]);

  // Selectコンポーネント用のデータ形式に変換
  const selectData = useMemo(() => {
    return durationActivities.map((activity) => ({
      value: activity.id,
      label: `${activity.icon} ${activity.title}`,
    }));
  }, [durationActivities]);

  if (isLoading) {
    return (
      <Box>
        <Text size="sm" c="dimmed" mb="xs">
          記録先アクティビティ
        </Text>
        <Select
          placeholder="読み込み中..."
          data={[]}
          disabled
        />
      </Box>
    );
  }

  if (durationActivities.length === 0) {
    return (
      <Box>
        <Text size="sm" c="dimmed" mb="xs">
          記録先アクティビティ
        </Text>
        <Text size="sm" c="red">
          時間を記録できるアクティビティがありません
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text size="sm" c="dimmed" mb="xs">
        記録先アクティビティ
      </Text>
      <Select
        placeholder="アクティビティを選択"
        data={selectData}
        value={selectedActivityId}
        onChange={(value) => value && onSelect(value)}
        searchable
        clearable
      />
    </Box>
  );
}
