import { gradients } from '@/shared/config';
import type { ActionGradient } from '@/shared/ui';

/**
 * アクティビティ定義関連のグラデーション定義
 */
export const ACTIVITY_DEFINITION_GRADIENTS = {
  /** アクティビティ作成ボタンのグラデーション */
  create: {
    from: gradients.tealLime.from,
    to: gradients.tealLime.to,
    deg: 45,
  } as ActionGradient,
} as const;

/**
 * アクティビティ定義のアクションID
 */
export const ACTIVITY_DEFINITION_ACTIONS = {
  /** アクティビティ作成 - 新しいアクティビティを作成 */
  CREATE: 'create-activity',
} as const;

export type ActivityDefinitionAction = typeof ACTIVITY_DEFINITION_ACTIONS[keyof typeof ACTIVITY_DEFINITION_ACTIONS];
