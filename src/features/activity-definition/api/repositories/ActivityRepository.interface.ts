import type { ActivityDefinition } from '@/shared/types';

/**
 * アクティビティ定義のRepository インターフェース
 */
export interface ActivityRepository {
  /**
   * すべてのアクティビティを取得
   */
  getAll(): Promise<ActivityDefinition[]>;
  
  /**
   * IDでアクティビティを取得
   */
  getById(id: string): Promise<ActivityDefinition | null>;
  
  /**
   * 新しいアクティビティを作成
   */
  create(
    data: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>
  ): Promise<ActivityDefinition>;
  
  /**
   * アクティビティを更新
   */
  update(
    id: string,
    updates: Partial<Omit<ActivityDefinition, 'id' | 'createdAt'>>
  ): Promise<ActivityDefinition>;
  
  /**
   * アクティビティを削除
   */
  delete(id: string): Promise<void>;
  
  /**
   * アーカイブされていないアクティビティのみを取得
   */
  getAllActive(): Promise<ActivityDefinition[]>;
  
  /**
   * アクティビティをアーカイブ
   */
  archive(id: string): Promise<ActivityDefinition>;
  
  /**
   * アクティビティを復元（アーカイブ解除）
   */
  restore(id: string): Promise<ActivityDefinition>;
}
