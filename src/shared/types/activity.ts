/**
 * アクティビティの値の型
 */
export const ActivityValueType = {
  NUMBER: 'number',      // 数値（例: 距離、回数、時間）
  BOOLEAN: 'boolean',    // bool値（例: 実施した/しなかった）
  TEXT: 'text',          // テキスト（例: メモ、感想）
  IMAGE: 'image',        // 画像URL
  DURATION: 'duration',  // 期間（分単位の数値）
} as const;

export type ActivityValueType = typeof ActivityValueType[keyof typeof ActivityValueType];

/**
 * アクティビティの値（Union型で型安全性を確保）
 */
export type ActivityValue =
  | { type: 'number'; value: number; unit?: string }      // 単位付き数値
  | { type: 'boolean'; value: boolean }
  | { type: 'text'; value: string }
  | { type: 'image'; value: string }                      // URL or base64
  | { type: 'duration'; value: number; unit: 'minutes' }; // 分単位

/**
 * アクティビティの定義（テンプレート）
 */
export interface ActivityDefinition {
  /** アクティビティID（ユニーク） */
  id: string;
  
  /** アクティビティ名 */
  title: string;
  
  /** アイコン（絵文字） */
  icon: string;
  
  /** 記録する値の型 */
  valueType: ActivityValueType;
  
  /** 数値型の場合の単位（例: "km", "回", "分"） */
  unit?: string;
  
  /** 表示色（グラフなど） */
  color?: string;
  
  /** 作成日時 */
  createdAt: Date;
  
  /** 更新日時 */
  updatedAt: Date;
  
  /** 並び順 */
  order: number;
  
  /** アーカイブ済みフラグ */
  isArchived?: boolean;
}

/**
 * アクティビティの記録（実際のデータ）
 */
export interface ActivityRecord {
  /** 記録ID */
  id: string;
  
  /** アクティビティID（ActivityDefinitionを参照） */
  activityId: string;
  
  /** 記録された値 */
  value: ActivityValue;
  
  /** 記録日（YYYY-MM-DD形式） */
  date: string;
  
  /** 記録日時 */
  timestamp: Date;
  
  /** メモ（オプション） */
  note?: string;
  
  /** 作成日時 */
  createdAt: Date;
  
  /** 更新日時 */
  updatedAt: Date;
}

/**
 * アクティビティの統計情報（表示用）
 */
export interface ActivityStatistics {
  /** アクティビティID */
  activityId: string;
  
  /** アクティビティ定義 */
  definition: ActivityDefinition;
  
  /** 最新の記録 */
  latestRecord?: ActivityRecord;
  
  /** 指定期間の記録数 */
  recordCount: number;
  
  /** 数値型の場合の合計値 */
  totalValue?: number;
  
  /** 数値型の場合の平均値 */
  averageValue?: number;
  
  /** 期間内の記録データ（グラフ用） */
  records: ActivityRecord[];
}
