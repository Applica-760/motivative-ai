import { useState, useCallback } from 'react';
import { useActivityContext } from '@/features/activity';
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

const SELECTED_ACTIVITY_KEY = 'timer-selected-activity';

/**
 * タイマーから記録を素早く保存するためのフック
 * 
 * 機能:
 * - duration型アクティビティの選択状態を管理
 * - ActivityContextを通じて記録を保存
 * - 選択状態をlocalStorageに永続化
 */
export function useQuickRecord(): UseQuickRecordReturn {
  const { addRecord } = useActivityContext();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(() => {
    return localStorage.getItem(SELECTED_ACTIVITY_KEY);
  });
  const [isSaving, setIsSaving] = useState(false);

  // アクティビティを選択
  const selectActivity = useCallback((activityId: string) => {
    setSelectedActivityId(activityId);
    localStorage.setItem(SELECTED_ACTIVITY_KEY, activityId);
  }, []);

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
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

        await addRecord({
          activityId: selectedActivityId,
          value: {
            type: 'duration',
            value: minutes,
            unit: 'minutes',
          },
          date: dateStr,
          note: 'タイマーから記録',
        });

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
    [selectedActivityId, addRecord]
  );

  return {
    selectedActivityId,
    selectActivity,
    isSaving,
    saveRecord,
  };
}
