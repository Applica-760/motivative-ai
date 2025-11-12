import type { StorageService } from '@/shared/services/storage';

/**
 * マイグレーション結果の型定義
 */
export interface MigrationResult {
  /** マイグレーションが成功したかどうか */
  success: boolean;
  /** マイグレーションされたデータの詳細 */
  migratedData: {
    activities: number;
    records: number;
    gridLayout: boolean;
  };
  /** エラーメッセージの配列 */
  errors: string[];
}

/**
 * LocalStorageからFirebaseへのデータマイグレーション
 * Feature-Sliced Design: features/auth/model
 * 
 * ログイン時に一度だけ実行され、LocalStorageに保存されていた
 * データをFirebaseへコピーする。これにより、ユーザーの設定や
 * データが保持される。
 * 
 * マイグレーション対象:
 * - アクティビティ定義
 * - アクティビティ記録
 * - グリッドレイアウトの位置情報
 * 
 * @param localStorage - マイグレーション元のLocalStorageService
 * @param firebaseStorage - マイグレーション先のFirebaseStorageService
 * @returns マイグレーション結果の概要
 */
export async function migrateLocalStorageToFirebase(
  localStorage: StorageService,
  firebaseStorage: StorageService
): Promise<MigrationResult> {
  console.log('[Migration] Starting LocalStorage → Firebase migration');
  
  const errors: string[] = [];
  const migratedData = {
    activities: 0,
    records: 0,
    gridLayout: false,
  };

  try {
    // 1. グリッドレイアウトのマイグレーション
    try {
      const localGridLayout = await localStorage.getGridLayout();
      
      if (localGridLayout) {
        // Firebaseに既存データがあるかチェック
        const firebaseGridLayout = await firebaseStorage.getGridLayout();
        
        if (!firebaseGridLayout) {
          // Firebaseにデータがない場合のみマイグレーション
          await firebaseStorage.saveGridLayout(localGridLayout);
          migratedData.gridLayout = true;
          console.log('[Migration] Grid layout migrated successfully');
        } else {
          console.log('[Migration] Grid layout already exists in Firebase, skipping');
        }
      } else {
        console.log('[Migration] No grid layout found in LocalStorage');
      }
    } catch (error) {
      const errorMsg = `Failed to migrate grid layout: ${error}`;
      console.error(`[Migration] ${errorMsg}`);
      errors.push(errorMsg);
    }

    // 2. アクティビティ定義のマイグレーション
    try {
      const localActivities = await localStorage.getActivities();
      
      if (localActivities.length > 0) {
        // Firebaseに既存データがあるかチェック
        const firebaseActivities = await firebaseStorage.getActivities();
        
        if (firebaseActivities.length === 0) {
          // Firebaseにデータがない場合のみマイグレーション
          await firebaseStorage.saveActivities(localActivities);
          migratedData.activities = localActivities.length;
          console.log(`[Migration] ${localActivities.length} activities migrated successfully`);
        } else {
          console.log('[Migration] Activities already exist in Firebase, skipping');
        }
      } else {
        console.log('[Migration] No activities found in LocalStorage');
      }
    } catch (error) {
      const errorMsg = `Failed to migrate activities: ${error}`;
      console.error(`[Migration] ${errorMsg}`);
      errors.push(errorMsg);
    }

    // 3. アクティビティ記録のマイグレーション
    try {
      const localRecords = await localStorage.getRecords();
      
      if (localRecords.length > 0) {
        // Firebaseに既存データがあるかチェック
        const firebaseRecords = await firebaseStorage.getRecords();
        
        if (firebaseRecords.length === 0) {
          // Firebaseにデータがない場合のみマイグレーション
          await firebaseStorage.saveRecords(localRecords);
          migratedData.records = localRecords.length;
          console.log(`[Migration] ${localRecords.length} records migrated successfully`);
        } else {
          console.log('[Migration] Records already exist in Firebase, skipping');
        }
      } else {
        console.log('[Migration] No records found in LocalStorage');
      }
    } catch (error) {
      const errorMsg = `Failed to migrate records: ${error}`;
      console.error(`[Migration] ${errorMsg}`);
      errors.push(errorMsg);
    }

    // マイグレーション完了のマーク
    const hasMigratedData = 
      migratedData.gridLayout || 
      migratedData.activities > 0 || 
      migratedData.records > 0;

    if (hasMigratedData) {
      // マイグレーション完了フラグをStorageService経由で保存
      // LocalStorageとFirebase両方に保存することで、次回以降の実行を防ぐ
      await Promise.all([
        localStorage.setMigrationFlag(true),
        firebaseStorage.setMigrationFlag(true),
      ]);
      console.log('[Migration] Migration completed successfully');
    } else {
      console.log('[Migration] No data to migrate');
    }

    return {
      success: errors.length === 0,
      migratedData,
      errors,
    };
  } catch (error) {
    console.error('[Migration] Unexpected error during migration:', error);
    return {
      success: false,
      migratedData,
      errors: [...errors, `Unexpected error: ${error}`],
    };
  }
}

/**
 * マイグレーションが完了しているかチェック
 * 
 * @param storage - チェック対象のStorageService
 * @returns マイグレーション完了フラグ
 */
export async function isMigrationCompleted(storage: StorageService): Promise<boolean> {
  try {
    return await storage.getMigrationFlag();
  } catch (error) {
    console.error('[Migration] Failed to check migration flag:', error);
    return false;
  }
}

/**
 * マイグレーション完了フラグをリセット
 * （開発・テスト用）
 * 
 * @param storage - リセット対象のStorageService
 */
export async function resetMigrationFlag(storage: StorageService): Promise<void> {
  try {
    await storage.setMigrationFlag(false);
    console.log('[Migration] Migration flag reset');
  } catch (error) {
    console.error('[Migration] Failed to reset migration flag:', error);
  }
}
