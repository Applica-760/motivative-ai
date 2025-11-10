# Motivative AI - アーキテクチャドキュメント

## プロジェクト概要

React + TypeScript + Mantine UIを使用したダッシュボードアプリケーション。  
グリッドレイアウトシステムを採用し、各機能が独立したウィジェットとして情報を注入できる拡張可能な設計。

## 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **UIライブラリ**: Mantine UI v8
- **ドラッグ&ドロップ**: @dnd-kit
- **チャート**: Recharts + @mantine/charts
- **ビルドツール**: Vite
- **認証**: Firebase Authentication
- **データベース**: Firebase Firestore / LocalStorage
- **テスト**: Vitest

## プロジェクト構造

```
src/
├── App.tsx                    # アプリケーションのエントリーポイント
├── main.tsx                   # Reactのマウントポイント
├── features/                  # 機能モジュール（Feature-Sliced Design）
│   ├── grid-layout/          # グリッドレイアウトシステム
│   ├── home/                 # ホーム画面
│   ├── activity/             # アクティビティ管理
│   ├── auth/                 # 認証機能
│   ├── graph/                # グラフ表示
│   └── actions/              # アクション系ウィジェット
└── shared/                   # 共通リソース
    ├── components/           # 共通UIコンポーネント
    ├── config/               # アプリ全体の設定
    ├── services/             # サービス層（Storage, etc.）
    └── types/                # 共通型定義
```

## グリッドレイアウトシステム

### 概要

アプリケーションのコア機能。各featureが`GridItemConfig`を提供することで、グリッドに情報を注入できる。

### 主要コンポーネント

#### `grid-layout/` フォルダ構造

```
grid-layout/
├── types/
│   └── index.ts              # 型定義
├── hooks/
│   └── useGridLayout.ts      # レイアウト状態管理
└── ui/
    ├── DraggableGrid.tsx     # グリッドコンテナ
    └── DraggableGridItem.tsx # グリッドアイテム
```

#### `GridItemConfig` 型

各featureがグリッドに注入する設定オブジェクト:

```typescript
interface GridItemConfig {
  id: string;                // 一意なID
  order: number;             // 表示順序
  size: GridItemSize;        // 'small' | 'full-width'
  content: ReactNode;        // 表示するウィジェット
  backgroundColor?: string;  // 背景色
  customShadow?: {...};      // カスタムシャドウ
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // 標準シャドウ
}
```

#### サイズ仕様

- **`small`**: 正方形（1:1）、2列レイアウト時に横並び配置
- **`full-width`**: 横長の長方形、全幅表示

#### `DraggableGrid`

- ドラッグ&ドロップによる並び替え機能
- `small`サイズのアイテムを2つずつグループ化して横並び表示
- 並び順をlocalStorageに自動保存

#### `useGridLayout`

- グリッドアイテムの順序管理
- localStorageへの永続化
- 初期データとの同期処理

### 使用例

```tsx
// 1. GridItemConfigを作成
const gridItems: GridItemConfig[] = [
  {
    id: 'widget-1',
    order: 0,
    size: 'small',
    content: <MyWidget />,
    backgroundColor: '#fff',
  },
];

// 2. DraggableGridに渡す
<DraggableGrid items={gridItems} />
```

## 各Featureの役割

### `home/` - ホーム画面

メイン画面の全体構成を管理。

```
home/
├── config/
│   └── dashboardConfig.tsx   # グリッドアイテムの生成ロジック
├── model/
│   ├── types.ts              # データ型定義
│   ├── mockData.ts           # モックデータ
│   └── useHomeData.ts        # データ取得フック
└── ui/
    ├── HomePage.tsx          # 3カラムレイアウト（ヘッダー + サイドバー）
    ├── MainContent.tsx       # メインコンテンツ（グリッド表示）
    ├── LeftSidebar.tsx       # 左サイドバー
    └── RightSidebar.tsx      # 右サイドバー
```

#### `dashboardConfig.tsx`

**重要**: 各featureのウィジェットをグリッドに統合する設定ファイル

- `createDashboardGridItems()`: データから`GridItemConfig[]`を生成
- 各ウィジェットの順序、サイズ、背景色を定義

### `activity/` - アクティビティ管理

