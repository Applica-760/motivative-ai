# Grid Layout Feature

Appleウィジェット風のドラッグ&ドロップ可能なグリッドレイアウトシステム。

## 📁 ディレクトリ構造

```
grid-layout/
├── config/              # 設定ファイル
│   ├── gridConstants.ts # 定数定義（ギャップ、列数、閾値等）
│   └── index.ts
├── model/               # ビジネスロジック層
│   ├── gridCalculations.ts         # 計算ロジック
│   ├── gridCollisionDetection.ts   # 衝突検出
│   ├── gridStyleHelpers.ts         # スタイル決定
│   ├── gridStorageService.ts       # ストレージ抽象化
│   └── index.ts
├── hooks/               # カスタムフック
│   ├── useCellSize.ts   # セルサイズ計算
│   ├── useGridLayout.ts # レイアウト状態管理
│   ├── useAutoLayout.ts # 自動レイアウト計算
│   └── index.ts
├── types/               # 型定義
│   └── index.ts
├── ui/                  # UIコンポーネント
│   ├── DraggableGrid.tsx
│   ├── DraggableGridItem.tsx
│   └── index.ts
└── index.ts             # 外部エクスポート
```

## 🎯 アーキテクチャの特徴

### レイヤー分離

1. **UI層 (`ui/`)**
   - プレゼンテーションのみを担当
   - ビジネスロジックを含まない
   - Mantine UIコンポーネントを使用

2. **Model層 (`model/`)**
   - 純粋関数による計算ロジック
   - ストレージの抽象化
   - テスト可能な設計

3. **Hooks層 (`hooks/`)**
   - 状態管理とライフサイクル
   - UIとModelの橋渡し

4. **設定層 (`config/`)**
   - 定数の一元管理
   - マジックナンバーの排除

## 🚀 使用方法

### 基本的な使用

```tsx
import { DraggableGrid } from '@/features/grid-layout';
import type { GridItemConfig } from '@/features/grid-layout';

const items: GridItemConfig[] = [
  {
    id: 'widget-1',
    order: 1,
    size: 'small-square',
    position: { column: 1, row: 1, columnSpan: 1 },
    content: <MyWidget />,
  },
  {
    id: 'widget-2',
    order: 2,
    size: 'small-rectangle',
    position: { column: 1, row: 2, columnSpan: 2 },
    content: <AnotherWidget />,
  },
];

function MyPage() {
  return <DraggableGrid items={items} />;
}
```

### Container Query APIを使用したレスポンシブウィジェット

各グリッドアイテムは`containerType: 'size'`が設定されており、Container Query APIを使用できます。

```tsx
import { containerQuery } from '@/features/grid-layout';

function MyResponsiveWidget() {
  return (
    <Box
      style={{
        // Container Queryを使用してコンテナサイズに応じたスタイル
        fontSize: '16px',
        '@container': {
          [`${containerQuery.maxXs}`]: {
            fontSize: '12px',
            padding: '0.5rem',
          },
          [`${containerQuery.sm}`]: {
            fontSize: '14px',
            padding: '0.75rem',
          },
          [`${containerQuery.minMd}`]: {
            fontSize: '16px',
            padding: '1rem',
          },
        },
      }}
    >
      <h3>レスポンシブコンテンツ</h3>
      <p>コンテナサイズに応じてスタイルが変化します</p>
    </Box>
  );
}
```

### カスタムストレージの使用

```tsx
import { useGridLayout, InMemoryGridService } from '@/features/grid-layout';

function MyComponent() {
  const storageService = new InMemoryGridService();
  const { items, updateItemPosition, swapItems } = useGridLayout(
    initialItems,
    4, // 列数
    storageService
  );
  
  // カスタムロジック...
}
```

## 🧪 テスト

すべてのmodel層の関数はユニットテストでカバーされています。

```bash
# テスト実行
npm test

# カバレッジレポート
npm run test:coverage

# UIモード
npm run test:ui
```

### テストファイル

- `model/gridCalculations.test.ts` - 26テスト
- `model/gridCollisionDetection.test.ts` - 23テスト
- `model/gridStorageService.test.ts` - 23テスト

## 📊 主要な機能

### 計算ロジック (`model/gridCalculations.ts`)

```typescript
// セルサイズの計算
const cellSize = calculateCellSize(gridWidth, columns, gap);

// 新しい位置の計算
const newPosition = calculateNewPosition(currentPosition, delta, cellSize, columns);

// コンテナ高さの計算
const height = calculateContainerHeight(items, cellHeight);
```

