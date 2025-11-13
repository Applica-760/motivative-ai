import { Select, Text, Box } from '@mantine/core';
import { useState, useEffect, useMemo } from 'react';
import { useStorage } from '@/shared/services/storage';
import { TimerRepository } from '../api/repositories';
import type { ActivityDefinition } from '@/shared/types';

interface ActivitySelectorProps {
  /** 選択中のアクティビティID */
  selectedActivityId: string | null;
  /** アクティビティ選択時のハンドラ */
  onSelect: (activityId: string) => void;
}

/**
 * duration型のアクティビティを選択するセレクトボックス
 * 
 * 3層アーキテクチャに準拠し、TimerRepositoryを通してデータアクセス。
 * タイマーで記録するアクティビティを選択できる
 */
export function ActivitySelector({ selectedActivityId, onSelect }: ActivitySelectorProps) {
  const storage = useStorage();
  const repository = useMemo(() => new TimerRepository(storage), [storage]);
  
  const [activities, setActivities] = useState<ActivityDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Repositoryからduration型アクティビティを取得
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const durationActivities = await repository.getDurationActivities();
        setActivities(durationActivities);
      } catch (error) {
        console.error('[ActivitySelector] Failed to load activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivities();
  }, [repository]);

  // Selectコンポーネント用のデータ形式に変換
  const selectData = useMemo(() => {
    return activities.map((activity) => ({
      value: activity.id,
      label: `${activity.icon} ${activity.title}`,
    }));
  }, [activities]);

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

  if (activities.length === 0) {
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
