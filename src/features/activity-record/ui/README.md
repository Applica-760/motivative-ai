# 記録追加フォーム実装

## 概要

既存のアクティビティに新しい記録を追加するための完全なフォーム実装。
アクティビティ作成フォームと同様のレイヤー分離構造を採用し、
選択されたアクティビティの記録タイプに応じて動的にUIが変化します。

## アーキテクチャ

### レイヤー構成

```
features/activity/
├── model/                      # ビジネスロジック・型定義層
│   ├── recordFormTypes.ts     # 記録フォームの型定義
│   └── recordValidation.ts    # バリデーションロジック
├── config/                     # 設定・定数層
│   └── recordFormConstants.ts # フォームの定数
├── hooks/                      # カスタムフック層
│   ├── useRecordForm.ts       # フォーム状態管理
│   └── useActivities.ts       # アクティビティデータ取得
└── ui/                         # UI層
    ├── record-forms/          # 記録フォームコンポーネント
    │   ├── RecordForm.tsx             # メインフォーム
    │   ├── ActivitySelect.tsx         # アクティビティ選択
    │   ├── ValueInput.tsx             # 値入力（動的）
    │   ├── DateField.tsx              # 日付入力
    │   └── NoteField.tsx              # メモ入力
    └── modals/
        └── AddRecordModal.tsx         # モーダルラッパー
```

## データフロー

```
AddRecordModal
  ↓
RecordForm (UIコンポーネント統合)
  ↓
useRecordForm (状態管理・バリデーション)
  ↓
useActivities (アクティビティデータ取得)
  ↓
mockActivityDefinitions (データソース)
```

## 型定義層 (`model/recordFormTypes.ts`)

### `RecordFormData`
記録フォームの入力データ。

```typescript
interface RecordFormData {
  activityId: string;      // 記録対象のアクティビティID
  value: ActivityValue;    // 記録する値（Union型）
  date: string;            // 記録日（YYYY-MM-DD形式）
  note?: string;           // メモ（オプション）
}
```

### `RecordFormErrors`
バリデーションエラーを表す型。

### `RecordFormState`
フォーム全体の状態を表す型。

## 定数層 (`config/recordFormConstants.ts`)

### `DEFAULT_RECORD_FORM_VALUES`
フォームのデフォルト値。
- 日付は今日の日付で初期化

### `NUMBER_INPUT_STEP`
数値入力のステップ値定義。

## バリデーション層 (`model/recordValidation.ts`)

### `validateRecordForm(data: RecordFormData)`
フォームデータをバリデーション。

**バリデーションルール:**
- **activityId**: 必須
- **value**: 必須、記録タイプに応じた検証
  - number/duration: 0以上の数値
  - text: 空でない文字列
  - boolean: boolean型
- **date**: 必須、正しい日付形式、未来の日付は不可
- **note**: 任意、500文字以内

### `isValidRecordForm(data: RecordFormData)`
フォームが有効かどうかをチェック。

## 状態管理層

### `useRecordForm(onSubmitSuccess?)`
フォームの状態管理、バリデーション、送信処理を統合。

**戻り値:**
```typescript
{
  formData: RecordFormData;
  errors: RecordFormErrors;
  isSubmitting: boolean;
  updateActivityId: (activityId: string) => void;
  updateValue: (value: ActivityValue) => void;
  updateDate: (date: string) => void;
  updateNote: (note: string) => void;
  resetForm: () => void;
  validate: () => boolean;
  handleSubmit: () => Promise<void>;
}
```

### `useActivities()`
アクティビティ一覧を取得するフック。

**戻り値:**
```typescript
{
  activities: ActivityDefinition[];  // アクティビティ一覧
  isLoading: boolean;                // 読み込み中フラグ
  error: Error | null;               // エラー
}
```

**特徴:**
- アーカイブされていないアクティビティのみを返す
- 現在はモックデータを使用
- 将来的にはAPI/ストアから取得

### `useActivity(activityId)`
特定のアクティビティを取得するフック。

## UI層 (`ui/record-forms/`)

### `ActivitySelect`
アクティビティ選択ドロップダウン。

**特徴:**
- `useActivities`フックでデータを取得
- 検索可能
- アイコン付きラベル表示（例: "🏃 ランニング"）
- アクティビティが存在しない場合は案内メッセージを表示
- 読み込み中はローディング表示

### `ValueInput`
値入力フィールド（動的に変化）。

**記録タイプ別の表示:**

#### 1. **number（数値型）**
- `NumberInput`コンポーネント
- 最小値: 0
- ステップ: 0.1
- 小数点2桁まで
- 単位をサフィックスとして表示

