import type { ActivityRecord } from '@/shared/types';

/**
 * レコードリポジトリのインターフェース
 * Feature-Sliced Design: features/activity/api
 * 
 * アクティビティ記録のCRUD操作とビジネスロジックを提供。
 * StorageServiceへの依存を隠蔽し、データアクセス層を抽象化。
 */
export interface RecordRepository {
  /**
   * すべての記録を取得
   * @returns アクティビティ記録の配列
   * @throws Error データ取得に失敗した場合
   */
  getAll(): Promise<ActivityRecord[]>;
  
  /**
   * IDで記録を取得
   * @param id - 記録ID
   * @returns アクティビティ記録、または null（存在しない場合）
   * @throws Error データ取得に失敗した場合
   */
  getById(id: string): Promise<ActivityRecord | null>;
  
  /**
   * 特定のアクティビティに紐づく記録を取得
   * @param activityId - アクティビティID
   * @returns 該当アクティビティの記録の配列
   * @throws Error データ取得に失敗した場合
   */
  getByActivityId(activityId: string): Promise<ActivityRecord[]>;
  
  /**
   * 期間を指定して記録を取得
   * @param startDate - 開始日（YYYY-MM-DD形式）
   * @param endDate - 終了日（YYYY-MM-DD形式）
   * @returns 期間内の記録の配列
   * @throws Error データ取得に失敗した場合
   */
  getByDateRange(startDate: string, endDate: string): Promise<ActivityRecord[]>;
  
  /**
   * 特定のアクティビティの特定期間の記録を取得
   * @param activityId - アクティビティID
   * @param startDate - 開始日（YYYY-MM-DD形式）
   * @param endDate - 終了日（YYYY-MM-DD形式）
   * @returns 該当する記録の配列
   * @throws Error データ取得に失敗した場合
   */
  getByActivityIdAndDateRange(
    activityId: string,
    startDate: string,
    endDate: string
  ): Promise<ActivityRecord[]>;
  
  /**
   * 新しい記録を作成
   * 
   * 自動設定される項目:
   * - id: ユニークなIDを生成
   * - timestamp: 記録日時（現在時刻）
   * - createdAt: 作成日時
   * - updatedAt: 更新日時
   * 
   * @param data - 記録データ（IDなどは自動生成）
   * @returns 作成された記録
   * @throws Error 作成に失敗した場合
   */
  create(
    data: Omit<ActivityRecord, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>
  ): Promise<ActivityRecord>;
  
  /**
   * 記録を更新
   * 
   * 自動更新される項目:
   * - updatedAt: 更新日時
   * 
   * 変更不可の項目:
   * - id: IDは変更できない
   * - timestamp: 記録日時は変更できない（別の記録として作成を推奨）
   * - createdAt: 作成日時は変更できない
   * 
   * @param id - 更新する記録のID
   * @param updates - 更新する内容（部分更新可能）
   * @returns 更新後の記録
   * @throws Error 更新に失敗した場合、または該当IDが存在しない場合
   */
  update(
    id: string,
    updates: Partial<Omit<ActivityRecord, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>>
  ): Promise<ActivityRecord>;
  
  /**
   * 記録を削除
   * @param id - 削除する記録のID
   * @throws Error 削除に失敗した場合
   */
  delete(id: string): Promise<void>;
}
