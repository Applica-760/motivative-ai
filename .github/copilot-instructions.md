# GitHub Copilot Instructions for Motivative AI

## プロジェクト概要

このプロジェクトは、React + TypeScript + Mantine UIを使用したダッシュボードアプリケーションです。
グリッドレイアウトシステムを中心に、各機能が独立したウィジェットとして動作する拡張可能な設計を採用しています。

詳細は`ARCHITECTURE.md`を参照してください。

## 技術スタック

- **React 19** + TypeScript
- **Mantine UI v8** - UIコンポーネントライブラリ
- **@dnd-kit** - ドラッグ&ドロップ
- **Recharts** + @mantine/charts - データ可視化
- **Vite** - ビルドツール
- **Firebase** - 認証とデータストレージ
- **Vitest** - テストフレームワーク

## コーディング規約

### 全般

- TypeScriptの型安全性を最大限活用する
- `any`型は原則使用しない
- ESLintのルールに従う
- 関数コンポーネント + hooksを使用（クラスコンポーネント不使用）

### ファイル命名

- コンポーネント: PascalCase（例: `DraggableGrid.tsx`）
- フック: camelCase（例: `useGridLayout.ts`）
- 型定義: PascalCase（例: `GridItemConfig`）
- 定数: UPPER_SNAKE_CASE（例: `STORAGE_KEY`）

### インポート順序

```typescript
// 1. 外部ライブラリ
import { useState } from 'react';
import { Box, Paper } from '@mantine/core';

// 2. 内部モジュール（@/から始まるエイリアス）
import { DraggableGrid } from '@/features/grid-item';
import { colors } from '@/shared/config';

// 3. 相対パス
import { useHomeData } from '../model';
import type { ActivityData } from './types';
```

### コンポーネント設計

#### Feature構造

各featureは以下の構造を推奨:

```
features/
└── feature-name/
    ├── index.ts           # 外部へのエクスポート
    ├── ui/                # UIコンポーネント
    ├── model/             # ビジネスロジック、型定義
    ├── api/               # API通信・Repository層
    ├── hooks/             # カスタムフック
    └── config/            # 設定ファイル
```

#### 3層アーキテクチャ

プロジェクトは以下の3層アーキテクチャを採用しています:

```
┌─────────────────────────────────────────┐
│   Presentation Layer                     │
│   - React Components                     │
│   - Context (ActivityContext, etc.)      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   Domain Layer                           │
│   - Repository (ActivityRepository)      │
│   - Business Logic                       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   Infrastructure Layer                   │
│   - StorageService                       │
│   - LocalStorageService                  │
│   - FirebaseStorageService               │
└─────────────────────────────────────────┘
```

**重要な原則:**
- Presentation層は、Repositoryを通してデータにアクセス
- Repository層は、StorageServiceを通してデータを永続化
- StorageServiceの実装は、ログイン状態に応じて自動切り替え

#### コンポーネントテンプレート

```tsx
import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

interface MyComponentProps {
  /** 必須プロパティの説明 */
  title: string;
  /** オプショナルプロパティの説明 */
  children?: ReactNode;
}

/**
 * コンポーネントの説明
 */
export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <Box>
      <h2>{title}</h2>
      {children}
    </Box>
  );
}
```

### 型定義

- すべてのコンポーネントpropsに型定義を付ける
- `interface`を優先（拡張可能性のため）
- 型は別ファイル（`types.ts`）に分離するか、同一ファイル内で定義
- エクスポートする型には必ずJSDocコメントを付ける

```typescript
/**
 * グリッドアイテムの設定
 */
export interface GridItemConfig {
  /** アイテムの一意なID */
  id: string;
  /** 表示順序 */
  order: number;
  /** アイテムのサイズ */
  size: GridItemSize;
}
```

### カスタムフック

- プレフィックスに`use`を付ける
- 戻り値はオブジェクトで返す（配列の場合は最大2つまで）
- 副作用は明示的に

```typescript
export function useMyData() {
  const [data, setData] = useState<MyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // ... ロジック
  
  return {
    data,
    isLoading,
    refetch,
  };
}
```

## グリッドレイアウトシステム

### 新しいウィジェットの追加

1. **ウィジェットを`features/`配下に作成**
   ```tsx
   // src/features/my-feature/ui/MyWidget.tsx
   export function MyWidget() {
     return <div>Content</div>;
   }
   ```

2. **`home/config/dashboardConfig.tsx`に追加**
   ```tsx
   import { MyWidget } from '@/features/my-feature';
   
   // createDashboardGridItems関数内で
   {
     id: 'my-widget',
     order: 3,
     size: 'small', // または 'full-width'
     content: <MyWidget />,
     backgroundColor: colors.gridItem.default,
   }
   ```

### GridItemConfig の仕様

- **`size: 'small'`**: 正方形（1:1）、2つ並べて表示
- **`size: 'full-width'`**: 横長の長方形、全幅表示
- **`backgroundColor`**: 背景色を指定（オプション）
- **`customShadow`**: ホバー時のシャドウアニメーション（オプション）
- **`shadow`**: Mantineの標準シャドウ（オプション）

