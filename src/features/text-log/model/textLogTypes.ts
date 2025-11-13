import type { ActivityDefinition, ActivityRecord } from '@/shared/types';

/**
 * テキストログの表示用データ構造
 * 
 * ActivityDefinitionとその記録を組み合わせて、
 * UI表示用に最適化したデータ構造
 */
export interface TextLogData {
  /** アクティビティID */
  activityId: string;
  
  /** アクティビティ定義 */
  activity: ActivityDefinition;
  
  /** テキスト型の記録一覧（新しい順にソート済み） */
  records: ActivityRecord[];
}

/**
 * テキストログの表示項目
 */
export interface TextLogItem {
  /** 記録ID */
  id: string;
  
  /** 記録日（YYYY-MM-DD） */
  date: string;
  
  /** テキスト内容 */
  text: string;
  
  /** 表示用の省略テキスト */
  displayText: string;
  
  /** 省略されているかどうか */
  isTruncated: boolean;
}
