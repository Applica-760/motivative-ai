import type { ActivityDefinition } from '@/shared/types';

/**
 * アクティビティリポジトリのインターフェース
 * Feature-Sliced Design: features/activity/api
 * 
 * アクティビティ定義のCRUD操作とビジネスロジックを提供。
 * StorageServiceへの依存を隠蔽し、データアクセス層を抽象化。
 */
export interface ActivityRepository {
  /**
   * すべてのアクティビティを取得
   * @returns アクティビティ定義の配列
   * @throws Error データ取得に失敗した場合
   */
  getAll(): Promise<ActivityDefinition[]>;
  
  /**
   * IDでアクティビティを取得
   * @param id - アクティビティID
   * @returns アクティビティ定義、または null（存在しない場合）
   * @throws Error データ取得に失敗した場合
   */
  getById(id: string): Promise<ActivityDefinition | null>;
  
  /**
   * 新しいアクティビティを作成
   * 
   * 自動設定される項目:
   * - id: ユニークなIDを生成
   * - createdAt: 作成日時
   * - updatedAt: 更新日時
   * - order: 自動採番
   * - isArchived: false（デフォルト）
   * 
   * @param data - アクティビティデータ（IDなどは自動生成）
   * @returns 作成されたアクティビティ定義
   * @throws Error 作成に失敗した場合
   */
  create(
    data: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ): Promise<ActivityDefinition>;
  
  /**
   * アクティビティを更新
   * 
   * 自動更新される項目:
   * - updatedAt: 更新日時
   * 
   * 変更不可の項目:
   * - id: IDは変更できない
   * - createdAt: 作成日時は変更できない
   * - order: このメソッドでは変更不可（並び替えは別メソッド）
   * 
   * @param id - 更新するアクティビティのID
   * @param updates - 更新する内容（部分更新可能）
   * @returns 更新後のアクティビティ定義
   * @throws Error 更新に失敗した場合、または該当IDが存在しない場合
   */
  update(
    id: string,
    updates: Partial<Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>>
  ): Promise<ActivityDefinition>;
  
  /**
   * アクティビティを削除
   * 
   * 注意: 実際の削除ではなくアーカイブすることを推奨
   * 
   * @param id - 削除するアクティビティのID
   * @throws Error 削除に失敗した場合
   */
  delete(id: string): Promise<void>;
  
  /**
   * アーカイブされていないアクティビティのみを取得
   * @returns アクティブなアクティビティ定義の配列
   * @throws Error データ取得に失敗した場合
   */
  getAllActive(): Promise<ActivityDefinition[]>;
  
  /**
   * アクティビティをアーカイブ
   * 
   * @param id - アーカイブするアクティビティのID
   * @returns 更新後のアクティビティ定義
   * @throws Error アーカイブに失敗した場合
   */
  archive(id: string): Promise<ActivityDefinition>;
  
  /**
   * アクティビティを復元（アーカイブ解除）
   * 
   * @param id - 復元するアクティビティのID
   * @returns 更新後のアクティビティ定義
   * @throws Error 復元に失敗した場合
   */
  restore(id: string): Promise<ActivityDefinition>;
}
