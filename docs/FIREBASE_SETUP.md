# Firebase設定ガイド

## 🔥 Firestoreセキュリティルールのデプロイ

### 前提条件

Firebase CLIがインストールされていること：
```bash
npm install -g firebase-tools
```

### 手順

#### 1. Firebaseにログイン
```bash
firebase login
```

#### 2. プロジェクトを初期化（初回のみ）
```bash
firebase init
```
- Firestore を選択
- 既存のプロジェクト `motivativeai` を選択
- `firestore.rules` と `firestore.indexes.json` を使用

#### 3. セキュリティルールをデプロイ
```bash
firebase deploy --only firestore:rules
```

### 📋 セキュリティルールの内容

現在のルール (`firestore.rules`) では：

```
users/{userId}/{document=**}
  - 認証済みユーザーは自分のデータのみ読み書き可能
  - 他のユーザーのデータにはアクセス不可
```

### 🧪 テスト方法

Firebase Consoleの「ルールシミュレーター」でテスト可能：
https://console.firebase.google.com/project/motivativeai/firestore/rules

### ⚠️ 重要な注意事項

1. **セキュリティルールをデプロイしないとデータが保存できません**
   - Firebase Consoleで手動設定するか、上記コマンドでデプロイ

2. **初回デプロイ後は自動的に適用されます**
   - リロードなしでルールが有効化

3. **開発環境でテストする場合**
   - Firebase Emulatorを使用することを推奨
   ```bash
   firebase emulators:start
   ```

## 🔍 トラブルシューティング

### データが保存されない場合

1. **ブラウザのコンソールを確認**
   ```
   [FirebaseStorageService] Failed to add activity: FirebaseError: Missing or insufficient permissions
   ```
   → セキュリティルールがデプロイされていない

2. **Firebase Consoleで確認**
   - Firestore Database → ルール タブ
   - デプロイ済みか確認

3. **認証状態を確認**
   ```
   console.log('[App] Using Firebase authentication service')
   ```
   → ログイン済みか確認

### セキュリティルールのデプロイに失敗する場合

```bash
# プロジェクトIDを指定
firebase use motivativeai

# 強制的に再デプロイ
firebase deploy --only firestore:rules --force
```

## 📚 参考リンク

- [Firebase Console - Firestore](https://console.firebase.google.com/project/motivativeai/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
