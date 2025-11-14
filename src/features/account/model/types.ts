/**
 * Account Model Types
 * Feature-Sliced Design: features/account/model
 *
 * ユーザーアカウント・プロフィールに関連する型定義
 *
 * NOTE: UserProfile、UpdateProfileData、Gender型は
 * shared/types/user.ts に移動しました（逆依存解消のため）
 * このファイルでは後方互換性のために再エクスポートしています
 */

export type { Gender, UserProfile, UpdateProfileData } from '@/shared/types';
