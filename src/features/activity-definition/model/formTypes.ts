import type { ActivityValueType } from '@/shared/types';

/**
 * アクティビティ作成・編集フォームのデータ型
 */
export interface ActivityFormData {
  /** アクティビティ名 */
  title: string;
  /** アイコン（絵文字） */
  icon: string;
  /** 記録する値の型 */
  valueType: ActivityValueType;
  /** 単位（数値型・期間型の場合） */
  unit?: string;
  /** 表示色 */
  color: string;
}

/**
 * アクティビティフォームのバリデーションエラー
 */
export interface ActivityFormErrors {
  title?: string;
  icon?: string;
  valueType?: string;
  unit?: string;
  color?: string;
}
