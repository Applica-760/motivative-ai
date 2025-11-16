# Storage Service

データ永続化の抽象化層。localStorage、Firebase、その他のストレージ実装を統一的に扱います。

## アーキテクチャ

```
shared/services/storage/
├── types.ts                    # StorageServiceインターフェース定義
├── LocalStorageService.ts      # localStorage実装
├── FirebaseStorageService.ts   # Firebase実装（スケルトン）
├── StorageProvider.tsx         # React Context Provider
└── index.ts                    # 公開API
```

## 主要な型・インターフェース

### StorageService

すべてのストレージ実装が準拠するインターフェース。

```typescript
interface StorageService {
  // Activities
  getActivities(): Promise<ActivityDefinition[]>;
  saveActivities(activities: ActivityDefinition[]): Promise<void>;
  addActivity(activity: ActivityDefinition): Promise<ActivityDefinition>;
  updateActivity(id: string, updates: Partial<ActivityDefinition>): Promise<ActivityDefinition>;
  deleteActivity(id: string): Promise<void>;
  
  // Records
  getRecords(): Promise<ActivityRecord[]>;
  saveRecords(records: ActivityRecord[]): Promise<void>;
  addRecord(record: ActivityRecord): Promise<ActivityRecord>;
  updateRecord(id: string, updates: Partial<ActivityRecord>): Promise<ActivityRecord>;
  deleteRecord(id: string): Promise<void>;
  getRecordsByActivityId(activityId: string): Promise<ActivityRecord[]>;
  
  // Grid Layout
  getGridLayout(): Promise<SavedLayout | null>;
  saveGridLayout(layout: SavedLayout): Promise<void>;
}
```

## 使用方法

### 1. アプリケーションのセットアップ

アプリケーションのルートで`StorageProvider`をセットアップ：

```tsx
import { StorageProvider, LocalStorageService } from '@/shared/services/storage';

function App() {
  return (
    <StorageProvider service={new LocalStorageService()}>
      {/* アプリケーションコンポーネント */}
    </StorageProvider>
  );
}
```

### 2. コンポーネントでの使用

`useStorage`フックでStorageServiceを取得：

```tsx
import { useStorage } from '@/shared/services/storage';

function MyComponent() {
  const storage = useStorage();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const activities = await storage.getActivities();
        setActivities(activities);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };
    
    loadData();
  }, [storage]);
  
  const handleAddActivity = async (activity: ActivityDefinition) => {
    try {
      const added = await storage.addActivity(activity);
      console.log('Activity added:', added);
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  };
  
  return <div>...</div>;
}
```

## 実装

### LocalStorageService

ブラウザのlocalStorageを使用した実装。ログインしていないユーザー向け。

**特徴:**
- ✅ 同期的なストレージアクセス（非同期APIでラップ）
- ✅ Date型の自動復元
- ✅ エラーハンドリング（StorageError）
- ⚠️ データサイズ制限（約5-10MB）
- ⚠️ デバイス間で同期されない

**使用例:**
```typescript
const storage = new LocalStorageService();
const activities = await storage.getActivities();
```

### FirebaseStorageService（未実装）

将来的にFirebase Firestoreを使用する実装。

**計画中の機能:**
- Firebase Authとの統合
- リアルタイム同期
- オフラインサポート
- デバイス間でのデータ共有

**使用例（将来）:**
```typescript
const storage = new FirebaseStorageService(userId);
const activities = await storage.getActivities();
```

## エラーハンドリング

すべてのメソッドは`StorageError`をスローする可能性があります。

```typescript
import { StorageError } from '@/shared/services/storage';

try {
  await storage.addActivity(activity);
} catch (error) {
  if (error instanceof StorageError) {
    console.error(`Storage ${error.operation} failed:`, error.message);
    // エラー通知をユーザーに表示
  }
}
```

## ストレージキーの管理

すべてのストレージキーは`shared/config/storage.ts`で一元管理：

```typescript
export const STORAGE_KEYS = {
  GRID_LAYOUT_ORDER: 'grid-layout-order',
  ACTIVITIES: 'motivative-ai-activities',
  RECORDS: 'motivative-ai-records',
  USER_PREFERENCES: 'user-preferences',
  THEME: 'theme',
} as const;
```

## テスト

### ユニットテスト

```bash
npm test src/shared/services/storage/LocalStorageService.test.ts
```

### テストでの使用

```typescript
import { LocalStorageService } from '@/shared/services/storage';

describe('MyComponent', () => {
  it('should load activities', async () => {
    const mockStorage = new LocalStorageService();
    
    render(
      <StorageProvider service={mockStorage}>
        <MyComponent />
      </StorageProvider>
    );
    
    // テストコード...
  });
});
```

## 移行ガイド

### 既存のlocalStorage使用からの移行

**Before:**
```typescript
const data = localStorage.getItem('motivative-ai-activities');
const activities = data ? JSON.parse(data) : [];
```

**After:**
```typescript
const storage = useStorage();
const activities = await storage.getActivities();
```

### ActivityContextからの移行

ActivityContextは将来的にStorageServiceを内部で使用するようにリファクタリングされます。
外部APIは変更されないため、既存のコードは動作し続けます。

## ベストプラクティス

### ✅ DO

- StorageProviderをアプリケーションのルートに配置
- useStorageフックでサービスを取得
- try-catchでエラーハンドリング
- 非同期操作を適切に待機

### ❌ DON'T

- StorageProvider外でuseStorageを使用しない
- localStorageに直接アクセスしない
- StorageErrorを無視しない

## 今後の拡張

1. **Firebase統合**（Phase 4）
   - Firebase Auth連携
   - Firestore実装
   - リアルタイム同期

2. **オフライン対応**（Phase 5）
   - Service Worker統合
   - キャッシュ戦略
   - 競合解決

3. **データマイグレーション**（Phase 6）
   - LocalStorage → Firebase移行
   - バージョン管理
   - スキーママイグレーション

## 関連ドキュメント

- [ARCHITECTURE.md](../../../../ARCHITECTURE.md) - アプリケーション全体のアーキテクチャ
- [Activity Feature](../../../features/activity/README.md) - Activity機能の実装
- [Grid Item Feature](../../../features/grid-item/README.md) - Grid Item機能の実装
