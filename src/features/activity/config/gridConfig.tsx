import type { GridItemConfig } from '@/features/grid-layout';
import { colors, gridItemShadows } from '@/shared/config';
import { AddRecordButton, CreateActivityButton } from '../ui/buttons';
import { ACTIVITY_PRIMARY_ACTIONS } from './constants';

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
      id: ACTIVITY_PRIMARY_ACTIONS.ADD_RECORD,
      order: 0,
      size: 'small-square',
      position: { column: 1, row: 1, columnSpan: 1 },
      content: <AddRecordButton />,
      backgroundColor: colors.gridItem.addRecord,
      customShadow: gridItemShadows.addRecord,
      clickable: true,
    },
    {
      id: ACTIVITY_PRIMARY_ACTIONS.CREATE,
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
