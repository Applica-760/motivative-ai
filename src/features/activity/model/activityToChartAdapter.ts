import type { ActivityRecord } from '@/shared/types';
import type { ChartDataPoint } from '@/shared/types';
import { extractNumericValue } from './activityUtils';

/**
 * ActivityRecordの配列をChartDataPointの配列に変換
 * グラフ表示用のデータ形式に変換するアダプター関数
 * 
 * @param records - アクティビティ記録の配列
 * @param dateFormat - 日付フォーマット（'MM/DD'形式に変換、デフォルトはYYYY-MM-DDから）
 * @returns グラフ表示用のデータポイント配列（日付順にソート済み）
 */
export function convertActivityRecordsToChartData(
  records: ActivityRecord[],
  dateFormat: 'MM/DD' | 'YYYY-MM-DD' = 'MM/DD'
): ChartDataPoint[] {
  // まず日付順にソート（古い順）
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // 同じ日付の記録を集計するマップ
  const dateMap = new Map<string, number>();
  
  sortedRecords.forEach((record) => {
    // 日付フォーマットの変換
    const date = dateFormat === 'MM/DD' 
      ? formatRecordDateToChartLabel(record.date)
      : record.date;
    
    // 数値に変換（ActivityValueから数値を抽出）
    const value = extractNumericValue(record.value);
    
    // 同じ日付の値を合算
    const currentValue = dateMap.get(date) || 0;
    dateMap.set(date, currentValue + value);
  });
  
  // マップを配列に変換（すでにソート済みの順序を維持）
  const result: ChartDataPoint[] = [];
  dateMap.forEach((value, date) => {
    result.push({ date, value });
  });
  
  console.log('[activityToChartAdapter] Converted records:', {
    inputCount: records.length,
    outputCount: result.length,
    data: result,
  });
  
  return result;
}

/**
 * 記録日をグラフ表示用のラベルに変換
 * YYYY-MM-DD → MM/DD
 * 
 * @param dateString - YYYY-MM-DD形式の日付文字列
 * @returns MM/DD形式の日付文字列
 */
function formatRecordDateToChartLabel(dateString: string): string {
  try {
    const [, month, day] = dateString.split('-');
    
    // 月/日のみ表示
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    
    return `${monthNum}/${dayNum}`;
  } catch (error) {
    console.error('[activityToChartAdapter] Invalid date format:', dateString);
    return dateString;
  }
}

/**
 * 日付範囲内のアクティビティ記録をグラフデータに変換
 * 
 * @param records - アクティビティ記録の配列
 * @param startDate - 開始日（YYYY-MM-DD）
 * @param endDate - 終了日（YYYY-MM-DD）
 * @param fillMissingDates - 欠損日を0で埋めるかどうか
 * @returns グラフ表示用のデータポイント配列
 */
export function convertRecordsInDateRange(
  records: ActivityRecord[],
  startDate: string,
  endDate: string,
  fillMissingDates = true
): ChartDataPoint[] {
  // 日付範囲内の記録をフィルタリング
  const filteredRecords = records.filter((record) => {
    return record.date >= startDate && record.date <= endDate;
  });
  
  // グラフデータに変換
  const chartData = convertActivityRecordsToChartData(filteredRecords);
  
  // 欠損日を埋める処理
  if (fillMissingDates) {
    return fillMissingDatesWithZero(chartData, startDate, endDate);
  }
  
  return chartData;
}

/**
 * 欠損日を0で埋める
 * グラフの連続性を保つために、記録がない日も0として表示
 * 
 * @param chartData - 既存のグラフデータ
 * @param startDate - 開始日（YYYY-MM-DD）
 * @param endDate - 終了日（YYYY-MM-DD）
 * @returns 欠損日を埋めたグラフデータ
 */
function fillMissingDatesWithZero(
  chartData: ChartDataPoint[],
  startDate: string,
  endDate: string
): ChartDataPoint[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: ChartDataPoint[] = [];
  
  // 日付のマップを作成（高速検索用）
  const dataMap = new Map<string, number>();
  chartData.forEach((point) => {
    // MM/DD形式から日付を復元して比較用のキーを作成
    const [month, day] = point.date.split('/');
    const key = `${parseInt(month)}/${parseInt(day)}`;
    dataMap.set(key, point.value);
  });
  
  // 開始日から終了日まで1日ずつループ
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const key = `${month}/${day}`;
    
    result.push({
      date: key,
      value: dataMap.get(key) ?? 0,
    });
  }
  
  return result;
}

/**
 * 複数のアクティビティ記録を日付ごとに集計してグラフデータに変換
 * 同じ日に複数の記録がある場合、合計値を使用
 * 
 * @param records - アクティビティ記録の配列
 * @returns グラフ表示用のデータポイント配列
 */
export function aggregateRecordsByDate(
  records: ActivityRecord[]
): ChartDataPoint[] {
  const dateMap = new Map<string, number>();
  
  records.forEach((record) => {
    const date = formatRecordDateToChartLabel(record.date);
    const value = extractNumericValue(record.value);
    
    const currentValue = dateMap.get(date) ?? 0;
    dateMap.set(date, currentValue + value);
  });
  
  // Mapをソート済み配列に変換
  return Array.from(dateMap.entries())
    .sort((a, b) => {
      // MM/DD形式の文字列を日付として比較
      const [aMonth, aDay] = a[0].split('/').map(Number);
      const [bMonth, bDay] = b[0].split('/').map(Number);
      return aMonth === bMonth ? aDay - bDay : aMonth - bMonth;
    })
    .map(([date, value]) => ({ date, value }));
}
