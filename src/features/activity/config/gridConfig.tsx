import type { GridItemConfig } from '@/features/grid-layout';
import { colors, gridItemShadows } from '@/shared/config';
import { AddRecordButton } from '@/features/activity-record';
import { CreateActivityButton } from '@/features/activity-definition';

/**
 * アクティビティ関連のグリッドアイテムを生成
 * 
 * システムの中核機能として:
 * - 記録追加ボタン
 * - アクティビティ作成ボタン
 * を提供する
 * 
 * これらは特別な位置づけのプライマリアクションとして、
 * グリッドの最上部（1行目）に配置される
 */
export function createActivityActionGridItems(): GridItemConfig[] {
  return [
    {
      id: 'add-activity-record',
      order: 0,
      size: 'small-square',
      position: { column: 1, row: 1, columnSpan: 1 },
      content: <AddRecordButton />,
      backgroundColor: colors.gridItem.addRecord,
      customShadow: gridItemShadows.addRecord,
      clickable: true,
    },
    {
      id: 'create-activity',
      order: 1,
      size: 'small-square',
      position: { column: 2, row: 1, columnSpan: 1 },
      content: <CreateActivityButton />,
      backgroundColor: colors.gridItem.newActivity,
      customShadow: gridItemShadows.newActivity,
      clickable: true,
    },
  ];
}