#### 2. **duration（時間型）**
- `NumberInput`コンポーネント
- 最小値: 0
- ステップ: 1（整数）
- サフィックス: "分"

#### 3. **boolean（実施/未実施）**
- `Checkbox`コンポーネント
- ラベル: "実施しました"
- 大きめのサイズ（md）
- 背景色付きのボックス

#### 4. **text（テキスト）**
- `Textarea`コンポーネント
- 3〜6行
- プレースホルダー: "メモや感想を入力"

**条件付き表示:**
- アクティビティ未選択: 案内メッセージ表示
- 読み込み中: 無効化された入力フィールド表示
- アクティビティ選択後: 記録タイプに応じた入力フィールド表示

### `DateField`
日付入力フィールド。

**特徴:**
- HTML5 date input
- デフォルト値: 今日の日付
- 最大値: 今日の日付（未来は選択不可）
- ダークモード対応（カレンダーアイコンを反転）

### `NoteField`
メモ入力フィールド。

**特徴:**
- 任意項目
- 3〜6行のテキストエリア
- 最大500文字
- プレースホルダー: "メモや感想を入力（500文字以内）"

### `RecordForm`
メインフォームコンポーネント。

**セクション構成:**
1. **アクティビティ**: アクティビティ選択
2. **記録内容**: 値入力、日付
3. **メモ**: メモ入力

**アクションボタン:**
- **キャンセル**: グレーのアウトラインボタン
- **記録を追加**: ティールの塗りつぶしボタン
  - アクティビティ未選択時は無効化

## モーダル統合 (`ui/modals/AddRecordModal.tsx`)

`AddRecordModal`に`RecordForm`を統合。

**フロー:**
1. 「記録を追加」ボタンをクリック
2. モーダルが開く
3. アクティビティを選択
4. 記録タイプに応じた入力フィールドが表示される
5. 値を入力
6. 日付を選択（デフォルトは今日）
7. 必要に応じてメモを入力
8. 「記録を追加」ボタンをクリック
9. バリデーション実行
10. 成功時: コンソールログ出力、モーダルを閉じる
11. エラー時: エラーメッセージを表示

## 使用例

### 数値型の記録追加（例: ランニング）

1. アクティビティ選択: "🏃 ランニング"
2. 値入力: `5.2 km`（NumberInput）
3. 日付: `2025-11-09`
4. メモ: "朝のジョギング。調子良かった。"
5. 送信 → 記録が追加される

### 時間型の記録追加（例: 読書）

1. アクティビティ選択: "📚 読書"
2. 時間入力: `30 分`（NumberInput）
3. 日付: `2025-11-09`
4. 送信 → 記録が追加される

### boolean型の記録追加（例: 瞑想）

1. アクティビティ選択: "🧘 瞑想"
2. チェックボックス: ✅ 実施しました
3. 日付: `2025-11-09`
4. 送信 → 記録が追加される

## レイヤー分離の詳細

### データ取得の分離

**アクティビティデータの取得:**
- `useActivities`フックに集約
- UIコンポーネント（`ActivitySelect`）はフックを呼ぶだけ
- データソースの変更（モック → API）はフック内のみ修正

**利点:**
- UIとデータ取得ロジックが分離
- テストが容易
- データソースの切り替えが簡単

### 条件付きレンダリングの分離

**値入力フィールドの動的表示:**
- `ValueInput`コンポーネント内で記録タイプをチェック
- `renderInputByType`関数で条件分岐を集約
- 各記録タイプに応じたコンポーネントを返す

**利点:**
- 条件分岐ロジックが一箇所に集約
- 新しい記録タイプの追加が容易
- 各入力フィールドの実装が独立

## バリデーションの詳細

### リアルタイムエラークリア

フィールドを変更すると、そのフィールドのエラーが自動的にクリアされる。

```typescript
const updateActivityId = useCallback((activityId: string) => {
  setFormData((prev) => ({ ...prev, activityId }));
  
  // エラーをクリア
  if (errors.activityId) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.activityId;
      return newErrors;
    });
  }
}, [errors.activityId]);
```

### 日付バリデーション

- 正しい形式（YYYY-MM-DD）
- 未来の日付は不可
- 必須項目

```typescript
// 未来の日付はエラー
const selectedDate = new Date(data.date);
const today = new Date();
today.setHours(23, 59, 59, 999);
if (selectedDate > today) {
  errors.date = '未来の日付は選択できません';
}
```

## スタイリング

### カラースキーム
- **背景**: `#1a1a1a`（ダークグレー）
- **入力フィールド**: `#2a2a2a`（ミディアムダークグレー）
- **ボーダー**: `#444`（グレー）
- **プライマリカラー**: `#4ECDC4`（ティール）
- **テキスト**: `#fff`（白）
- **ラベル**: `#ccc`（ライトグレー）

