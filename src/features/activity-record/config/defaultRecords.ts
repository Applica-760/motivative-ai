import type { ActivityRecord } from '@/shared/types';

/**
 * デフォルトアクティビティ記録データ
 * 初回起動時にユーザーに使い方を例示するためのサンプルデータ（過去7日分）
 */

// 今日から過去7日分の日付を生成
const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD形式
  }
  
  return dates;
};

const dates = generateDates(7);

/**
 * ランニングの記録（過去7日分）
 */
const runningRecords: ActivityRecord[] = [
  {
    id: 'record-running-001',
    activityId: 'running-001',
    value: { type: 'number', value: 5.2, unit: 'km' },
    date: dates[0],
    timestamp: new Date(dates[0]),
    note: '朝ランニング、気持ちよく走れた',
    createdAt: new Date(dates[0]),
    updatedAt: new Date(dates[0]),
  },
  {
    id: 'record-running-002',
    activityId: 'running-001',
    value: { type: 'number', value: 3.8, unit: 'km' },
    date: dates[1],
    timestamp: new Date(dates[1]),
    note: '少し疲れていた',
    createdAt: new Date(dates[1]),
    updatedAt: new Date(dates[1]),
  },
  {
    id: 'record-running-003',
    activityId: 'running-001',
    value: { type: 'number', value: 7.5, unit: 'km' },
    date: dates[2],
    timestamp: new Date(dates[2]),
    note: '調子が良くて長めに走った',
    createdAt: new Date(dates[2]),
    updatedAt: new Date(dates[2]),
  },
  {
    id: 'record-running-004',
    activityId: 'running-001',
    value: { type: 'number', value: 4.3, unit: 'km' },
    date: dates[3],
    timestamp: new Date(dates[3]),
    createdAt: new Date(dates[3]),
    updatedAt: new Date(dates[3]),
  },
  {
    id: 'record-running-005',
    activityId: 'running-001',
    value: { type: 'number', value: 6.0, unit: 'km' },
    date: dates[4],
    timestamp: new Date(dates[4]),
    note: 'ペースアップできた',
    createdAt: new Date(dates[4]),
    updatedAt: new Date(dates[4]),
  },
  {
    id: 'record-running-006',
    activityId: 'running-001',
    value: { type: 'number', value: 5.5, unit: 'km' },
    date: dates[5],
    timestamp: new Date(dates[5]),
    createdAt: new Date(dates[5]),
    updatedAt: new Date(dates[5]),
  },
  {
    id: 'record-running-007',
    activityId: 'running-001',
    value: { type: 'number', value: 8.2, unit: 'km' },
    date: dates[6],
    timestamp: new Date(dates[6]),
    note: '今週のベスト記録！',
    createdAt: new Date(dates[6]),
    updatedAt: new Date(dates[6]),
  },
];

/**
 * 読書の記録（過去7日分）
 */
const readingRecords: ActivityRecord[] = [
  {
    id: 'record-reading-001',
    activityId: 'reading-001',
    value: { type: 'duration', value: 30, unit: 'minutes' },
    date: dates[0],
    timestamp: new Date(dates[0]),
    note: '技術書を読んだ',
    createdAt: new Date(dates[0]),
    updatedAt: new Date(dates[0]),
  },
  {
    id: 'record-reading-002',
    activityId: 'reading-001',
    value: { type: 'duration', value: 45, unit: 'minutes' },
    date: dates[1],
    timestamp: new Date(dates[1]),
    note: '小説が面白い',
    createdAt: new Date(dates[1]),
    updatedAt: new Date(dates[1]),
  },
  {
    id: 'record-reading-003',
    activityId: 'reading-001',
    value: { type: 'duration', value: 60, unit: 'minutes' },
    date: dates[2],
    timestamp: new Date(dates[2]),
    note: '休日なのでたっぷり読書',
    createdAt: new Date(dates[2]),
    updatedAt: new Date(dates[2]),
  },
  {
    id: 'record-reading-004',
    activityId: 'reading-001',
    value: { type: 'duration', value: 20, unit: 'minutes' },
    date: dates[3],
    timestamp: new Date(dates[3]),
    note: '忙しくて短め',
    createdAt: new Date(dates[3]),
    updatedAt: new Date(dates[3]),
  },
  {
    id: 'record-reading-005',
    activityId: 'reading-001',
    value: { type: 'duration', value: 50, unit: 'minutes' },
    date: dates[4],
    timestamp: new Date(dates[4]),
    createdAt: new Date(dates[4]),
    updatedAt: new Date(dates[4]),
  },
  {
    id: 'record-reading-006',
    activityId: 'reading-001',
    value: { type: 'duration', value: 40, unit: 'minutes' },
    date: dates[5],
    timestamp: new Date(dates[5]),
    createdAt: new Date(dates[5]),
    updatedAt: new Date(dates[5]),
  },
  {
    id: 'record-reading-007',
    activityId: 'reading-001',
    value: { type: 'duration', value: 55, unit: 'minutes' },
    date: dates[6],
    timestamp: new Date(dates[6]),
    note: '良い習慣が身についてきた',
    createdAt: new Date(dates[6]),
    updatedAt: new Date(dates[6]),
  },
];

