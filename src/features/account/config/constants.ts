import type { Gender } from '../model/types';

/**
 * 性別の選択肢
 */
export const GENDER_OPTIONS: ReadonlyArray<{ value: Gender; label: string }> = [
  { value: '未設定', label: '未設定' },
  { value: '男性', label: '男性' },
  { value: '女性', label: '女性' },
  { value: 'その他', label: 'その他' },
] as const;

/**
 * バリデーションルール
 */
export const VALIDATION_RULES = {
  DISPLAY_NAME_MAX_LENGTH: 50,
  AI_MESSAGE_MAX_LENGTH: 500,
} as const;
