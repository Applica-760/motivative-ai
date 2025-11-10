# アクティビティ作成フォーム

## 概要

新しいアクティビティを作成するための完全なフォーム実装。
適切なレイヤー分離により、保守性と拡張性を確保しています。

## アーキテクチャ

### レイヤー構成

```
features/activity/
├── model/              # ビジネスロジック・型定義層
│   ├── formTypes.ts   # フォームの型定義
│   └── validation.ts  # バリデーションロジック
├── config/            # 設定・定数層
│   └── formConstants.ts # フォームの定数（アイコン、カラーなど）
├── hooks/             # カスタムフック層
│   └── useActivityForm.ts # フォーム状態管理
└── ui/                # UI層
    ├── forms/         # フォームコンポーネント
    │   ├── ActivityForm.tsx      # メインフォーム
    │   ├── TitleField.tsx        # アクティビティ名入力
    │   ├── IconPicker.tsx        # アイコン選択
    │   ├── ValueTypeSelect.tsx   # 記録タイプ選択
    │   ├── UnitField.tsx         # 単位入力
    │   └── ColorPicker.tsx       # カラー選択
    └── modals/
        └── CreateActivityModal.tsx # モーダルラッパー
```

## データフロー

```
CreateActivityModal
  ↓
ActivityForm (UIコンポーネント統合)
  ↓
useActivityForm (状態管理・バリデーション)
  ↓
validation.ts (バリデーションロジック)
  ↓
formTypes.ts (型定義)
```

## 型定義層 (`model/formTypes.ts`)

### `ActivityFormData`
フォームの入力データを表す型。

```typescript
interface ActivityFormData {
  title: string;           // アクティビティ名
  icon: string;            // 絵文字アイコン
  valueType: ActivityValueType; // 記録タイプ
  unit?: string;           // 単位（数値型・期間型の場合）
  color: string;           // 表示カラー
}
```

### `ActivityFormErrors`
バリデーションエラーを表す型。

### `ActivityFormState`
フォーム全体の状態を表す型。

## 定数層 (`config/formConstants.ts`)

### `ACTIVITY_ICONS`
選択可能なアイコン（絵文字）のリスト。
- 運動系: 🏃 💪 🚴 🏊 🧘 🤸
- 学習・趣味系: 📚 ✍️ 💻 🎨 🎵 🎮
- 健康・食事系: 💧 🥗 ☕ 🍎 🥤 🍵
- 生活習慣系: 😴 🛌 ⏰ 🌅 🌙 ✨
- 仕事系: 💼 📊 📝 📧 📞 🤝
- 目標・モチベーション系: 🎯 ⭐ 🏆 💎 🔥 ❤️

### `ACTIVITY_COLORS`
カラーパレット（12色）。

### `VALUE_TYPE_OPTIONS`
記録タイプの選択肢。
- **数値** (number): 距離、回数などの数値を記録
- **時間** (duration): 活動時間を分単位で記録
- **実施/未実施** (boolean): やった・やらなかったを記録
- **テキスト** (text): メモや感想を記録

### `NUMBER_UNIT_PRESETS`
数値型で使用できる単位のプリセット。
例: 回、km、m、歩、kcal、L、ページなど

### `DEFAULT_FORM_VALUES`
フォームのデフォルト値。

## バリデーション層 (`model/validation.ts`)

### `validateActivityForm(data: ActivityFormData)`
フォームデータをバリデーションし、エラーを返す。

**バリデーションルール:**
- **title**: 必須、50文字以内
- **icon**: 必須
- **valueType**: 必須
- **unit**: 数値型・期間型の場合は必須
- **color**: 必須、正しい16進数カラーコード

### `isValidActivityForm(data: ActivityFormData)`
フォームが有効かどうかをチェック。

## 状態管理層 (`hooks/useActivityForm.ts`)

### `useActivityForm(onSubmitSuccess?)`
フォームの状態管理、バリデーション、送信処理を統合。

**戻り値:**
```typescript
{
  formData: ActivityFormData;
  errors: ActivityFormErrors;
  isSubmitting: boolean;
  updateField: (field, value) => void;
  resetForm: () => void;
  validate: () => boolean;
  handleSubmit: () => Promise<void>;
}
```

**機能:**
- フィールド更新時に該当フィールドのエラーを自動クリア
- 送信前にバリデーション実行
- 送信成功後にフォームをリセット
- エラーハンドリング

## UI層 (`ui/forms/`)

### `TitleField`
アクティビティ名入力フィールド。
- プレースホルダー: "例: ランニング、読書、筋トレ"
- 最大50文字

