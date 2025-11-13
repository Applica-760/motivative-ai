import type { GridItemConfig } from '@/features/grid-layout';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { colors } from '@/shared/config';
import { TextLogWidget } from '../ui';

/**
 * Text Log Feature が提供するグリッドアイテムを生成
 * Feature-Sliced Design: 各featureが自身のグリッド設定を管理
 * 
 * テキスト型のアクティビティに対してテキストログビューを提供する
 * 各ログは1×2（縦長）のグリッドカードとして配置
 * 
 * 配置ロジック:
 * - 1列×2行の縦長カード
 * - startOrderで他ウィジェットの後に配置
 * - テキスト型アクティビティのみフィルタリング
 * 
 * @param activities - アクティビティ定義の配列
 * @param records - アクティビティ記録の配列
 * @param startOrder - グリッドアイテムの開始順序（他のウィジェットとの調整用）
 * @param onTextLogClick - テキストログクリック時のコールバック（オプション）
 */
export function createTextLogGridItems(
  activities: ActivityDefinition[],
  records: ActivityRecord[],
  startOrder = 0,
  onTextLogClick?: (activityId: string) => void
): GridItemConfig[] {
  // テキスト型のアクティビティのみをフィルタリング
  const textActivities = activities.filter(
    (activity) => activity.valueType === 'text' && !activity.isArchived
  );

  // 各テキストログを1×2の縦長として配置
  return textActivities.map((activity, index) => {
    // 配置計算: 1列×2行の縦長カード
    // 左上に配置（1列目、1-2行目）
    const row = 1;
    const column = 1;

    // アクティビティに紐づく記録をフィルタリング
    const activityRecords = records.filter(
      (record) => record.activityId === activity.id && record.value.type === 'text'
    );

    return {
      id: `${activity.id}-text-log`,
      order: startOrder + index,
      size: 'small-vertical' as const, // 1×2の縦長
      position: { column, row, columnSpan: 1, rowSpan: 2 },
      content: (
        <TextLogWidget
          activity={activity}
          records={activityRecords}
          onClick={onTextLogClick ? () => onTextLogClick(activity.id) : undefined}
        />
      ),
      backgroundColor: colors.gridItem.textLog,
      shadow: 'md' as const,
    };
  });
}
