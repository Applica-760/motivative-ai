import { gradients } from '@/shared/config';
import type { ActionGradient } from '@/shared/components';

/**
 * アクティビティ関連のグラデーション定義
 * システムの主要機能として統一されたビジュアルアイデンティティ
 */
export const ACTIVITY_GRADIENTS = {
  /** 記録追加ボタンのグラデーション */
  addRecord: {
    from: gradients.blueCyan.from,
    to: gradients.blueCyan.to,
    deg: 45,
  } as ActionGradient,
  
  /** アクティビティ作成ボタンのグラデーション */
  create: {
    from: gradients.tealLime.from,
    to: gradients.tealLime.to,
    deg: 45,
  } as ActionGradient,
} as const;

/**
 * アクティビティのプライマリアクションID
 * システムの中核機能として特別な位置づけ
 */
export const ACTIVITY_PRIMARY_ACTIONS = {
  /** 記録追加 - 既存のアクティビティに記録を追加 */
  ADD_RECORD: 'add-activity-record',
  /** アクティビティ作成 - 新しいアクティビティを作成 */
  CREATE: 'create-activity',
} as const;

export type ActivityPrimaryAction = typeof ACTIVITY_PRIMARY_ACTIONS[keyof typeof ACTIVITY_PRIMARY_ACTIONS];
