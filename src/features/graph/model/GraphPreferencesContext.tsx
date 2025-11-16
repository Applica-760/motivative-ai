import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useStorage } from '@/shared/services/storage';
import type { ChartType } from '@/shared/types';
import { ChartTypeEnum } from '@/shared/types';

interface GraphPreferencesContextValue {
  getChartType: (activityId: string) => ChartType;
  setChartType: (activityId: string, type: ChartType) => void;
}

const GraphPreferencesContext = createContext<GraphPreferencesContextValue | undefined>(undefined);

const STORAGE_KEY = 'graph.chartTypeMap.v1';

export function GraphPreferencesProvider({ children }: { children: ReactNode }) {
  const storage = useStorage();
  const [chartTypeMap, setChartTypeMap] = useState<Record<string, ChartType>>({});

  // 初期読み込み
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await storage.getCustomData(STORAGE_KEY);
        if (!mounted) return;
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, ChartType>;
          setChartTypeMap(parsed);
        }
      } catch (e) {
        console.warn('[GraphPreferences] Failed to load chartTypeMap');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [storage]);

  const getChartType = useCallback((activityId: string): ChartType => {
    return chartTypeMap[activityId] ?? ChartTypeEnum.BAR;
  }, [chartTypeMap]);

  const setChartType = useCallback((activityId: string, type: ChartType) => {
    setChartTypeMap((prev) => {
      const next = { ...prev, [activityId]: type };
      // ベストエフォートの保存（失敗してもUIは即時反映）
      storage.setCustomData(STORAGE_KEY, JSON.stringify(next)).catch(() => {
        /* noop */
      });
      return next;
    });
  }, [storage]);

  const value = useMemo(() => ({ getChartType, setChartType }), [getChartType, setChartType]);

  return (
    <GraphPreferencesContext.Provider value={value}>
      {children}
    </GraphPreferencesContext.Provider>
  );
}

export function useGraphPreferences() {
  const ctx = useContext(GraphPreferencesContext);
  if (!ctx) throw new Error('useGraphPreferences must be used within GraphPreferencesProvider');
  return ctx;
}
