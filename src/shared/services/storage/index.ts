/**
 * Storage Service Module
 * Feature-Sliced Design: shared/services/storage
 * 
 * データ永続化の抽象化層。
 * localStorage、Firebase、その他のストレージ実装を統一的に扱う。
 */

export type { StorageService, StorageType } from './types';
export { StorageError } from './types';
export { BaseStorageService } from './BaseStorageService';
export { LocalStorageService } from './LocalStorageService';
export { FirebaseStorageService } from './FirebaseStorageService';
export { StorageProvider, useStorage } from './StorageProvider';
export { StorageProviderWithAuth } from './StorageProviderWithAuth';
export { mapFirestoreDocument, convertToDate } from './firestoreUtils';
export type { DateFieldConfig } from './firestoreUtils';
export { 
  migrateLocalStorageToFirebase, 
  isMigrationCompleted, 
  resetMigrationFlag 
} from './migrateToFirebase';
