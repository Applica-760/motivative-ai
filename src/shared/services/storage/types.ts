import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import type { SavedLayout } from '@/features/grid-layout';

/**
 * ストレージサービスの抽象インターフェース
 * Feature-Sliced Design: shared/services
 * 
 * localStorage、Firebase、その他のストレージ実装を抽象化。
 * ログイン状態に応じて実装を切り替え可能にする。
 * 
 * @example
 * ```typescript
 * const storage = new LocalStorageService();
 * const activities = await storage.getActivities();
 * ```
 */
export interface StorageService {
  // ==================== Activities ====================
  
  /**
   * すべてのアクティビティ定義を取得
   * @returns アクティビティ定義の配列
   * @throws StorageError 読み込みに失敗した場合
   */
  getActivities(): Promise<ActivityDefinition[]>;
  
  /**
   * アクティビティ定義を一括保存
   * @param activities - 保存するアクティビティ定義の配列
   * @throws StorageError 保存に失敗した場合
   */
  saveActivities(activities: ActivityDefinition[]): Promise<void>;
  
  /**
   * 新しいアクティビティ定義を追加
   * @param activity - 追加するアクティビティ定義
   * @returns 追加されたアクティビティ定義（IDが生成される）
   * @throws StorageError 追加に失敗した場合
   */
  addActivity(activity: ActivityDefinition): Promise<ActivityDefinition>;
  
  /**
   * アクティビティ定義を更新
   * @param id - 更新するアクティビティのID
   * @param updates - 更新する内容（部分的な更新が可能）
   * @returns 更新後のアクティビティ定義
   * @throws StorageError 更新に失敗した場合、または該当IDが存在しない場合
   */
  updateActivity(
    id: string,
    updates: Partial<ActivityDefinition>
  ): Promise<ActivityDefinition>;
  
  /**
   * アクティビティ定義を削除
   * @param id - 削除するアクティビティのID
   * @throws StorageError 削除に失敗した場合
   */
  deleteActivity(id: string): Promise<void>;
  
  // ==================== Records ====================
  
  /**
   * すべてのアクティビティ記録を取得
   * @returns アクティビティ記録の配列
   * @throws StorageError 読み込みに失敗した場合
   */
  getRecords(): Promise<ActivityRecord[]>;
  
  /**
   * アクティビティ記録を一括保存
   * @param records - 保存するアクティビティ記録の配列
   * @throws StorageError 保存に失敗した場合
   */
  saveRecords(records: ActivityRecord[]): Promise<void>;
  
  /**
   * 新しいアクティビティ記録を追加
   * @param record - 追加するアクティビティ記録
   * @returns 追加されたアクティビティ記録（IDが生成される）
   * @throws StorageError 追加に失敗した場合
   */
  addRecord(record: ActivityRecord): Promise<ActivityRecord>;
  
  /**
   * アクティビティ記録を更新
   * @param id - 更新する記録のID
   * @param updates - 更新する内容（部分的な更新が可能）
   * @returns 更新後のアクティビティ記録
   * @throws StorageError 更新に失敗した場合、または該当IDが存在しない場合
   */
  updateRecord(
    id: string,
    updates: Partial<ActivityRecord>
  ): Promise<ActivityRecord>;
  
  /**
   * アクティビティ記録を削除
   * @param id - 削除する記録のID
   * @throws StorageError 削除に失敗した場合
   */
  deleteRecord(id: string): Promise<void>;
  
  /**
   * 特定のアクティビティに紐づく記録を取得
   * @param activityId - アクティビティのID
   * @returns 該当アクティビティの記録の配列
   * @throws StorageError 読み込みに失敗した場合
   */
  getRecordsByActivityId(activityId: string): Promise<ActivityRecord[]>;
  
  // ==================== Grid Layout ====================
  
  /**
   * グリッドレイアウトの設定を取得
   * @returns 保存されたレイアウト、または null（初回時）
   * @throws StorageError 読み込みに失敗した場合
   */
  getGridLayout(): Promise<SavedLayout | null>;
  
  /**
   * グリッドレイアウトの設定を保存
   * @param layout - 保存するレイアウト設定
   * @throws StorageError 保存に失敗した場合
   */
  saveGridLayout(layout: SavedLayout): Promise<void>;
}

/**
 * ストレージ操作で発生するエラー
 */
export class StorageError extends Error {
  public readonly operation: 'read' | 'write' | 'delete';
  public readonly cause?: unknown;
  
  constructor(
    message: string,
    operation: 'read' | 'write' | 'delete',
    cause?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
    this.operation = operation;
    this.cause = cause;
  }
}

/**
 * ストレージサービスの種別
 */
export const StorageType = {
  LOCAL: 'local',
  FIREBASE: 'firebase',
} as const;

export type StorageType = typeof StorageType[keyof typeof StorageType];
