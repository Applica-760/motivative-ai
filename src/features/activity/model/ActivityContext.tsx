import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { useStorage } from '@/shared/services/storage';
import { ActivityRepositoryImpl } from '../api/repositories/ActivityRepositoryImpl';
import { RecordRepositoryImpl } from '../api/repositories/RecordRepositoryImpl';
import { mockActivityDefinitions } from '../model/mockActivityDefinitions';
import { mockActivityRecords } from '../model/mockActivityRecords';

interface ActivityContextValue {
  activities: ActivityDefinition[];
  records: ActivityRecord[];
  isLoading: boolean;
  addActivity: (activity: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<void>;
  updateActivity: (id: string, updates: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  addRecord: (record: Omit<ActivityRecord, 'id' | 'createdAt' | 'updatedAt' | 'timestamp'>) => Promise<void>;
  refreshActivities: () => void;
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

  // 初期データの読み込み
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const [storedActivities, storedRecords] = await Promise.all([
          activityRepository.getAll(),
          recordRepository.getAll(),
        ]);
        
        // データが存在しない場合は初期モックデータを使用
        if (storedActivities.length === 0) {
          await storage.saveActivities(mockActivityDefinitions);
          setActivities(mockActivityDefinitions);
        } else {
          setActivities(storedActivities);
        }

        if (storedRecords.length === 0) {
          await storage.saveRecords(mockActivityRecords);
          setRecords(mockActivityRecords);
        } else {
          setRecords(storedRecords);
        }
      } catch (error) {
        console.error('[ActivityContext] Failed to load data:', error);
        setActivities(mockActivityDefinitions);
        setRecords(mockActivityRecords);
      } finally {
        setIsLoading(false);
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

  return (
    <ActivityContext.Provider
      value={{
        activities,
        records,
        isLoading,
        addActivity,
        updateActivity,
        addRecord,
        refreshActivities,
      }}
    >
      {children}
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
