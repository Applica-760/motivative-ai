/**
 * Activity Repositories
 * Feature-Sliced Design: features/activity/api/repositories
 * 
 * 各サブfeatureのリポジトリを再エクスポート
 */

// activity-definition repositories
export type { ActivityRepository } from '@/features/activity-definition/api/repositories';
export { ActivityRepositoryImpl } from '@/features/activity-definition/api/repositories';

// activity-record repositories
export type { RecordRepository } from '@/features/activity-record/api/repositories';
export { RecordRepositoryImpl } from '@/features/activity-record/api/repositories';
