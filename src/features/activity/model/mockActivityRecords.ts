import type { ActivityRecord } from '@/shared/types';

/**
 * モックアクティビティ記録データ
 * 開発・テスト用のサンプル記録（過去7日分）
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
 * すべてのモック記録データ
 */
export const mockActivityRecords: ActivityRecord[] = [
  ...runningRecords,
  ...readingRecords,
];
