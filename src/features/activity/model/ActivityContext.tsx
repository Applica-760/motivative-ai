import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { useStorage } from '@/shared/services/storage';
import { ActivityRepositoryImpl } from '@/features/activity-definition/api/repositories';
import { RecordRepositoryImpl } from '@/features/activity-record/api/repositories';
import { defaultActivities } from '@/features/activity-definition/config';
import { defaultRecords } from '@/features/activity-record/config';

interface ActivityContextValue {
  activities: ActivityDefinition[];
  records: ActivityRecord[];
  isLoading: boolean;
  addActivity: (activity: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<void>;
  updateActivity: (id: string, updates: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  deleteActivity: (id: string) => Promise<void>;
  reorderActivities: (activityIds: string[]) => Promise<void>;
  addRecord: (record: Omit<ActivityRecord, 'id' | 'createdAt' | 'updatedAt' | 'timestamp'>) => Promise<void>;
  refreshActivities: () => void;
  getRecordsByActivityId: (activityId: string) => ActivityRecord[];
}

const ActivityContext = createContext<ActivityContextValue | undefined>(undefined);

/**
 * アクティビティのグローバル状態を管理するProvider
 * 
 * Repository層を通してデータアクセスを行い、3層アーキテクチャを実現。
 * ログイン状態に応じてLocalStorage/Firebaseが自動切り替えされる。
 */
export function ActivityProvider({ children }: { children: ReactNode }) {
  const storage = useStorage();
  
  // Repository層のインスタンスを生成（storageが変更されたら再生成）
  const activityRepository = useMemo(
    () => new ActivityRepositoryImpl(storage),
    [storage]
  );
  const recordRepository = useMemo(
    () => new RecordRepositoryImpl(storage),
    [storage]
  );
  
  const [activities, setActivities] = useState<ActivityDefinition[]>([]);
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期データの読み込み
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setIsInitialized(false);
        
        const [storedActivities, storedRecords] = await Promise.all([
          activityRepository.getAll(),
          recordRepository.getAll(),
        ]);
        
        // データが存在しない場合は初期サンプルデータを使用
        if (storedActivities.length === 0) {
          await storage.saveActivities(defaultActivities);
          setActivities(defaultActivities);
        } else {
          setActivities(storedActivities);
        }

        if (storedRecords.length === 0) {
          await storage.saveRecords(defaultRecords);
          setRecords(defaultRecords);
        } else {
          setRecords(storedRecords);
        }
      } catch (error) {
        console.error('[ActivityContext] Failed to load data:', error);
        setActivities(defaultActivities);
        setRecords(defaultRecords);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadData();
  }, [activityRepository, recordRepository, storage]);

  // アクティビティを追加
  const addActivity = useCallback(async (
    activityData: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ) => {
    try {
      const savedActivity = await activityRepository.create(activityData);
      setActivities(prev => [...prev, savedActivity]);
    } catch (error) {
      console.error('[ActivityContext] Failed to add activity:', error);
      throw error;
    }
  }, [activityRepository]);

  // アクティビティを更新
  const updateActivity = useCallback(async (
    id: string,
    updates: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ) => {
    try {
      const updatedActivity = await activityRepository.update(id, updates);
      setActivities(prev => 
        prev.map(activity => activity.id === id ? updatedActivity : activity)
      );
    } catch (error) {
      console.error('[ActivityContext] Failed to update activity:', error);
      throw error;
    }
  }, [activityRepository]);

  // アクティビティを削除（関連レコードも削除）
  const deleteActivity = useCallback(async (id: string) => {
    try {
      // 関連レコードを取得
      const relatedRecords = records.filter(record => record.activityId === id);
      
      // 関連レコードを削除
      await Promise.all(
        relatedRecords.map(record => recordRepository.delete(record.id))
      );
      
      // アクティビティを削除
      await activityRepository.delete(id);
      
      // 状態を更新
      setActivities(prev => prev.filter(activity => activity.id !== id));
      setRecords(prev => prev.filter(record => record.activityId !== id));
      
      console.log('[ActivityContext] Deleted activity and related records:', {
        activityId: id,
        deletedRecordsCount: relatedRecords.length,
      });
    } catch (error) {
      console.error('[ActivityContext] Failed to delete activity:', error);
      throw error;
    }
  }, [activityRepository, recordRepository, records]);

  // アクティビティの並び順を変更
  const reorderActivities = useCallback(async (activityIds: string[]) => {
    try {
      // 新しい順序でorderプロパティを更新
      const updatedActivities = activities.map(activity => {
        const newOrder = activityIds.indexOf(activity.id);
        if (newOrder === -1) return activity; // IDが見つからない場合は変更しない
        
        return {
          ...activity,
          order: newOrder,
          updatedAt: new Date(),
        };
      });

      // 各アクティビティを更新
      await Promise.all(
        updatedActivities.map(activity => 
          activityRepository.update(activity.id, activity)
        )
      );

      // 状態を更新（order順にソート）
      setActivities(updatedActivities.sort((a, b) => a.order - b.order));
      
      console.log('[ActivityContext] Reordered activities:', activityIds);
    } catch (error) {
      console.error('[ActivityContext] Failed to reorder activities:', error);
      throw error;
    }
  }, [activities, activityRepository]);

  // 記録を追加
  const addRecord = useCallback(async (
    recordData: Omit<ActivityRecord, 'id' | 'createdAt' | 'updatedAt' | 'timestamp'>
  ) => {
    try {
      const savedRecord = await recordRepository.create(recordData);
      setRecords(prev => [...prev, savedRecord]);
    } catch (error) {
      console.error('[ActivityContext] Failed to add record:', error);
      throw error;
    }
  }, [recordRepository]);

  // アクティビティを再読み込み
  const refreshActivities = useCallback(async () => {
    try {
      const [storedActivities, storedRecords] = await Promise.all([
        activityRepository.getAll(),
        recordRepository.getAll(),
      ]);
      setActivities(storedActivities);
      setRecords(storedRecords);
    } catch (error) {
      console.error('[ActivityContext] Failed to refresh:', error);
      throw error;
    }
  }, [activityRepository, recordRepository]);
  
  // 特定のアクティビティに紐づく記録を取得
  const getRecordsByActivityId = useCallback((activityId: string): ActivityRecord[] => {
    return records.filter(record => record.activityId === activityId);
  }, [records]);

  const value = useMemo(() => ({
    activities,
    records,
    isLoading,
    addActivity,
    updateActivity,
    deleteActivity,
    reorderActivities,
    addRecord,
    refreshActivities,
    getRecordsByActivityId,
  }), [
    activities,
    records,
    isLoading,
    addActivity,
    updateActivity,
    deleteActivity,
    reorderActivities,
    addRecord,
    refreshActivities,
    getRecordsByActivityId,
  ]);

  return (
    <ActivityContext.Provider value={value}>
      {/* 初期化が完了するまで子コンポーネントを表示しない */}
      {/* これにより、データが確実に読み込まれた後に画面が表示される */}
      {isInitialized ? children : null}
    </ActivityContext.Provider>
  );
}

/**
 * アクティビティコンテキストを使用するフック
 */
export function useActivityContext() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivityContext must be used within ActivityProvider');
  }
  return context;
}
