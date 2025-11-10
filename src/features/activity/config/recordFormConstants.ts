/**
 * 記録追加フォームのデフォルト値
 */
export const DEFAULT_RECORD_FORM_VALUES = {
  activityId: '',
  value: { type: 'number' as const, value: 0 },
  date: new Date().toISOString().split('T')[0], // 今日の日付
  note: '',
};

/**
 * 数値入力のステップ値
 */
export const NUMBER_INPUT_STEP = {
  DEFAULT: 0.1,
  INTEGER: 1,
  DECIMAL: 0.01,
} as const;
