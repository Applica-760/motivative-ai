import { useState, useEffect, useMemo } from 'react';
import { useStorage } from '@/shared/services/storage';
import { CalendarRepository } from '../api';
import type { ActivityRecord } from '@/shared/types';

/**
 * カレンダーのデータ取得を管理するカスタムフック
 * 
 * Repository層を通じてデータにアクセスし、
 * ローディング状態とエラー状態を管理する
 */
export function useCalendarData(activityId: string, year: number, month: number) {
  const storage = useStorage();
  const repository = useMemo(() => new CalendarRepository(storage), [storage]);

  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRecords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await repository.getMonthlyRecords(activityId, year, month);
        
        if (isMounted) {
          setRecords(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch records'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRecords();

    return () => {
      isMounted = false;
    };
  }, [repository, activityId, year, month]);

  return {
    records,
    isLoading,
    error,
  };
}
