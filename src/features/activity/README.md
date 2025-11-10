# Activity Feature

アクティビティの定義・記録・管理を行う機能モジュール

## 概要

このfeatureは、ユーザーが追跡したい様々なアクティビティ（ランニング、読書、習慣など）を
定義・記録・可視化するための基盤を提供します。

## データモデル

### ActivityDefinition（アクティビティ定義）

アクティビティの「型」を定義します。例: ランニング、読書、瞑想など

```typescript
interface ActivityDefinition {
  id: string;              // ユニークID
  title: string;           // アクティビティ名
  icon: string;            // 絵文字アイコン
  valueType: ActivityValueType; // 記録する値の型
  unit?: string;           // 単位（数値型の場合）
  color?: string;          // 表示色
  createdAt: Date;
  updatedAt: Date;
  order: number;           // 表示順序
  isArchived?: boolean;    // アーカイブ済み
}
```

### ActivityRecord（アクティビティ記録）

実際の記録データを表します。例: 2025-01-09に5km走った

```typescript
interface ActivityRecord {
  id: string;
  activityId: string;      // ActivityDefinitionのID
  value: ActivityValue;    // 記録された値
  date: string;            // 記録日（YYYY-MM-DD）
  timestamp: Date;         // 記録日時
  note?: string;           // メモ
  createdAt: Date;
  updatedAt: Date;
}
```

### ActivityValue（記録値）

Union型で型安全に様々なデータ型を扱います。

```typescript
type ActivityValue =
  | { type: 'number'; value: number; unit?: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'text'; value: string }
  | { type: 'image'; value: string }
  | { type: 'duration'; value: number; unit: 'minutes' };
```

## 使用例

```typescript
import { mockActivityDefinitions, formatActivityValue } from '@/features/activity';

// アクティビティ定義の取得
const runningActivity = mockActivityDefinitions[0];

// 記録の作成例
const record: ActivityRecord = {
  id: generateId(),
  activityId: runningActivity.id,
  value: { type: 'number', value: 5.2, unit: 'km' },
  date: getTodayDateString(),
  timestamp: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

// 値の表示
console.log(formatActivityValue(record.value)); // "5.2km"
```

## ユーティリティ関数

### 日付関連
- `formatDateString(date: Date): string` - YYYY-MM-DD形式に変換
- `getTodayDateString(): string` - 今日の日付を取得

### 値の変換
- `extractNumericValue(value: ActivityValue): number` - グラフ用に数値抽出
- `formatActivityValue(value: ActivityValue): string` - 表示用文字列に変換

### 集計関連
- `calculateTotalValue(records: ActivityRecord[]): number` - 合計値を計算
- `calculateAverageValue(records: ActivityRecord[]): number` - 平均値を計算
- `sortRecordsByDate(records: ActivityRecord[]): ActivityRecord[]` - 日付でソート
- `filterRecordsByDateRange(records, startDate, endDate): ActivityRecord[]` - 期間でフィルタ

### その他
- `generateId(): string` - ユニークIDを生成

## 今後の実装予定

- [ ] アクティビティ定義の作成・編集・削除UI
- [ ] アクティビティ記録の入力フォーム
- [ ] LocalStorage/IndexedDBでの永続化
- [ ] Firebaseとの連携
- [ ] 統計情報の計算とキャッシング
