/**
 * Activity Feature
 * アクティビティの定義・記録・管理機能
 */

// 型定義は shared から再エクスポート
export type {
  ActivityValueType,
  ActivityValue,
  ActivityDefinition,
  ActivityRecord,
  ActivityStatistics,
} from '@/shared/types';

export { ActivityValueTypeEnum } from '@/shared/types';

// UI Components
export * from './ui';

// Config
export * from './config';

// ユーティリティ関数
export * from './model/activityUtils';

// アダプター関数
export * from './model/activityToChartAdapter';

// Context (グローバル状態管理)
export { ActivityProvider, useActivityContext } from './model/ActivityContext';
