# ActivityContext リファクタリング分析レポート

## 📊 現状分析

### ActivityContextの責務（現在）

1. **データ管理**
   - Activities（定義）の状態管理
   - Records（記録）の状態管理
   - isLoadingフラグの管理

2. **永続化**
   - localStorageへの直接アクセス
   - データの読み込み・保存
   - Date型の復元

3. **ビジネスロジック**
   - IDの生成
   - orderの自動計算
   - 日時の自動設定

4. **React統合**
   - Context Provider
   - useCallback最適化

### 問題点

#### 🔴 Critical Issues

1. **レイヤー境界の曖昧さ**
   ```tsx
   // データアクセス層とプレゼンテーション層が混在
   localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
   setActivities(updatedActivities);
   ```

2. **ストレージ実装への直接依存**
   - `localStorage`が直接埋め込まれている
   - StorageServiceが使用されていない
   - テストが困難

3. **責務過多（God Object）**
   - データ永続化
   - 状態管理
   - ビジネスロジック
   - すべてが1つのContextに集中

#### 🟡 Medium Issues

4. **重複ロジック**
   - Date型の復元コードが複数箇所に
   - ID生成ロジックが複数箇所に

5. **エラーハンドリング不足**
   - エラー時にモックデータで復旧（ユーザーには通知なし）
   - エラー状態が外部に公開されていない

6. **モックデータの混在**
   - 本番コードにモックデータがハードコード
   - 初期化ロジックが複雑

### 依存関係マップ

```
App.tsx
  └─> ActivityProvider
        ├─> localStorage (直接依存)
        ├─> mockActivityDefinitions
        └─> mockActivityRecords

使用箇所:
  ├─> useActivities (hooks)
  ├─> CreateActivityModal (ui)
  ├─> EditActivityModal (ui)
  ├─> AddRecordModal (ui)
  └─> useHomeData (home feature)
```

### 外部API（変更してはいけないもの）

```typescript
interface ActivityContextValue {
  activities: ActivityDefinition[];
  records: ActivityRecord[];
  isLoading: boolean;
  addActivity: (activity: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateActivity: (id: string, updates: Omit<ActivityDefinition, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  addRecord: (record: Omit<ActivityRecord, 'id' | 'createdAt' | 'updatedAt' | 'timestamp'>) => void;
  refreshActivities: () => void;
}
```

**重要**: この外部APIは完全に維持する必要がある

---

## 🎯 リファクタリング戦略

### アーキテクチャ設計（3層構造）

```
┌─────────────────────────────────────────┐
│   Presentation Layer (Context)          │
│   - ActivityProvider                     │
│   - useActivityContext                   │
│   - React State Management              │
└────────────────┬────────────────────────┘
                 │ uses
┌────────────────▼────────────────────────┐
│   Domain Layer (Repository)              │
│   - ActivityRepository                   │
│   - RecordRepository                     │
│   - Business Logic                       │
│   - ID Generation                        │
└────────────────┬────────────────────────┘
                 │ uses
┌────────────────▼────────────────────────┐
│   Infrastructure Layer (Storage)         │
│   - StorageService                       │
│   - LocalStorageService                  │
│   - FirebaseStorageService               │
└─────────────────────────────────────────┘
```

### Repository層の責務

#### ActivityRepository
```typescript
class ActivityRepository {
  // CRUD操作
  getAll(): Promise<ActivityDefinition[]>
  getById(id: string): Promise<ActivityDefinition | null>
  create(data: Partial<ActivityDefinition>): Promise<ActivityDefinition>
  update(id: string, data: Partial<ActivityDefinition>): Promise<ActivityDefinition>
  delete(id: string): Promise<void>
  
  // ビジネスロジック
  - ID生成
  - order自動計算
  - 日時の自動設定
  - データ整合性チェック
}
```

#### RecordRepository
```typescript
class RecordRepository {
  // CRUD操作
  getAll(): Promise<ActivityRecord[]>
  getById(id: string): Promise<ActivityRecord | null>
  getByActivityId(activityId: string): Promise<ActivityRecord[]>
  create(data: Partial<ActivityRecord>): Promise<ActivityRecord>
  update(id: string, data: Partial<ActivityRecord>): Promise<ActivityRecord>
  delete(id: string): Promise<void>
  
  // ビジネスロジック
  - ID生成
  - timestamp自動設定
  - データバリデーション
}
```

### リファクタリングステップ

#### Step 1: Repository層の実装
- [ ] `features/activity/api/repositories/` を作成
- [ ] `ActivityRepository.ts` を実装
- [ ] `RecordRepository.ts` を実装
- [ ] 包括的なテストを作成

#### Step 2: ActivityContextの段階的移行
- [ ] ActivityRepositoryを注入
- [ ] RecordRepositoryを注入
- [ ] localStorage依存を除去
- [ ] ビジネスロジックをRepositoryに移動

#### Step 3: テスト・検証
- [ ] 既存コンポーネントの動作確認
- [ ] エッジケースのテスト
- [ ] パフォーマンス検証

### 期待される効果

#### ✅ 改善点

1. **関心の分離**
   - Contextは状態管理のみ
   - Repositoryがビジネスロジック
   - StorageServiceがデータ永続化

2. **テスタビリティ向上**
   - Repository単体でテスト可能
   - モック注入が容易
   - ストレージ実装を切り替え可能

3. **保守性向上**
   - 各層の責務が明確
   - 変更の影響範囲が限定的
   - コードの再利用性が向上

4. **拡張性向上**
   - 新しいビジネスロジックを追加しやすい
   - ストレージ実装の切り替えが容易
   - Firebase統合が簡単に

#### 📈 コード品質指標

| 項目 | 現在 | 目標 |
|------|------|------|
| 責務の数 | 4+ | 1-2 |
| 依存の数 | 直接3+ | 抽象化済み |
| テストカバレッジ | 0% | 80%+ |
| コード行数 | 186行 | Context: 80行<br>Repository: 150行 |

---

## ⚠️ リスク管理

### 高リスク項目

1. **外部API変更**
   - リスク: 既存コンポーネントが動作しなくなる
   - 対策: 外部APIは絶対に変更しない

2. **データ移行**
   - リスク: 既存のlocalStorageデータが読めなくなる
   - 対策: ストレージキーは変更しない

3. **パフォーマンス劣化**
   - リスク: レイヤーが増えて遅くなる
   - 対策: メモ化、非同期処理の最適化

### 検証チェックリスト

- [ ] CreateActivityModalで新規作成できる
- [ ] EditActivityModalで編集できる
- [ ] AddRecordModalで記録追加できる
- [ ] useHomeDataでデータ取得できる
- [ ] refreshActivitiesで再読み込みできる
- [ ] 既存のlocalStorageデータが読める
- [ ] エラー時の挙動が適切

---

## 📝 実装計画

### Phase 3-1: Repository層実装（2-3時間）
1. インターフェース定義
2. ActivityRepository実装
3. RecordRepository実装
4. ユニットテスト作成

### Phase 3-2: ActivityContext移行（2時間）
1. Repositoryを注入
2. localStorage依存を除去
3. ビジネスロジックを移動

### Phase 3-3: 統合テスト（1時間）
1. 既存コンポーネントでの動作確認
2. エッジケースのテスト
3. パフォーマンス検証

**合計見積もり**: 5-6時間