/**
 * 早起きの記録（過去7日分）
 */
const earlyWakeRecords: ActivityRecord[] = [
  {
    id: 'record-early-wake-001',
    activityId: 'early-wake-001',
    value: { type: 'boolean', value: true },
    date: dates[0],
    timestamp: new Date(dates[0]),
    note: '目覚まし1回で起きれた！',
    createdAt: new Date(dates[0]),
    updatedAt: new Date(dates[0]),
  },
  {
    id: 'record-early-wake-002',
    activityId: 'early-wake-001',
    value: { type: 'boolean', value: true },
    date: dates[1],
    timestamp: new Date(dates[1]),
    note: '気持ちよく起きれた',
    createdAt: new Date(dates[1]),
    updatedAt: new Date(dates[1]),
  },
  {
    id: 'record-early-wake-003',
    activityId: 'early-wake-001',
    value: { type: 'boolean', value: true },
    date: dates[2],
    timestamp: new Date(dates[2]),
    note: '朝の時間を有効活用できた',
    createdAt: new Date(dates[2]),
    updatedAt: new Date(dates[2]),
  },
  {
    id: 'record-early-wake-004',
    activityId: 'early-wake-001',
    value: { type: 'boolean', value: true },
    date: dates[3],
    timestamp: new Date(dates[3]),
    createdAt: new Date(dates[3]),
    updatedAt: new Date(dates[3]),
  },
  {
    id: 'record-early-wake-005',
    activityId: 'early-wake-001',
    value: { type: 'boolean', value: true },
    date: dates[4],
    timestamp: new Date(dates[4]),
    note: '早起き習慣が身についてきた',
    createdAt: new Date(dates[4]),
    updatedAt: new Date(dates[4]),
  },
  {
    id: 'record-early-wake-006',
    activityId: 'early-wake-001',
    value: { type: 'boolean', value: true },
    date: dates[5],
    timestamp: new Date(dates[5]),
    createdAt: new Date(dates[5]),
    updatedAt: new Date(dates[5]),
  },
  {
    id: 'record-early-wake-007',
    activityId: 'early-wake-001',
    value: { type: 'boolean', value: true },
    date: dates[6],
    timestamp: new Date(dates[6]),
    note: '完璧な一週間！',
    createdAt: new Date(dates[6]),
    updatedAt: new Date(dates[6]),
  },
];

/**
 * 頑張った日記の記録（過去7日分）
 */
const diaryRecords: ActivityRecord[] = [
  {
    id: 'record-diary-001',
    activityId: 'diary-001',
    value: { type: 'text', value: '少しづつ早起きが習慣になってきた。' },
    date: dates[0],
    timestamp: new Date(dates[0]),
    createdAt: new Date(dates[0]),
    updatedAt: new Date(dates[0]),
  },
  {
    id: 'record-diary-002',
    activityId: 'diary-001',
    value: { type: 'text', value: '友達とリフレッシュ。久しぶりに会えて楽しかった！' },
    date: dates[1],
    timestamp: new Date(dates[1]),
    createdAt: new Date(dates[1]),
    updatedAt: new Date(dates[1]),
  },
  {
    id: 'record-diary-003',
    activityId: 'diary-001',
    value: { type: 'text', value: 'いつもより走った。体力がついてきた気がする。' },
    date: dates[2],
    timestamp: new Date(dates[2]),
    createdAt: new Date(dates[2]),
    updatedAt: new Date(dates[2]),
  },
  {
    id: 'record-diary-004',
    activityId: 'diary-001',
    value: { type: 'text', value: '仕事で新しいプロジェクトを任された。やる気が出る！' },
    date: dates[3],
    timestamp: new Date(dates[3]),
    createdAt: new Date(dates[3]),
    updatedAt: new Date(dates[3]),
  },
  {
    id: 'record-diary-005',
    activityId: 'diary-001',
    value: { type: 'text', value: '家族との時間を大切にできた。' },
    date: dates[4],
    timestamp: new Date(dates[4]),
    createdAt: new Date(dates[4]),
    updatedAt: new Date(dates[4]),
  },
  {
    id: 'record-diary-006',
    activityId: 'diary-001',
    value: { type: 'text', value: '趣味の時間を作れた。ストレス解消になった。' },
    date: dates[5],
    timestamp: new Date(dates[5]),
    createdAt: new Date(dates[5]),
    updatedAt: new Date(dates[5]),
  },
  {
    id: 'record-diary-007',
    activityId: 'diary-001',
    value: { type: 'text', value: '資格勉強を頑張った。難しい問題も解けるようになってきた。' },
    date: dates[6],
    timestamp: new Date(dates[6]),
    createdAt: new Date(dates[6]),
    updatedAt: new Date(dates[6]),
  },
];

/**
 * すべてのデフォルト記録データ
 */
export const defaultRecords: ActivityRecord[] = [
  ...runningRecords,
  ...readingRecords,
  ...earlyWakeRecords,
  ...diaryRecords,
];
