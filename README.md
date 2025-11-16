# Motivative AI

モチベーション管理とアクティビティトラッキングのためのWebアプリケーション。

## 技術スタック

- **React 19** + **TypeScript**
- **Vite** - ビルドツール
- **Mantine UI v8** - UIコンポーネントライブラリ
- **Firebase** - 認証とデータストレージ（オプション）
- **ダークテーマ** をデフォルトとして使用

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

#### オプションA: LocalStorageを使用（Firebaseなし）

デフォルトではLocalStorageを使用します。追加の設定は不要です。

```bash
npm run dev
```

#### オプションB: Firebaseを使用

Firebaseを使用する場合は、以下の手順を実行してください。

1. `.env.example`をコピーして`.env`を作成:

```bash
cp .env.example .env
```

2. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成

3. Firebase Console > プロジェクト設定 > 全般 から設定値を取得

4. `.env`ファイルに設定値を入力:

```env
# Firebaseを有効化
VITE_USE_FIREBASE=true

# Firebase設定
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

5. Firebase Authenticationを有効化:
   - Firebase Console > Authentication > Sign-in method
   - 「メール/パスワード」を有効化
   - 「Google」を有効化（オプション）

6. Firestoreデータベースを作成:
   - Firebase Console > Firestore Database > データベースを作成
   - テストモードで開始（後でルールを設定）

7. 開発サーバーを起動:

```bash
npm run dev
```

### 3. Firestore セキュリティルール（本番環境用）

以下のセキュリティルールをFirebase Consoleで設定してください:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 開発

```bash
npm run dev        # 開発サーバー起動
npm run build      # 本番ビルド
npm run preview    # ビルド結果をプレビュー
npm run lint       # ESLintチェック
npm test           # テスト実行
```

## 機能

### ✅ 実装済み

#### コア機能
- ✅ アクティビティの作成・編集・削除
- ✅ 記録の追加・編集・削除
- ✅ グリッドレイアウトのドラッグ&ドロップ
- ✅ チャート表示（折れ線グラフ、棒グラフ）

#### 認証・データ管理
- ✅ Firebase認証（メール/パスワード、Google）
- ✅ ローカルストレージによるデータ永続化
- ✅ Firestoreによるデータ同期
- ✅ ログイン状態に応じたストレージ自動切り替え

#### アーキテクチャ
- ✅ Repository層によるデータアクセス抽象化
- ✅ StorageService層の実装（LocalStorage / Firebase）
- ✅ 3層アーキテクチャ（Presentation / Domain / Infrastructure）

#### UI/UX
- ✅ ダークテーマUI（Mantine UI v8）
- ✅ レスポンシブ対応（PC/タブレット/モバイル）

### 🚧 今後の実装予定

- 🚧 リアルタイムデータ同期
- 🚧 データ移行機能（LocalStorage ↔ Firebase）
- 🚧 オフライン対応（PWA化）
- 🚧 複数デバイス間の同期
- 🚧 データエクスポート/インポート

## アーキテクチャ

このプロジェクトは **Feature-Sliced Design** と **3層アーキテクチャ** を採用しています。

### プロジェクト構造

```
src/
├── features/          # 機能単位のモジュール
│   ├── activity/     # アクティビティ管理
│   │   ├── api/      # Repository層
│   │   ├── model/    # ビジネスロジック・状態管理
│   │   └── ui/       # UIコンポーネント
│   ├── auth/         # 認証
│   ├── grid-item/    # グリッドアイテム管理
│   ├── graph/        # グラフ表示
│   └── home/         # ホーム画面
└── shared/           # 共通モジュール
    ├── components/   # 共通コンポーネント
    ├── config/       # 設定
    ├── services/     # サービス層（Storage等）
    └── types/        # 型定義
```

### レイヤードアーキテクチャ

```
┌─────────────────────────────────────────┐
│   Presentation Layer                     │
│   - React Components                     │
│   - Context (ActivityContext)            │
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

詳細は `ARCHITECTURE.md` を参照してください。

## データ構造（Firestore）

```
users/{userId}/
  ├─ activities/{activityId}
  │   ├─ title: string
  │   ├─ icon: string
  │   ├─ valueType: string
  │   ├─ unit?: string
  │   ├─ color?: string
  │   ├─ order: number
  │   ├─ isArchived: boolean
  │   ├─ createdAt: timestamp
  │   └─ updatedAt: timestamp
  │
  ├─ records/{recordId}
  │   ├─ activityId: string
  │   ├─ value: object
  │   ├─ date: string
  │   ├─ timestamp: timestamp
  │   ├─ note?: string
  │   ├─ createdAt: timestamp
  │   └─ updatedAt: timestamp
  │
  └─ settings/
      └─ gridLayout
          ├─ positions: object
          └─ updatedAt: timestamp
```

## トラブルシューティング

### Firebaseに接続できない

1. `.env`ファイルが正しく作成されているか確認
2. `VITE_USE_FIREBASE=true`が設定されているか確認
3. Firebase Console で Authentication と Firestore が有効になっているか確認
4. ブラウザのコンソールでエラーメッセージを確認

### データが保存されない

- ログイン状態を確認してください
- ログインしていない場合はLocalStorageに保存されます
- ログインしている場合はFirestoreに保存されます

## 注意事項

- このプロジェクトでは **Mantine UI v8** を使用しています。新しいコンポーネントを追加する際は、Mantine UIのコンポーネントを使用してください。
- Firebaseの設定ファイル（`.env`）は`.gitignore`に含まれています。チーム開発では各自で設定してください。
- テストは `npm test` で実行できます。テストカバレッジレポートは `coverage/` ディレクトリに生成されます。

## ドキュメント

- **ARCHITECTURE.md** - 詳細なアーキテクチャ説明
- **docs/reports/** - リファクタリングレポート
  - StorageService実装レポート
  - Repository層テストサマリー
  - グリッドレイアウト改善レポート
  - ActivityContextリファクタリング分析

## ライセンス

MIT

