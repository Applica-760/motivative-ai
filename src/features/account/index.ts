/**
 * Account Feature
 * Feature-Sliced Design: features/account
 * 
 * ユーザーアカウント・プロフィール管理機能
 * 認証機能（auth）とは独立し、ユーザー情報の管理に特化
 */

// Model
export type { UserProfile, UpdateProfileData, Gender } from './model/types';
export { ProfileProvider, useProfile } from './model';

// UI
export { ProfileForm, ProfileModal } from './ui';

// Config
export { AVATAR_ICONS, DEFAULT_COLORS, getAvatarIcon, GENDER_OPTIONS, VALIDATION_RULES } from './config';
export type { AvatarIconDefinition } from './config';

// API (通常は外部に公開しないが、テスト用に)
export { ProfileRepository } from './api';