アクティビティの作成、編集、記録の管理を行う。

```
activity/
├── api/
│   └── repositories/             # Repository層（データアクセス）
│       ├── types.ts              # Repository インターフェース
│       ├── ActivityRepositoryImpl.ts
│       └── RecordRepositoryImpl.ts
├── config/
│   └── constants.ts              # 定数定義
├── hooks/
│   ├── useActivities.ts          # アクティビティ管理フック
│   ├── useActivityForm.ts        # フォーム管理
│   └── useRecordForm.ts          # 記録フォーム管理
├── model/
│   ├── ActivityContext.tsx       # グローバル状態管理
│   ├── validation.ts             # バリデーションロジック
│   └── types.ts                  # 型定義
└── ui/
    ├── buttons/                  # ボタンコンポーネント
    ├── charts/                   # チャート表示
    ├── forms/                    # フォーム
    └── modals/                   # モーダル
```

#### アーキテクチャ（3層構造）

```
Presentation Layer (ActivityContext)
    ↓ uses
Domain Layer (Repository)
    ↓ uses
Infrastructure Layer (StorageService)
```

### `auth/` - 認証機能

Firebase認証の統合とログイン状態の管理。

```
auth/
├── api/
│   ├── FirebaseAuthService.ts    # Firebase認証サービス
│   └── MockAuthService.ts        # テスト用モック
├── model/
│   ├── AuthContext.tsx           # 認証状態管理
│   └── types.ts                  # 型定義
└── ui/
    ├── AuthModal.tsx             # ログイン/サインアップモーダル
    └── components/               # フォームコンポーネント
```

### `actions/` - アクション系ウィジェット

ユーザーの操作を促すウィジェット群。

```
actions/
└── ui/
    ├── AddRecordWidget.tsx       # 記録追加ウィジェット
    ├── NewActivityWidget.tsx     # 新規アクティビティウィジェット
    └── ActionButtonsWidget.tsx   # アクションボタン群
```


- **サイズ**: `small`（正方形）
- **特徴**: カスタムシャドウでホバー時のアニメーション

### `graph/` - グラフ表示

データ可視化を担当。プレゼンテーション専用のfeature。

```
graph/
├── config/
│   └── gridConfig.tsx           # グリッド設定
├── model/
│   └── index.ts                 # 型の再エクスポート
└── ui/
    ├── ActivityChart.tsx        # チャート本体（タイトル付き）
    ├── ActivityChartWidget.tsx  # チャートウィジェットラッパー
    ├── ChartFactory.tsx         # チャート種別の切り替え
    ├── LineChart.tsx            # 折れ線グラフ
    └── BarChart.tsx             # 棒グラフ
```

- **サイズ**: `small-rectangle`（横長2列分）
- **特徴**: recharts + @mantine/chartsで可視化
- **データソース**: `activity` featureから変換済みデータを受け取る

### `shared/` - 共通リソース

全featureで使用可能な共通コード。
```

- **サイズ**: `full-width`（横長）
- **特徴**: recharts + @mantine/chartsで可視化

### `shared/` - 共通リソース

全featureで使用可能な共通コード。

```
shared/
├── components/              # 共通UIコンポーネント
│   ├── ChartCard/
│   └── QuickActionButton/
├── config/
│   ├── colors.ts           # カラーパレット定義
│   ├── firebase.ts         # Firebase設定
│   └── storage.ts          # ストレージキー定義
├── services/
│   └── storage/            # ストレージサービス層
│       ├── types.ts        # StorageService インターフェース
│       ├── LocalStorageService.ts
│       ├── FirebaseStorageService.ts
│       └── StorageProvider.tsx
└── types/
    ├── activity.ts         # アクティビティ型定義
    └── chart.ts            # チャート型定義
```

## データフロー

### アクティビティデータ

```
AuthContext (auth/model)
    ↓ user state
StorageProvider (shared/services)
    ↓ auto-switch (LocalStorage / Firebase)
ActivityRepository (activity/api/repositories)
    ↓ business logic
ActivityContext (activity/model)
    ↓ React Context
UI Components (activity/ui)
```

### グリッド表示フロー

```
useHomeData (home/model)
    ↓
ActivityData[] (アクティビティデータ)
    ↓
