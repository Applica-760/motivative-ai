import { useActivityContext } from '../model/ActivityContext';

/**
 * アクティビティ一覧を取得するカスタムフック
 * 
 * ActivityContextからグローバル状態を取得する
 * 
 * @returns アクティビティ一覧と読み込み状態
 */
export function useActivities() {
  const { activities, isLoading } = useActivityContext();
  
  // アーカイブされていないアクティビティのみを返す
  const activeActivities = activities.filter(
    (activity) => !activity.isArchived
  );

  return {
    activities: activeActivities,
    isLoading,
    error: null,
  };
}

/**
 * 特定のアクティビティを取得するカスタムフック
 * 
 * @param activityId - アクティビティID
 * @returns アクティビティ定義
 */
export function useActivity(activityId: string | undefined) {
  const { activities, isLoading } = useActivities();
  
  const activity = activityId
    ? activities.find((a) => a.id === activityId)
    : undefined;

  return {
    activity,
    isLoading,
  };
}
