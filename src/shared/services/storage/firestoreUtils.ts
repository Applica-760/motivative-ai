import { Timestamp, type QueryDocumentSnapshot, type DocumentData } from 'firebase/firestore';

/**
 * Date型フィールドを持つオブジェクトの変換設定
 */
export interface DateFieldConfig {
  /** Date型に変換するフィールド名のリスト */
  dateFields: string[];
}

/**
 * FirestoreのTimestampをDate型に変換
 * 
 * @param value - 変換する値（Timestamp, Date, string, number）
 * @returns Date型
 */
export function convertToDate(value: unknown): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date(value as string | number);
}

/**
 * FirestoreドキュメントをTypeScript型に変換する汎用ヘルパー
 * 
 * Timestamp型のフィールドを自動的にDate型に変換し、
 * ドキュメントIDをオブジェクトに含める。
 * 
 * @template T - 変換後の型
 * @param doc - Firestoreドキュメント
 * @param config - Date型変換の設定
 * @returns 変換後のオブジェクト
 * 
 * @example
 * ```typescript
 * const activity = mapFirestoreDocument<ActivityDefinition>(doc, {
 *   dateFields: ['createdAt', 'updatedAt']
 * });
 * ```
 */
export function mapFirestoreDocument<T>(
  doc: QueryDocumentSnapshot<DocumentData>,
  config?: DateFieldConfig
): T {
  const data = doc.data();
  const result: Record<string, unknown> = {
    ...data,
    id: doc.id,
  };
  
  // Date型フィールドの変換
  if (config?.dateFields) {
    for (const field of config.dateFields) {
      if (data[field] !== undefined) {
        result[field] = convertToDate(data[field]);
      }
    }
  }
  
  return result as T;
}
