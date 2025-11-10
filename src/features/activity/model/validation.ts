import type { ActivityFormData, ActivityFormErrors } from './formTypes';

/**
 * バリデーションオプション
 */
interface ValidationOptions {
  /** 編集対象のアクティビティID（編集モードの場合） */
  excludeActivityId?: string;
  /** 既存のアクティビティタイトル一覧（重複チェック用） */
  existingTitles?: string[];
}

/**
 * アクティビティ作成フォームのバリデーション
 * 
 * @param data - フォームデータ
 * @param options - バリデーションオプション
 * @returns バリデーションエラー（エラーがない場合は空オブジェクト）
 */
export function validateActivityForm(
  data: ActivityFormData,
  options?: ValidationOptions
): ActivityFormErrors {
  const errors: ActivityFormErrors = {};

  // タイトルのバリデーション
  if (!data.title.trim()) {
    errors.title = 'アクティビティ名を入力してください';
  } else if (data.title.length > 50) {
    errors.title = 'アクティビティ名は50文字以内で入力してください';
  } else if (options?.existingTitles) {
    // 重複チェック（編集モードの場合は自身を除外）
    const isDuplicate = options.existingTitles.some(
      (title) => title.toLowerCase() === data.title.trim().toLowerCase()
    );
    if (isDuplicate) {
      errors.title = 'このアクティビティ名は既に使用されています';
    }
  }

  // アイコンのバリデーション
  if (!data.icon.trim()) {
    errors.icon = 'アイコンを選択してください';
  }

  // 値の型のバリデーション
  if (!data.valueType) {
    errors.valueType = '記録タイプを選択してください';
  }

  // 単位のバリデーション（数値型・期間型の場合）
  if (
    (data.valueType === 'number' || 
     data.valueType === 'duration') &&
    !data.unit?.trim()
  ) {
    errors.unit = '単位を入力してください';
  }

  // カラーのバリデーション
  if (!data.color) {
    errors.color = 'カラーを選択してください';
  } else if (!/^#[0-9A-F]{6}$/i.test(data.color)) {
    errors.color = '正しいカラーコードを入力してください';
  }

  return errors;
}

/**
 * フォームデータが有効かどうかをチェック
 * 
 * @param data - フォームデータ
 * @param options - バリデーションオプション
 * @returns エラーがない場合はtrue
 */
export function isValidActivityForm(
  data: ActivityFormData,
  options?: ValidationOptions
): boolean {
  const errors = validateActivityForm(data, options);
  return Object.keys(errors).length === 0;
}
