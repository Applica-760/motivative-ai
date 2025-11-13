# デフォルトデータのリセット方法

## 🎯 根本的な解決策: バージョン管理システム

古いデータが残っていて新しいデフォルトデータが反映されない問題を解決するため、**自動バージョン管理システム**を実装しました。

## 📦 実装内容

### 1. データバージョン管理 (`devConfig.ts`)

```typescript
export const DEFAULT_DATA_VERSION = 'v2';  // デフォルトデータのバージョン
export const FORCE_RESET_ON_NEXT_LOAD = true;  // 強制リセットフラグ
```

### 2. 自動リセット機能

`ActivityContext`が起動時に以下をチェック:
- 保存されているデータバージョン
- 強制リセットフラグ
- バージョンの不一致

いずれかの条件に該当すれば、**自動的にデータをリセット**してデフォルトデータを再生成します。

## 🚀 使用方法

### 方法1: 強制リセット（最も確実）

1. **`src/shared/config/devConfig.ts`を開く**

2. **`FORCE_RESET_ON_NEXT_LOAD`を`true`に設定**:
   ```typescript
   export const FORCE_RESET_ON_NEXT_LOAD = true;
   ```

3. **アプリをリロード** (`Cmd + R` / `F5`)

4. コンソールに以下のログが表示されれば成功:
   ```
   [DevConfig] 🔄 Force reset is enabled
   [ActivityContext] 🔄 Resetting data to defaults...
   [ActivityContext] ✅ Data reset complete
   ```

5. **リセット完了後、フラグを`false`に戻す**:
   ```typescript
   export const FORCE_RESET_ON_NEXT_LOAD = false;
   ```

### 方法2: バージョン更新

1. **`devConfig.ts`の`DEFAULT_DATA_VERSION`を変更**:
   ```typescript
   export const DEFAULT_DATA_VERSION = 'v3';  // バージョンを上げる
   ```

2. **アプリをリロード**

3. 自動的に古いバージョンのデータが削除され、新しいデフォルトデータが生成されます

### 方法3: 手動クリーンアップ（従来の方法）

HTMLクリーンアップツールを使用:
```bash
npm run cleanup:open
```

または、開発者ツールのConsoleで:
```javascript
['motivative-ai-activities', 'motivative-ai-records', 'motivative-ai-grid-layout', 'motivative-ai-grid-items-order', 'motivative-ai-data-version'].forEach(key => {
  localStorage.removeItem(key);
  console.log(`✓ 削除: ${key}`);
});
location.reload();
```

## 🔍 デバッグ方法

### ブラウザのConsoleでバージョン確認

```javascript
// 現在のバージョンを確認
console.log('Current version:', localStorage.getItem('motivative-ai-data-version'));

// すべてのmotivative-ai関連キーを表示
Object.keys(localStorage).filter(k => k.startsWith('motivative-ai')).forEach(k => {
  console.log(`${k}:`, localStorage.getItem(k)?.substring(0, 100));
});
```

### ログの確認

以下のログメッセージに注目:
- `[DevConfig] 🔄 Force reset is enabled` - 強制リセットが有効
- `[DevConfig] 🔄 Version mismatch` - バージョン不一致
- `[ActivityContext] 🔄 Resetting data to defaults...` - リセット実行中
- `[ActivityContext] ✅ Data reset complete` - リセット完了

## ✅ リセット後の確認事項

正しくリセットされた場合、以下が表示されます:

### デフォルトアクティビティ（4つ）
1. 🏃 **ランニング** (number型) - グラフ表示
2. 📚 **読書** (duration型) - グラフ表示
3. ⏰ **6時までに起きれた** (boolean型) - カレンダー表示
4. 📓 **頑張った日記** (text型) - テキストログ表示

### グリッド配置
```
┌──────────────┬─────────────────┬─────────────────┬──────────────┐
│ 📓頑張った   │  🏃ランニング   │                 │ ⏰6時まで    │
│   日記       │   (グラフ)      │                 │  に起きれた  │
│  (ログ)      ├─────────────────┤                 │ (カレンダー) │
│              │  📚読書         │                 │              │
├──────────────┤   (グラフ)      │                 ├──────────────┤
│ 🕐タイマー   │                 │                 │              │
│              │                 │                 │              │
│              │                 │                 │              │
└──────────────┴─────────────────┴─────────────────┴──────────────┘
```

## ⚠️ 注意事項

### 本番環境での使用

本番環境では**必ず**以下の設定にすること:
```typescript
export const FORCE_RESET_ON_NEXT_LOAD = false;
```

強制リセットを有効にしたまま本番デプロイすると、**全ユーザーのデータが削除されます**！

### ログインユーザーのデータ

- **ゲストユーザー**: LocalStorageのデータが削除されます
- **ログインユーザー**: Firestoreのデータは保持されます（ローカルキャッシュのみ削除）

## 📝 変更履歴

### v2 (2025-11-13)
- 瞑想アクティビティを削除
- 早起きアクティビティを追加 (boolean型)
- 頑張った日記アクティビティを追加 (text型)
- グリッド配置を最適化

### v1 (初期バージョン)
- ランニング、読書、瞑想の3つ
