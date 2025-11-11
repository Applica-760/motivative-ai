# Calendar Feature

アクティビティの記録をカレンダー形式で表示・管理する機能です。

## アーキテクチャ

このフィーチャーは、レイヤードアーキテクチャのベストプラクティスに従って設計されています。

### レイヤー構成

```
┌─────────────────────────────────────────┐
│   Presentation Layer (ui/)               │
│   - ActivityCalendar                     │
│   - ActivityCalendarWidget               │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   Application Layer (hooks/)             │
│   - useCalendarNavigation                │
│   - useCalendarData                      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   Domain Layer (model/ + api/)           │
│   - calendarUtils (ビジネスロジック)      │
│   - types (型定義)                        │
│   - CalendarRepository                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│   Infrastructure Layer                   │
│   - StorageService (shared/)             │
└─────────────────────────────────────────┘
```

## ディレクトリ構造

```
calendar/
├── index.ts                    # 外部へのエクスポート
├── README.md                   # このファイル
├── ui/                         # Presentation Layer
│   ├── ActivityCalendar.tsx    # カレンダー表示コンポーネント
│   ├── ActivityCalendarWidget.tsx  # ウィジェットラッパー
│   └── index.ts
├── hooks/                      # Application Layer
│   ├── useCalendarNavigation.ts    # 月間ナビゲーション
│   ├── useCalendarData.ts          # データ取得
│   └── index.ts
├── model/                      # Domain Layer (ビジネスロジック)
│   ├── types.ts                    # 型定義
│   ├── calendarUtils.ts            # ユーティリティ関数
│   └── index.ts
├── api/                        # Domain Layer (データアクセス)
│   ├── repositories/
│   │   └── CalendarRepository.ts   # Repository層
│   └── index.ts
└── config/                     # Configuration
    ├── gridConfig.tsx              # グリッドアイテム設定
    └── index.ts
```

## 各レイヤーの責務

### Presentation Layer (`ui/`)

**責務:**
- UIの描画のみに集中
- ユーザーインタラクションの受付
- カスタムフックからデータとロジックを取得

**ファイル:**
- `ActivityCalendar.tsx`: カレンダー本体のUI
- `ActivityCalendarWidget.tsx`: グリッドアイテムとしてのラッパー

### Application Layer (`hooks/`)

**責務:**
- コンポーネント間で再利用可能なロジック
- 状態管理とライフサイクル管理
- Domain層とPresentation層の橋渡し

**ファイル:**
- `useCalendarNavigation.ts`: カレンダーの月間ナビゲーションロジック
- `useCalendarData.ts`: Repository経由でのデータ取得、ローディング・エラー状態管理

### Domain Layer (`model/` + `api/`)

**責務:**
- ビジネスロジックの実装
- データアクセスの抽象化（Repository）
- 型定義

**ファイル:**
- `types.ts`: カレンダー関連の型定義
- `calendarUtils.ts`: 日付計算などのユーティリティ
- `CalendarRepository.ts`: データアクセス層

### Configuration (`config/`)

**責務:**
- フィーチャー固有の設定
- グリッドアイテムの生成

## 使用例

### 基本的な使用

```tsx
import { ActivityCalendar } from '@/features/calendar';

function MyComponent() {
  return (
    <ActivityCalendar 
      activity={myActivity}
    />
  );
}
```

### カスタムフックの使用

```tsx
import { useCalendarNavigation, useCalendarData } from '@/features/calendar';

function MyCustomCalendar({ activityId }: { activityId: string }) {
  const { currentMonth, goToPrevMonth, goToNextMonth } = useCalendarNavigation();
  const { records, isLoading, error } = useCalendarData(
    activityId,
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={goToPrevMonth}>前月</button>
      <span>{currentMonth.getFullYear()}/{currentMonth.getMonth() + 1}</span>
      <button onClick={goToNextMonth}>次月</button>
      {/* records を使用してカレンダーを描画 */}
    </div>
  );
}
```

### Repository層の直接使用

```tsx
import { CalendarRepository } from '@/features/calendar';
import { useStorage } from '@/shared/services/storage';

function MyComponent() {
  const storage = useStorage();
  const repository = useMemo(() => new CalendarRepository(storage), [storage]);

  const checkRecord = async () => {
    const hasRecord = await repository.hasRecordOnDate(
      'activity-id',
      new Date()
    );
    console.log('Has record:', hasRecord);
  };

  return <button onClick={checkRecord}>Check Today's Record</button>;
}
```

## 設計原則

### 1. 単一責任の原則 (SRP)
- 各コンポーネント/フック/クラスは単一の責務を持つ
- UIコンポーネントはUIの描画のみ
- フックはロジックと状態管理のみ
- Repositoryはデータアクセスのみ

### 2. 依存性逆転の原則 (DIP)
- 上位レイヤーは下位レイヤーの抽象（インターフェース）に依存
- `CalendarRepository`は`StorageService`インターフェースに依存
- 具体的な実装（LocalStorage/Firebase）は注入される

### 3. 関心の分離 (SoC)
- UIロジック（Presentation）
- アプリケーションロジック（Hooks）
- ビジネスロジック（Model）
- データアクセスロジック（Repository）
を明確に分離

## テスト戦略（今後実装予定）

### 単体テスト
- `calendarUtils.ts`の各関数
- `useCalendarNavigation`フック
- `CalendarRepository`クラス（MockStorageServiceを使用）

### 統合テスト
- `useCalendarData`フック（実際のStorageServiceと連携）
- コンポーネント全体の動作

### E2Eテスト
- カレンダーでの月間ナビゲーション
- 記録の表示・追加

## 今後の拡張

- [ ] カレンダー上での記録の追加・編集・削除
- [ ] 記録の視覚的な表現（色分け、アイコン表示）
- [ ] 週表示・日表示への切り替え
- [ ] 記録の統計情報表示
- [ ] カレンダーのエクスポート機能
