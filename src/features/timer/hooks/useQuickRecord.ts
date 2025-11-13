import { useState, useCallback, useEffect, useMemo } from 'react';
import { useStorage } from '@/shared/services/storage';
import { TimerRepository } from '../api/repositories';
import { secondsToMinutes } from '../model/timerUtils';
import { notifications } from '@mantine/notifications';

export interface UseQuickRecordReturn {
  /** 選択中のアクティビティID */
  selectedActivityId: string | null;
  /** アクティビティを選択 */
  selectActivity: (activityId: string) => void;
  /** 記録を保存中かどうか */
  isSaving: boolean;
  /** 記録を保存（成功時はtrue、失敗時はfalseを返す） */
  saveRecord: (seconds: number) => Promise<boolean>;
}

/**
 * タイマーから記録を素早く保存するためのフック
 * 
 * 3層アーキテクチャに準拠し、TimerRepositoryを通してデータアクセス。
 * 
 * 機能:
 * - duration型アクティビティの選択状態を管理
 * - TimerRepositoryを通じて記録を保存
 * - StorageService経由で選択状態を永続化（ログイン状態に応じてLocalStorage/Firebase自動切替）
 */
export function useQuickRecord(): UseQuickRecordReturn {
  const storage = useStorage();
  const repository = useMemo(() => new TimerRepository(storage), [storage]);
  
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 初回マウント時にRepositoryから復元
  useEffect(() => {
    const loadSelected = async () => {
      try {
        const id = await repository.loadSelectedActivity();
        setSelectedActivityId(id);
      } catch (error) {
        console.error('[useQuickRecord] Failed to load selected activity:', error);
      }
    };
    
    loadSelected();
  }, [repository]);

  // アクティビティを選択
  const selectActivity = useCallback(async (activityId: string) => {
    setSelectedActivityId(activityId);
    await repository.saveSelectedActivity(activityId);
  }, [repository]);

  // 記録を保存
  const saveRecord = useCallback(
    async (seconds: number): Promise<boolean> => {
      if (!selectedActivityId) {
        notifications.show({
          title: 'エラー',
          message: 'アクティビティを選択してください',
          color: 'red',
        });
        return false;
      }

      if (seconds < 60) {
        notifications.show({
          title: 'エラー',
          message: '1分以上の時間を記録してください',
          color: 'red',
        });
        return false;
      }

      try {
        setIsSaving(true);
        
        const minutes = secondsToMinutes(seconds);
        await repository.addRecord(selectedActivityId, seconds, 'タイマーから記録');

        notifications.show({
          title: '記録完了',
          message: `${minutes}分を記録しました`,
          color: 'green',
        });
        
        return true;
      } catch (error) {
        console.error('[useQuickRecord] Failed to save record:', error);
        notifications.show({
          title: 'エラー',
          message: '記録の保存に失敗しました',
          color: 'red',
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [selectedActivityId, repository]
  );

  return {
    selectedActivityId,
    selectActivity,
    isSaving,
    saveRecord,
  };
}
