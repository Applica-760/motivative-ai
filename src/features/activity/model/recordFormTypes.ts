import type { ActivityValue } from '@/shared/types';

/**
 * 記録追加フォームの入力データ
 */
export interface RecordFormData {
  /** 記録対象のアクティビティID */
  activityId: string;
  
  /** 記録する値 */
  value: ActivityValue;
  
  /** 記録日（YYYY-MM-DD形式） */
  date: string;
  
  /** メモ（オプション） */
  note?: string;
}

/**
 * フォームバリデーションエラー
 */
export interface RecordFormErrors {
  activityId?: string;
  value?: string;
  date?: string;
  note?: string;
}

/**
 * 記録追加フォームの状態
 */
export interface RecordFormState {
  /** フォームデータ */
  data: RecordFormData;
  
  /** バリデーションエラー */
  errors: RecordFormErrors;
  
  /** 送信中フラグ */
  isSubmitting: boolean;
  
  /** 送信完了フラグ */
  isSubmitted: boolean;
}
