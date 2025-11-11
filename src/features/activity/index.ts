/**
 * Activity Feature (Facade)
 * 
 * このfeatureは、3つの分割されたfeatureを統合するFacadeとして機能します:
 * - activity-definition: アクティビティ定義管理
 * - activity-record: 記録管理
 * - activity-analytics: データ分析・可視化
 * 
 * 既存のコードとの互換性を保つため、統合されたAPIを提供します。
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

// Context (統合された状態管理)
export { ActivityProvider, useActivityContext } from './model/ActivityContext';

// 分割されたfeatureから再エクスポート
// Definition
export * from '@/features/activity-definition';

// Record
export * from '@/features/activity-record';

// Analytics
export * from '@/features/activity-analytics';

// Config (グリッドアイテム生成)
export { createActivityActionGridItems } from './config/gridConfig';