createDashboardGridItems (home/config)
    ↓
GridItemConfig[] (グリッド設定)
    ↓
DraggableGrid (grid-layout)
    ↓
DraggableGridItem × N (各ウィジェット表示)
```

## 新しいウィジェットの追加手順

1. **ウィジェットコンポーネントを作成**
   ```tsx
   // src/features/my-feature/ui/MyWidget.tsx
   export function MyWidget() {
     return <div>My Widget Content</div>;
   }
   ```

2. **`dashboardConfig.tsx`に追加**
   ```tsx
   import { MyWidget } from '@/features/my-feature';
   
   const newItem: GridItemConfig = {
     id: 'my-widget',
     order: 3,
     size: 'small', // または 'full-width'
     content: <MyWidget />,
     backgroundColor: colors.gridItem.default,
   };
   ```

3. **自動的にグリッドに表示される**

## ディレクトリ命名規則

各featureフォルダは以下の構造を推奨:

- **`ui/`**: UIコンポーネント
- **`model/`**: ビジネスロジック、データ取得、型定義
- **`api/`**: API通信
- **`config/`**: 設定ファイル
- **`hooks/`**: カスタムフック

## レイアウト仕様

### ページ全体レイアウト

- **3カラムグリッド**: `minmax(200px, 350px) minmax(600px, 1fr) minmax(200px, 350px)`
- **左**: サイドバー（200-350px）
- **中央**: メインコンテンツ（600px〜可変）
- **右**: サイドバー（200-350px）

### グリッドレイアウト

- **最大幅**: 700px
- **間隔**: `xl`（Mantineのスペーシング）
- **アイテム間マージン**: `mb="xl"`

## 状態管理

### グローバル状態

- **認証状態**: `AuthContext` (Firebase Authentication)
- **アクティビティ状態**: `ActivityContext` (Activity + Records)
- **ストレージ**: `StorageProvider` (依存性注入)

### ローカル状態

- **グリッド順序**: localStorage（`grid-layout-order`キー）
- **フォーム状態**: 各コンポーネントのReactフック

### ストレージサービス層

```typescript
interface StorageService {
  // Activities
  getActivities(): Promise<ActivityDefinition[]>
  saveActivity(activity: ActivityDefinition): Promise<void>
  deleteActivity(id: string): Promise<void>
  
  // Records
  getRecords(): Promise<ActivityRecord[]>
  saveRecord(record: ActivityRecord): Promise<void>
  deleteRecord(id: string): Promise<void>
  
  // Grid Layout
  getGridLayout(): Promise<SavedLayout | null>
  saveGridLayout(layout: SavedLayout): Promise<void>
}
```

**実装:**
- `LocalStorageService`: localStorage基盤（未ログイン時）
- `FirebaseStorageService`: Firestore基盤（ログイン時）

**自動切り替え:**
ログイン状態に応じて`StorageProvider`が自動的に適切な実装を選択

## 今後の拡張ポイント

1. ~~**API統合**: モックデータを実APIに置き換え~~ ✅ Repository層実装完了
2. ~~**認証機能**: Firebase Authentication統合~~ ✅ 実装完了
3. ~~**データ永続化**: Firestoreとの連携~~ ✅ StorageService実装完了
4. **ウィジェットの追加**: 新機能を`features/`に追加
5. **サイズバリエーション**: `medium`, `large`サイズの実装
6. **レスポンシブ対応**: モバイル向けレイアウト調整
7. **リアルタイム同期**: Firestoreのリアルタイム更新
8. **オフライン対応**: PWA化とオフラインキャッシュ

## 開発時の注意点

### 新規ウィジェット作成時

- ✅ `GridItemConfig`経由でグリッドに注入
- ✅ `features/`配下に機能単位でフォルダを作成
- ✅ `dashboardConfig.tsx`で統合

### グリッドシステム変更時

- ⚠️ `grid-layout/types/index.ts`の型定義を確認
- ⚠️ ドラッグ&ドロップの動作テスト
- ⚠️ localStorageのキャッシュクリアが必要な場合あり

### スタイリング

- Mantine UIのテーマシステムを優先
- `shared/config/colors.ts`で共通カラーを管理
- カスタムシャドウは`GridItemConfig.customShadow`で指定