### 衝突検出 (`model/gridCollisionDetection.ts`)

```typescript
// 衝突チェック
const hasCollision = checkCollision(newPosition, itemId, items);

// 境界チェック
const isValid = isWithinBounds(position, columns);

// スワップ位置の計算
const swapResult = calculateSwapPositions(activeItem, overItem, columns);
```

### ストレージサービス (`model/gridStorageService.ts`)

```typescript
// LocalStorage実装
const storage = new LocalStorageGridService('my-storage-key');

// メモリ実装（テスト用）
const storage = new InMemoryGridService();

// レイアウトの保存・読み込み
storage.saveLayout(layout);
const layout = storage.loadLayout();
```

## ⚙️ 設定 (`config/gridConstants.ts`)

```typescript
export const GRID_CONFIG = {
  GAP: 24,                    // グリッド間のギャップ（px）
  DESKTOP_COLUMNS: 4,         // デスクトップの列数
  MOBILE_COLUMNS: 2,          // モバイルの列数
  MOBILE_BREAKPOINT: 768,     // ブレークポイント（px）
  DRAG_THRESHOLD: 10,         // ドラッグ検出の最小移動距離
  HOVER_TRANSLATE_Y: -4,      // ホバー時の移動距離
  DRAG_HANDLE_ICON: '⋮⋮',    // ドラッグハンドルアイコン
  DRAGGING_OPACITY: 0.5,      // ドラッグ中の不透明度
  DRAG_OVERLAY_OPACITY: 0.8,  // オーバーレイの不透明度
  
  // Container Queryのブレークポイント
  CONTAINER_BREAKPOINTS: {
    XS: 200,   // 極小サイズ（~200px）
    SM: 300,   // 小サイズ（~300px）
    MD: 400,   // 中サイズ（~400px）
    LG: 600,   // 大サイズ（~600px）
    XL: 800,   // 特大サイズ（800px~）
  },
};

// Container Query用のヘルパー
export const containerQuery = {
  maxXs: '(max-width: 200px)',
  sm: '(min-width: 201px) and (max-width: 300px)',
  md: '(min-width: 301px) and (max-width: 400px)',
  lg: '(min-width: 401px) and (max-width: 600px)',
  xl: '(min-width: 601px)',
  minSm: '(min-width: 300px)',
  minMd: '(min-width: 400px)',
  minLg: '(min-width: 600px)',
  minXl: '(min-width: 800px)',
  // ... etc
};
```

## 🎨 スタイルカスタマイズ

### カスタムシャドウ

```typescript
const item: GridItemConfig = {
  id: 'custom-shadow',
  // ...
  customShadow: {
    default: '0 2px 4px rgba(0,0,0,0.1)',
    hover: '0 8px 16px rgba(0,0,0,0.2)',
  },
};
```

### 背景色

```typescript
const item: GridItemConfig = {
  id: 'colored-item',
  // ...
  backgroundColor: '#f0f0f0',
};
```

## 🔄 データフロー

```
1. DraggableGrid
   ↓ (items)
2. useGridLayout
   ↓ (state管理)
3. LocalStorageGridService
   ↓ (永続化)
4. model/gridCalculations
   ↓ (計算)
5. ui/DraggableGridItem
   ↓ (表示)
```

## 🐛 トラブルシューティング

### 位置がずれる

- `GRID_CONFIG.GAP`が正しく設定されているか確認
- ブラウザのDevToolsでセルサイズを確認

### ドラッグが効かない

- `GRID_CONFIG.DRAG_THRESHOLD`を調整
- ドラッグハンドルが正しく配置されているか確認

### 衝突検出が誤動作

- `checkCollision()`のロジックを確認
- テストケースで期待動作を検証

## 📚 関連ドキュメント

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - プロジェクト全体のアーキテクチャ
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md) - コーディング規約

## 🤝 コントリビューション

新しいウィジェットを追加する場合:

1. `features/your-feature/` ディレクトリを作成
2. ウィジェットコンポーネントを実装
3. `home/config/dashboardConfig.tsx` に登録
4. レイアウトをテスト

## ⚡️ パフォーマンス最適化

- `useCellSize`: リサイズイベントを最適化済み
- `useGridLayout`: 不要な再レンダリングを防止
- 純粋関数: メモ化可能な設計

## 📝 ライセンス

このプロジェクトのライセンスに従います。
