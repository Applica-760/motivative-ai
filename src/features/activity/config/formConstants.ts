/**
 * アイコン選択肢（絵文字）
 */
export const ACTIVITY_ICONS = [
  '🏃', '💪', '🚴', '🏊', '🧘', '🤸',  // 運動系
  '📚', '✍️', '💻', '🎨', '🎵', '🎮',  // 学習・趣味系
  '💧', '🥗', '☕', '🍎', '🥤', '🍵',  // 健康・食事系
  '😴', '🛌', '⏰', '🌅', '🌙', '✨',  // 生活習慣系
  '💼', '📊', '📝', '📧', '📞', '🤝',  // 仕事系
  '🎯', '⭐', '🏆', '💎', '🔥', '❤️',  // 目標・モチベーション系
] as const;

/**
 * カラーパレット（プリセット）
 */
export const ACTIVITY_COLORS = [
  { label: 'レッド', value: '#FF6B6B' },
  { label: 'オレンジ', value: '#FFA07A' },
  { label: 'イエロー', value: '#FFD93D' },
  { label: 'グリーン', value: '#95E1D3' },
  { label: 'ティール', value: '#4ECDC4' },
  { label: 'ブルー', value: '#74B9FF' },
  { label: 'パープル', value: '#A29BFE' },
  { label: 'ピンク', value: '#FD79A8' },
  { label: 'グレー', value: '#95A5A6' },
  { label: 'ダークグリーン', value: '#6C9A8B' },
  { label: 'インディゴ', value: '#5F6CAF' },
  { label: 'ローズ', value: '#E17B77' },
] as const;

/**
 * 値の型の選択肢
 */
export const VALUE_TYPE_OPTIONS = [
  {
    value: 'number',
    label: '数値',
    description: '距離、回数などの数値を記録',
    icon: '🔢',
  },
  {
    value: 'duration',
    label: '時間',
    description: '活動時間を分単位で記録',
    icon: '⏱️',
  },
  {
    value: 'boolean',
    label: '実施/未実施',
    description: 'やった・やらなかったを記録',
    icon: '✅',
  },
  {
    value: 'text',
    label: 'テキスト',
    description: 'メモや感想を記録',
    icon: '📝',
  },
] as const;

/**
 * 数値型の単位プリセット
 */
export const NUMBER_UNIT_PRESETS = [
  '回',
  'km',
  'm',
  '歩',
  'kcal',
  'g',
  'mg',
  'L',
  'ml',
  'ページ',
  '時間',
  '分',
] as const;

/**
 * フォームのデフォルト値
 */
export const DEFAULT_FORM_VALUES = {
  title: '',
  icon: '⭐',
  valueType: 'number' as const,
  unit: '回',
  color: '#4ECDC4',
};
