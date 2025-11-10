# グリッドレイアウト改善: 自由配置機能の実装

## 概要

Appleウィジェット風の自由配置が可能なグリッドレイアウトシステムを実装しました。
これにより、ウィジェットを上詰め・左詰めせずに、任意の位置に配置できるようになりました。

## 最新の修正（重要）

### グリッド要素のサイズ計算の修正

**問題:**
- `size`プロパティ（`small-square`, `small-rectangle`）に基づいてアスペクト比を計算していた
- `position.columnSpan`との不整合により、要素が意図しないサイズで表示される

**修正内容:**
- **`position.columnSpan`を信頼できる唯一の情報源とする**
- アスペクト比を`columnSpan / 1`で計算
  - `columnSpan: 1` → `1:1`（正方形）
  - `columnSpan: 2` → `2:1`（長方形）
- 列の境界チェックを改善: `Math.min(columns - columnSpan + 1, ...)`

```typescript
// DraggableGridItem.tsx
const columnSpan = item.position.columnSpan;
const style = {
  transform: CSS.Translate.toString(transform),
  width: '100%',
  aspectRatio: `${columnSpan} / 1`, // columnSpanに基づく
};
```

## 主な変更点

### 1. `useGridLayout` フック

**変更前の問題点:**
- `assignGridPositions`関数が、ドラッグ&ドロップ後に自動的に左上から順に詰めて配置してしまう
- `order`プロパティのみをlocalStorageに保存し、位置情報が保存されない

**変更後:**
- 各ウィジェットの位置情報（`column`, `row`）をlocalStorageに永続化
- 自動配置ロジックを削除し、ユーザーが配置した位置を保持
- `updateItemPosition`: 単一アイテムの位置を更新
- `swapItems`: 2つのアイテムの位置を入れ替え

```typescript
// 保存されるレイアウト情報
interface SavedLayout {
  positions: Record<string, GridPosition>;
}
```

### 2. `DraggableGrid` コンポーネント

**変更前の問題点:**
- `@dnd-kit/sortable`の`verticalListSortingStrategy`を使用
- リスト型のソート戦略で、グリッド配置には不適切

**変更後:**
- `@dnd-kit/core`の基本的なドラッグ機能を直接使用
- `pointerWithin`衝突検出アルゴリズムを採用
- ドラッグの移動量（delta）から新しいグリッド位置を計算
- `DragOverlay`でドラッグ中のプレビューを表示

**ドラッグ動作:**
1. **他のウィジェット上にドロップ**: 2つのウィジェットの位置を入れ替え
2. **空いているスペースにドロップ**: 移動量から新しい位置を計算して配置

```typescript
// 移動量から新しい位置を計算
const columnDelta = Math.round(delta.x / (cellSize.width + gap));
const rowDelta = Math.round(delta.y / (cellSize.height + gap));
```

### 3. `DraggableGridItem` コンポーネント

**変更前の問題点:**
- `useSortable`フックを使用（リストソート用）

**変更後:**
- `useDraggable`と`useDroppable`を直接使用
- グリッド配置に最適化されたドラッグ&ドロップ動作

## 使用方法

### 基本的な使い方

各featureで初期位置を指定してウィジェットを配置：

```tsx
// features/actions/config/gridConfig.tsx
export function createActionGridItems(): GridItemConfig[] {
  return [
    {
      id: 'add-record',
      order: 0,
      size: 'small-square',
      position: { column: 1, row: 1, columnSpan: 1 }, // 1列目、1行目
      content: <AddRecordWidget />,
    },
    {
      id: 'new-activity',
      order: 1,
      size: 'small-square',
      position: { column: 2, row: 1, columnSpan: 1 }, // 2列目、1行目
      content: <NewActivityWidget />,
    },
  ];
}
```

### ウィジェットの自由配置

ユーザーは以下の方法でウィジェットを配置できます：

1. **ドラッグハンドル（⋮⋮）をクリック**してドラッグ開始
2. **他のウィジェット上にドロップ**すると位置を入れ替え
3. **空いているスペースにドロップ**すると移動先に配置

配置した位置はlocalStorageに自動保存され、次回アクセス時に復元されます。

## グリッドシステムの仕様

### グリッドレイアウト
- **デスクトップ**: 4列グリッド
- **モバイル**: 2列グリッド
- **セルサイズ**: 正方形（1:1比率）
- **ギャップ**: 24px（`--mantine-spacing-xl`）

### ウィジェットサイズ
- `small-square`: 1列×1行（正方形）
- `small-rectangle`: 2列×1行（長方形）

### 位置情報
```typescript
interface GridPosition {
  column: number;      // 列位置（1-4 デスクトップ、1-2 モバイル）
  row: number;         // 行位置（1-n）
  columnSpan: 1 | 2;   // 列のスパン数
}
```

## localStorage構造

```json
{
  "GRID_LAYOUT_ORDER": {
    "positions": {
      "add-record": { "column": 1, "row": 1, "columnSpan": 1 },
      "new-activity": { "column": 2, "row": 1, "columnSpan": 1 },
      "reading-chart": { "column": 1, "row": 2, "columnSpan": 2 }
    }
  }
}
```

## 今後の拡張可能性

### 1. リサイズ機能
ウィジェットのサイズを動的に変更できる機能を追加可能：
```typescript
const resizeItem = (itemId: string, newColumnSpan: 1 | 2) => {
  // 実装予定
};
```

### 2. 衝突検出
ウィジェット同士の重なりを検出し、自動で調整：
```typescript
const checkCollision = (position: GridPosition): boolean => {
  // 実装予定
};
```

### 3. スナップ機能の強化
グリッド線にピッタリ吸い付くような視覚的フィードバック：
- ドラッグ中にグリッド線をハイライト
- ドロップ可能エリアの可視化

### 4. アニメーション改善
- ウィジェット移動時のスムーズなアニメーション
- 位置入れ替え時の視覚的フィードバック

## トラブルシューティング

### ウィジェットが意図した位置に配置されない
- localStorageをクリアしてリロード
- ブラウザの開発者ツールで`localStorage.clear()`を実行

### ドラッグが反応しない
- ドラッグハンドル（⋮⋮）を確実にクリックしているか確認
- ブラウザの互換性を確認（モダンブラウザ推奨）

## 参考リンク

- [dnd-kit Documentation](https://docs.dndkit.com/)
- [Apple Human Interface Guidelines - Widgets](https://developer.apple.com/design/human-interface-guidelines/widgets)