## Mantine UI の使用

### スタイリング

- インラインスタイルまたはMantineのprops経由でスタイルを適用
- `style`プロパティで直接CSSを指定可能
- テーマカラーは`shared/config/colors.ts`で管理

```tsx
// Good
<Box style={{ padding: '1rem', backgroundColor: colors.gridItem.default }}>
  Content
</Box>

// または
<Box p="md" bg={colors.gridItem.default}>
  Content
</Box>
```

### レスポンシブ

- Mantineのブレークポイントを活用
- `SimpleGrid`の`cols`プロパティでレスポンシブ対応

```tsx
<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
  {/* items */}
</SimpleGrid>
```

## 状態管理

### グローバル状態

- **認証状態**: `AuthContext` (Firebase Authentication統合)
- **アクティビティ状態**: `ActivityContext` (Activity + Records)
- **ストレージ**: `StorageProvider` (依存性注入パターン)

### ローカル状態

- コンポーネント内の状態は`useState`
- 複雑なロジックは`useReducer`
- **グリッド順序**: localStorage経由でStorageServiceに永続化

### StorageService層

```typescript
// shared/services/storage/types.ts
interface StorageService {
  // Activities
  getActivities(): Promise<ActivityDefinition[]>
  addActivity(activity: ActivityDefinition): Promise<void>
  updateActivity(id: string, activity: ActivityDefinition): Promise<void>
  deleteActivity(id: string): Promise<void>
  
  // Records
  getRecords(): Promise<ActivityRecord[]>
  addRecord(record: ActivityRecord): Promise<void>
  // ... etc
}
```

**実装:**
- `LocalStorageService`: localStorage基盤（未ログイン時）
- `FirebaseStorageService`: Firestore基盤（ログイン時）

**使用例:**
```typescript
import { useStorage } from '@/shared/services/storage';

function MyComponent() {
  const storage = useStorage();
  
  const loadData = async () => {
    const activities = await storage.getActivities();
    // ...
  };
}
```

### データ取得

- カスタムフックでカプセル化
- loading/error状態を適切にハンドリング
- Repository層を通してStorageServiceにアクセス

```typescript
export function useHomeData() {
  const [data, setData] = useState<ActivityData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // ... fetch logic
  
  return { data, isLoading, error };
}
```

## Repository層の使用

新しい機能でデータアクセスが必要な場合は、Repository層を実装してください。

### Repository実装例

```typescript
// features/my-feature/api/repositories/MyRepository.ts
import type { StorageService } from '@/shared/services/storage';

export class MyRepository {
  constructor(private storage: StorageService) {}
  
  async getAll(): Promise<MyData[]> {
    try {
      return await this.storage.getMyData();
    } catch (error) {
      console.error('[MyRepository] Failed to get data:', error);
      throw error;
    }
  }
  
  // ... other methods
}
```

### Context層での使用

```typescript
// features/my-feature/model/MyContext.tsx
import { useStorage } from '@/shared/services/storage';
import { MyRepository } from '../api/repositories/MyRepository';

export function MyProvider({ children }) {
  const storage = useStorage();
  const repository = useMemo(() => new MyRepository(storage), [storage]);
  
  // ... use repository for data operations
}
```

## テスト（今後の実装予定）

- コンポーネントテスト: React Testing Library
- ユニットテスト: Vitest
- Repository層のテスト: モックStorageServiceを使用
- E2Eテスト: Playwright（検討中）

### Repository層のテスト例

```typescript
// MockStorageService.ts
class MockStorageService implements StorageService {
  private data: MyData[] = [];
  
  async getMyData(): Promise<MyData[]> {
    return [...this.data];
  }
  
  // ... other methods
}

// MyRepository.test.ts
describe('MyRepository', () => {
  let storage: MockStorageService;
  let repository: MyRepository;
  
  beforeEach(() => {
    storage = new MockStorageService();
    repository = new MyRepository(storage);
  });
  
  it('should get all data', async () => {
    const data = await repository.getAll();
    expect(data).toEqual([]);
  });
});
```

## パフォーマンス

- 不要な再レンダリングを避ける（`useMemo`, `useCallback`を適切に使用）
- 大きなリストは仮想化を検討
- 画像は適切に最適化

## アクセシビリティ

- セマンティックHTML要素を使用
- ARIA属性を適切に設定
- キーボード操作をサポート

## コミットメッセージ

```
feat: 新機能
fix: バグ修正
docs: ドキュメント更新
style: コードフォーマット
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・設定変更
```

## 問題が発生した場合

1. `ARCHITECTURE.md`で該当する機能の説明を確認
2. 既存の類似実装を参考にする
3. TypeScriptの型エラーは必ず解決する
4. ESLintの警告にも対応する

## 参考リンク

- [Mantine UI Documentation](https://mantine.dev/)
- [dnd-kit Documentation](https://docs.dndkit.com/)
- [Recharts Documentation](https://recharts.org/)
