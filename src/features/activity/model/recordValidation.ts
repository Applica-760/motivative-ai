import type { RecordFormData, RecordFormErrors } from './recordFormTypes';

/**
 * 記録追加フォームのバリデーション
 * 
 * @param data - フォームデータ
 * @returns バリデーションエラー（エラーがない場合は空オブジェクト）
 */
export function validateRecordForm(data: RecordFormData): RecordFormErrors {
  const errors: RecordFormErrors = {};

  // アクティビティIDのバリデーション
  if (!data.activityId) {
    errors.activityId = 'アクティビティを選択してください';
  }

  // 値のバリデーション
  if (!data.value) {
    errors.value = '値を入力してください';
  } else {
    // 値の型に応じたバリデーション
    switch (data.value.type) {
      case 'number':
      case 'duration':
        if (typeof data.value.value !== 'number' || data.value.value < 0) {
          errors.value = '0以上の数値を入力してください';
        }
        break;
      case 'text':
        if (typeof data.value.value !== 'string' || !data.value.value.trim()) {
          errors.value = 'テキストを入力してください';
        }
        break;
      case 'boolean':
        if (typeof data.value.value !== 'boolean') {
          errors.value = '実施状態を選択してください';
        }
        break;
    }
  }

  // 日付のバリデーション
  if (!data.date) {
    errors.date = '日付を選択してください';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.date = '正しい日付形式で入力してください';
    } else {
      // 未来の日付はエラー
      const selectedDate = new Date(data.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        errors.date = '未来の日付は選択できません';
      }
    }
  }

  // メモのバリデーション（オプション）
  if (data.note && data.note.length > 500) {
    errors.note = 'メモは500文字以内で入力してください';
  }

  return errors;
}

/**
 * フォームデータが有効かどうかをチェック
 * 
 * @param data - フォームデータ
 * @returns エラーがない場合はtrue
 */
export function isValidRecordForm(data: RecordFormData): boolean {
  const errors = validateRecordForm(data);
  return Object.keys(errors).length === 0;
}
