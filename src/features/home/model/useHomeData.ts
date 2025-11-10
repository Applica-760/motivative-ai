import { useState, useEffect } from 'react';
import { ChartTypeEnum } from '@/shared/types';
import { useActivityContext } from '@/features/activity/model/ActivityContext';
import { convertActivityRecordsToChartData } from '@/features/activity/model/activityToChartAdapter';
import type { ActivityData } from '@/features/graph';
import type { HomeData } from './types';

/**
 * ホーム画面のデータを取得するカスタムフック
 * ActivityContextから実データを取得してグラフ表示用に変換
 * 
 * すべてのアクティビティを動的に処理し、記録があるものをグラフとして表示する
 */
export function useHomeData() {
  const { activities: activityDefinitions, records, isLoading: contextLoading } = useActivityContext();
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // コンテキストのロード待ち
        if (contextLoading) {
          return;
        }

        const activities: ActivityData[] = [];

        // 全てのアクティビティを動的に処理
        for (const activity of activityDefinitions) {
          // このアクティビティの記録を取得
          const activityRecords = records.filter(r => r.activityId === activity.id);
          
          // 記録があるアクティビティのみグラフに追加
          if (activityRecords.length > 0) {
            const chartData = convertActivityRecordsToChartData(activityRecords);
            
            activities.push({
              activityId: activity.id,
              type: activity.id, // typeとしてIDを使用
              title: `${activity.icon} ${activity.title}`,
              dataLabel: `${activity.title} (${activity.unit || ''})`,
              color: activity.color || '#4ECDC4', // デフォルトカラー
              data: chartData,
              // デフォルトでBARチャートを使用
              chartType: ChartTypeEnum.BAR,
            });
          }
        }

        setData({ activities });
        setError(null);
      } catch (err) {
        console.error('[useHomeData] Error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activityDefinitions, records, contextLoading]);

  return { data, isLoading, error };
}
