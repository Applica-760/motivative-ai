/**
 * Account Model Types
 * Feature-Sliced Design: features/account/model
 * 
 * ユーザーアカウント・プロフィールに関連する型定義
 */

/**
 * 性別の選択肢
 */
export type Gender = '男性' | '女性' | 'その他' | '未設定';

/**
 * ユーザープロフィール情報
 */
export interface UserProfile {
  /** ユーザーID（Userと同じID） */
  userId: string;
  
  /** ユーザー名 */
  displayName: string;
  
  /** 性別（デフォルト: 未設定） */
  gender: Gender;
  
  /** アイコン画像の色 */
  iconColor: string;
  
  /** アバターアイコン名（Tabler Icons） */
  avatarIcon: string;
  
  /** AIに伝えたいこと（パーソナライズ設定） */
  aiMessage: string;
  
  /** プロフィール作成日時 */
  createdAt: Date;
  
  /** プロフィール更新日時 */
  updatedAt: Date;
}

/**
 * プロフィール更新用のデータ
 */
export interface UpdateProfileData {
  /** ユーザー名 */
  displayName?: string;
  
  /** 性別 */
  gender?: Gender;
  
  /** アイコン画像の色 */
  iconColor?: string;
  
  /** アバターアイコン名 */
  avatarIcon?: string;
  
  /** AIに伝えたいこと */
  aiMessage?: string;
}
