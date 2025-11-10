import type { ActivityValueType } from '@/shared/types';

/**
 * アクティビティ作成フォームの入力データ
 */
export interface ActivityFormData {
  /** アクティビティ名 */
  title: string;
  
  /** アイコン（絵文字） */
  icon: string;
  
  /** 記録する値の型 */
  valueType: ActivityValueType;
  
  /** 数値型・期間型の場合の単位 */
  unit?: string;
  
  /** 表示色 */
  color: string;
}

/**
 * フォームバリデーションエラー
 */
export interface ActivityFormErrors {
  title?: string;
  icon?: string;
  valueType?: string;
  unit?: string;
  color?: string;
}

/**
 * アクティビティ作成フォームの状態
 */
export interface ActivityFormState {
  /** フォームデータ */
  data: ActivityFormData;
  
  /** バリデーションエラー */
  errors: ActivityFormErrors;
  
  /** 送信中フラグ */
  isSubmitting: boolean;
  
  /** 送信完了フラグ */
  isSubmitted: boolean;
}
