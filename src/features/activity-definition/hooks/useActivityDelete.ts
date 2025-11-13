import { useState, useCallback } from 'react';
import { useActivityContext } from '@/features/activity/model/ActivityContext';
import type { ActivityDefinition } from '@/shared/types';

/**
 * アクティビティ削除のためのフック
 * 
 * 削除確認ダイアログの状態管理と削除処理を提供。
 * 関連レコード数の取得や削除後のコールバックもサポート。
 * 
 * @example
 * ```tsx
 * const { 
 *   isDeleting, 
 *   relatedRecordsCount, 
 *   handleDelete 
 * } = useActivityDelete(activity.id);
 * ```
 */
export function useActivityDelete(activity: ActivityDefinition) {
  const { deleteActivity, getRecordsByActivityId } = useActivityContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 関連レコード数を取得
  const relatedRecordsCount = getRecordsByActivityId(activity.id).length;

  /**
   * アクティビティを削除
   * @param onSuccess - 削除成功時のコールバック
   */
  const handleDelete = useCallback(async (onSuccess?: () => void) => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await deleteActivity(activity.id);
      
      console.log('[useActivityDelete] Successfully deleted activity:', {
        id: activity.id,
        title: activity.title,
        deletedRecordsCount: relatedRecordsCount,
      });
      
      // 成功時のコールバックを実行
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete activity');
      setError(error);
      console.error('[useActivityDelete] Failed to delete activity:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [activity.id, activity.title, deleteActivity, relatedRecordsCount]);

  return {
    /** 削除処理中かどうか */
    isDeleting,
    /** 削除エラー */
    error,
    /** 関連レコード数 */
    relatedRecordsCount,
    /** 削除実行関数 */
    handleDelete,
  };
}
