# Graph Feature

グラフ・チャート表示機能を提供するfeature

## 概要

このfeatureは、アクティビティデータを様々な形式のグラフで可視化する機能を提供します。
棒グラフ、折れ線グラフなどの表示形式をサポートし、ユーザーが動的に切り替えることができます。

## 責務

- グラフデータの取得（API抽象化層）
- グラフの描画（Mantine Charts + Recharts）
- グラフタイプの切り替え機能
- グリッドアイテムとしてのグラフウィジェット提供

## アーキテクチャ

```
graph/
├── api/           # データ取得API（抽象化層）
├── ui/            # UIコンポーネント
├── config/        # グリッド設定
├── model/         # 型定義（後方互換性のため）
└── README.md
```

## 使用方法

### 基本的な使い方

```typescript
import { ActivityChartWidget } from '@/features/graph';
import { ChartTypeEnum } from '@/shared/types';

<ActivityChartWidget
  title="ランニング"
  data={[
    { date: '11/1', value: 5 },
    { date: '11/2', value: 3 },
  ]}
  dataLabel="距離 (km)"
  color="blue.6"
  chartType={ChartTypeEnum.BAR}
/>
```

### データの取得

**現在の実装では、`ActivityContext`経由でデータを取得します:**

```typescript
import { useActivityContext } from '@/features/activity';
import { convertActivityRecordsToChartData } from '@/features/activity/model/activityToChartAdapter';

function MyComponent() {
  const { activities, records } = useActivityContext();
  
  // 特定のアクティビティの記録を取得
  const activityRecords = records.filter(r => r.activityId === 'my-activity-id');
  
  // チャートデータに変換
  const chartData = convertActivityRecordsToChartData(activityRecords);
  
  return <ActivityChartWidget data={chartData} ... />;
}
```

## コンポーネント一覧

### ActivityChartWidget
グリッドアイテムとして使用可能なチャートウィジェット

### ActivityChart
タイトルとグラフタイプ切り替えボタンを含む統合コンポーネント

### ChartFactory
グラフタイプに応じて適切なチャートを返すファクトリー

### BarChart
棒グラフコンポーネント

### LineChart
折れ線グラフコンポーネント

## データフロー

```
ActivityContext (アクティビティ定義 + 記録)
    ↓
activityToChartAdapter.ts (変換層)
    ↓
ChartDataPoint[] (グラフ用データ)
    ↓
Graph Feature (可視化)
```

**現在の実装:**
- グラフデータは`ActivityContext`から取得されます
- `useHomeData`フックが`activityToChartAdapter`を使用してデータを変換
- `graph/api`内のモックデータは使用されていません（将来の拡張用スタブ）

## 今後の拡張

- [ ] より多くのグラフタイプ（エリアチャート、円グラフ等）
- [ ] グラフのカスタマイズオプション追加
- [ ] データの期間フィルタリング機能
- [ ] グラフのエクスポート機能
- [ ] リアルタイムデータ更新

## 関連Feature

- `activity`: アクティビティデータの管理
- `home`: ダッシュボードの統合
