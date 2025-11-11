import { useActivityContext } from '@/features/activity/model/ActivityContext';
import { useMemo } from 'react';
import type { ActivityDefinition } from '@/shared/types';

/**
 * アクティビティ一覧を取得するフック
 * 
 * ActivityContextから必要なデータを取り出す薄いラッパー。
 * record feature内でのアクティビティ一覧表示に使用。
 */
export function useActivities() {
  const { activities, isLoading } = useActivityContext();
  
  return {
    activities,
    isLoading,
  };
}

/**
 * 指定したIDのアクティビティを取得するフック
 * 
 * 記録フォームでアクティビティの詳細情報（valueType等）を
 * 取得する際に使用。
 */
export function useActivity(activityId: string | null): {
  activity: ActivityDefinition | null;
  isLoading: boolean;
} {
  const { activities, isLoading } = useActivityContext();
  
  const activity = useMemo(() => {
    if (!activityId) return null;
    return activities.find(a => a.id === activityId) || null;
  }, [activities, activityId]);
  
  return {
    activity,
    isLoading,
  };
}
