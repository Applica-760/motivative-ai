# 色定義リファクタリング計画

## 目的
ハードコードされた色定義を `shared/config/colors.ts` に集約し、メンテナンス性とデザインの一貫性を向上させる。

## 調査結果

### 使用されている色の分類

#### 1. アクション色（ボタン、フォーカス）
| 色コード | 用途 | 出現回数 | 新定義名 |
|---------|------|---------|---------|
| `#4ECDC4` | メインアクション（ティール） | 20+ | `colors.action.primary` |
| `#3db8b8` | ホバー時 | 2 | `colors.action.primaryHover` |

#### 2. フォーム・入力フィールド
| 色コード | 用途 | 出現回数 | 新定義名 |
|---------|------|---------|---------|
| `#2a2a2a` | 入力フィールド背景 | 10+ | `colors.form.background` |
| `#444` | 通常のボーダー | 15+ | `colors.form.border` |
| `#fff` | テキスト（白） | 20+ | `colors.form.text` |
| `#ccc` | プレースホルダー | 5+ | `colors.form.placeholder` |
| `#888` | 無効化テキスト | 2 | `colors.form.textDisabled` |

#### 3. ボタンスタイル
| 色コード | 用途 | 出現回数 | 新定義名 |
|---------|------|---------|---------|
| `#333` | ホバー/無効化背景 | 10+ | `colors.button.secondaryBackground` |
| `#666` | 無効化テキスト | 2 | `colors.button.textDisabled` |
| `#1a1a1a` | ボタンテキスト（濃い背景用） | 3 | `colors.button.textDark` |

#### 4. セクション・モーダル
| 色コード | 用途 | 出現回数 | 新定義名 |
|---------|------|---------|---------|
| `#1a1a1a` | モーダル背景 | 5+ | `colors.modal.background` |
| `#333` | 区切り線 | 5+ | `colors.divider.default` |

#### 5. 必須マーカー
| 色コード | 用途 | 出現回数 | 新定義名 |
|---------|------|---------|---------|
| `#fa5252` | 必須フィールドマーカー | 3 | `colors.form.required` |

#### 6. Timer専用
| 色コード | 用途 | 出現回数 | 新定義名 |
|---------|------|---------|---------|
| `#6b6b6b` | 無効化ボタン背景 | 1 | `colors.button.disabledBackground` |
| `#d0d0d0` | 無効化ボタンテキスト | 1 | `colors.button.disabledText` |

#### 7. アクティビティカラーパレット（formConstants.ts）
これらは変更しない（ユーザー選択用のパレット）

## 実装計画

### Phase 1: 色定義の追加 ✅ 実施中
`shared/config/colors.ts` に新しいカテゴリを追加

### Phase 2: Feature別の更新順序

#### 2-1. shared/components（基盤）
- `FormActions.tsx`

#### 2-2. timer feature（小規模）
- `TimerWidget.tsx`

#### 2-3. activity-definition feature（中規模）
- `forms/TitleField.tsx`
- `forms/IconPicker.tsx`
- `forms/ValueTypeSelect.tsx`
- `forms/UnitField.tsx`
- `forms/ColorPicker.tsx`
- `forms/ActivityForm.tsx`
- `forms/FormActions.tsx` (削除)
- `config/modalStyles.ts`

#### 2-4. activity-record feature（中規模）
- `DateField.tsx`
- `NoteField.tsx`
- `ActivitySelect.tsx`
- `ValueInput.tsx`
- `record-forms/RecordForm.tsx`
- `RecordForm.tsx`

### Phase 3: 検証
- TypeScriptエラーチェック
- 視覚的な確認（色が変わっていないことを確認）

## 変更しないもの

1. **アクティビティカラーパレット** (`formConstants.ts`)
   - ユーザーが選択する色のリスト
   - そのまま保持

2. **defaultActivities.ts の色**
   - サンプルデータの色
   - そのまま保持

3. **account feature のアバターカラー**
   - 独自のカラーパレット
   - そのまま保持

## リスク管理

### 低リスク
- 色定義の追加（既存コードに影響なし）
- shared/components の更新（影響範囲が明確）

### 中リスク
- 各feature内の更新（feature単位でテスト可能）

### 注意点
- 色の変更ではなく「定数化」なので、視覚的な変化はない
- TypeScriptの型チェックで検証可能