### 一貫性

アクティビティ作成フォームと同じスタイルガイドを使用し、
UIの一貫性を保っています。

## 今後の拡張予定

### Phase 2: データ永続化
- [ ] ローカルストレージへの保存
- [ ] 記録一覧の更新
- [ ] 成功通知の表示（Mantine Notifications）

### Phase 3: API連携
- [ ] バックエンドAPIへの送信
- [ ] エラーハンドリングの改善
- [ ] 楽観的UI更新

### Phase 4: 機能拡張
- [ ] 画像アップロード（image型の実装）
- [ ] 記録の編集機能
- [ ] 記録の削除機能
- [ ] 一括記録追加

### Phase 5: UX改善
- [ ] アクティビティクイック選択（最近使用したもの）
- [ ] 前回の値を提案
- [ ] 記録のコピー機能
- [ ] キーボードショートカット

## テスト

### 手動テスト手順

#### 1. 基本フロー

1. **「記録を追加」ボタンをクリック**
   - ✅ モーダルが開く

2. **アクティビティを選択**
   - ✅ ドロップダウンに既存のアクティビティが表示される
   - ✅ アイコン付きで表示される
   - ✅ 検索ができる

3. **値を入力（数値型の場合）**
   - ✅ NumberInputが表示される
   - ✅ 単位が表示される
   - ✅ 負の値は入力できない

4. **日付を選択**
   - ✅ デフォルトで今日の日付が選択されている
   - ✅ カレンダーから選択できる
   - ✅ 未来の日付は選択できない

5. **メモを入力（任意）**
   - ✅ テキストエリアが表示される
   - ✅ 500文字まで入力できる

6. **送信**
   - ✅ バリデーションが実行される
   - ✅ 成功時にコンソールにログが出力される
   - ✅ モーダルが閉じる

#### 2. 記録タイプ別テスト

**数値型（ランニング）:**
- ✅ NumberInputが表示される
- ✅ "km"が表示される
- ✅ 小数点入力可能

**時間型（読書）:**
- ✅ NumberInputが表示される
- ✅ "分"が表示される
- ✅ 整数のみ

**boolean型（瞑想）:**
- ✅ チェックボックスが表示される
- ✅ チェック/アンチェック可能

#### 3. バリデーションテスト

**アクティビティ未選択:**
- ✅ 送信ボタンが無効化される

**空の値で送信:**
- ✅ エラーメッセージが表示される

**未来の日付を選択:**
- ✅ エラーメッセージが表示される

**500文字以上のメモ:**
- ✅ エラーメッセージが表示される

#### 4. エラー回復テスト

**エラー後の入力:**
- ✅ フィールドを変更するとエラーがクリアされる

#### 5. キャンセルテスト

**キャンセルボタン:**
- ✅ モーダルが閉じる

**モーダル外をクリック:**
- ✅ モーダルが閉じる

## 実装のポイント

### 1. データフロー設計

アクティビティデータの流れを明確に設計：
```
mockActivityDefinitions
  ↓
useActivities (フィルタリング)
  ↓
ActivitySelect (表示)
  ↓
useActivity (詳細取得)
  ↓
ValueInput (記録タイプに応じた表示)
```

### 2. 型安全性

`ActivityValue`のUnion型を活用し、記録タイプごとに
適切な型チェックを実施。

```typescript
type ActivityValue =
  | { type: 'number'; value: number; unit?: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'text'; value: string }
  | { type: 'duration'; value: number; unit: 'minutes' };
```

### 3. 責任の分離

- **ActivitySelect**: アクティビティの選択のみ
- **ValueInput**: 選択されたアクティビティに基づく入力のみ
- **useActivities**: データ取得のみ
- **useRecordForm**: 状態管理のみ

各コンポーネント/フックが単一の責任を持つ。

## デバッグ

### コンソールログ

フォーム送信時に以下のログが出力されます：

```javascript
[Record Form] Submit: {
  activityId: "running-001",
  value: { type: "number", value: 5.2, unit: "km" },
  date: "2025-11-09",
  note: "朝のジョギング"
}
```

### エラーログ

送信エラー時：
```javascript
[Record Form] Submit error: Error: ...
```

## まとめ

記録追加フォームは、アクティビティ作成フォームと同様の
レイヤー構造を採用しつつ、以下の点で異なります：

1. **データ依存**: 既存のアクティビティデータを参照
2. **動的UI**: 記録タイプに応じてUIが変化
3. **デフォルト値**: 日付が今日で初期化

レイヤー分離により、各部分を独立してテスト・修正でき、
将来の拡張も容易になっています。