### `IconPicker`
アイコン選択UI。
- 6列グリッドレイアウト
- 選択中のアイコンはハイライト表示
- ホバー時にスケールアップ

### `ValueTypeSelect`
記録タイプ選択UI。
- ラジオボタン形式
- 各オプションにアイコンと説明を表示
- 選択中のオプションは枠線でハイライト

### `UnitField`
単位入力フィールド。
- 数値型・期間型の場合のみ表示
- 期間型の場合は「分」で固定
- 数値型の場合はプリセットから選択可能（検索可能）

### `ColorPicker`
カラー選択UI。
- 6列グリッドレイアウト
- 選択中のカラーは白枠でハイライト
- ホバー時にスケールアップ

### `ActivityForm`
メインフォームコンポーネント。

**セクション構成:**
1. **基本情報**: アクティビティ名、アイコン
2. **記録設定**: 記録タイプ、単位
3. **デザイン**: カラー

**アクションボタン:**
- **キャンセル**: グレーのアウトラインボタン
- **作成する**: ティールの塗りつぶしボタン

## モーダル統合 (`ui/modals/CreateActivityModal.tsx`)

`CreateActivityModal`に`ActivityForm`を統合。

**フロー:**
1. ユーザーがボタンをクリック
2. モーダルが開く
3. フォームに入力
4. 「作成する」ボタンをクリック
5. バリデーション実行
6. 成功時: コンソールログ出力、モーダルを閉じる
7. エラー時: エラーメッセージを表示

## 使用方法

### 基本的な使用

```tsx
import { CreateActivityButton } from '@/features/activity';

// ボタンをクリックするだけで自動的にモーダルが開く
<CreateActivityButton />
```

### カスタマイズ

```tsx
import { ActivityForm } from '@/features/activity/ui/forms';

function MyComponent() {
  const handleSuccess = (data) => {
    console.log('Created:', data);
    // アクティビティをストアに追加
    // 通知を表示
  };

  return (
    <ActivityForm 
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
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

### レスポンシブ
- アイコングリッド: 6列固定
- カラーグリッド: 6列固定
- フォームは縦スクロール対応

## バリデーションエラー例

```typescript
// タイトルが空
{ title: 'アクティビティ名を入力してください' }

// タイトルが長すぎる
{ title: 'アクティビティ名は50文字以内で入力してください' }

// 単位が未入力（数値型の場合）
{ unit: '単位を入力してください' }

// カラーコードが不正
{ color: '正しいカラーコードを入力してください' }
```

## 今後の拡張予定

### Phase 2: データ永続化
- [ ] ローカルストレージへの保存
- [ ] アクティビティ一覧の更新
- [ ] 成功通知の表示

### Phase 3: API連携
- [ ] バックエンドAPIへの送信
- [ ] エラーハンドリングの改善
- [ ] 楽観的UI更新

### Phase 4: 追加機能
- [ ] 目標設定フィールド
- [ ] 通知設定
- [ ] テンプレート機能
- [ ] カスタムアイコンのアップロード

## テスト

### 手動テスト手順

1. **「新しいアクティビティ」ボタンをクリック**
   - ✅ モーダルが開く

2. **各フィールドに入力**
   - ✅ アクティビティ名を入力
   - ✅ アイコンを選択
   - ✅ 記録タイプを選択
   - ✅ 単位を選択（数値型の場合）
   - ✅ カラーを選択

3. **バリデーション**
   - ✅ 空のフィールドで送信 → エラー表示
   - ✅ 51文字以上のタイトル → エラー表示
   - ✅ すべて入力して送信 → 成功

4. **キャンセル**
   - ✅ キャンセルボタン → モーダルが閉じる
   - ✅ モーダル外をクリック → モーダルが閉じる

## 開発者向けメモ

### レイヤー分離の理由

1. **型定義層**: データ構造を明確にし、型安全性を確保
2. **定数層**: マジックナンバー・マジックストリングを排除
3. **バリデーション層**: ビジネスルールをUIから分離
4. **状態管理層**: フォームロジックをUIから分離
5. **UI層**: プレゼンテーションのみに集中

### 各コンポーネントの責任

- **フィールドコンポーネント**: 単一フィールドの表示とイベント伝播
- **ActivityForm**: フィールドの配置とフック呼び出し
- **useActivityForm**: 状態管理とビジネスロジック
- **validation**: バリデーションルールの定義

この分離により、各レイヤーを独立してテスト・修正できます。
