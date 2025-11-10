import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  type Firestore,
  type DocumentData,
  type QueryDocumentSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '@/shared/config/firebase';
import type { ActivityDefinition, ActivityRecord, SavedLayout } from '@/shared/types';
import type { StorageService } from './types';
import { StorageError } from './types';
import { mapFirestoreDocument } from './firestoreUtils';

/**
 * FirestoreドキュメントをActivityDefinitionに変換
 */
function mapToActivityDefinition(
  doc: QueryDocumentSnapshot<DocumentData>
): ActivityDefinition {
  return mapFirestoreDocument<ActivityDefinition>(doc, {
    dateFields: ['createdAt', 'updatedAt'],
  });
}

/**
 * FirestoreドキュメントをActivityRecordに変換
 */
function mapToActivityRecord(
  doc: QueryDocumentSnapshot<DocumentData>
): ActivityRecord {
  return mapFirestoreDocument<ActivityRecord>(doc, {
    dateFields: ['timestamp', 'createdAt', 'updatedAt'],
  });
}

/**
 * Firebase Storage実装のStorageService
 * Feature-Sliced Design: shared/services
 * 
 * Firebase Firestoreを使用してデータを永続化する。
 * ユーザーごとにデータを分離し、セキュアな管理を行う。
 * 
 * コレクション構造:
 * ```
 * users/{userId}/
 *   ├─ activities/{activityId}
 *   ├─ records/{recordId}
 *   └─ settings/
 *       └─ gridLayout
 * ```
 * 
 * @example
 * ```typescript
 * const storage = new FirebaseStorageService('user-id-123');
 * const activities = await storage.getActivities();
 * ```
 */
export class FirebaseStorageService implements StorageService {
  private readonly db: Firestore;
  private readonly userId: string;
  
  /**
   * @param userId - ログインユーザーのID
   * @param db - Firestore instance（省略時は自動取得）
   */
  constructor(userId?: string, db?: Firestore) {
    if (!userId) {
      throw new StorageError(
        'FirebaseStorageService requires a userId',
        'read'
      );
    }
    
    this.userId = userId;
    this.db = db || getFirebaseFirestore();
    
    console.log('[FirebaseStorageService] Initialized for user:', userId);
  }
  
  // ==================== Helper Methods ====================
  
  /**
   * アクティビティコレクションへの参照を取得
   */
  private getActivitiesCollection() {
    return collection(this.db, `users/${this.userId}/activities`);
  }
  
  /**
   * 記録コレクションへの参照を取得
   */
  private getRecordsCollection() {
    return collection(this.db, `users/${this.userId}/records`);
  }
  
  /**
   * 設定ドキュメントへの参照を取得
   */
  private getSettingsDoc() {
    return doc(this.db, `users/${this.userId}/settings/gridLayout`);
  }
  
  // ==================== Activities ====================
  
  async getActivities(): Promise<ActivityDefinition[]> {
    try {
      const querySnapshot = await getDocs(this.getActivitiesCollection());
      const activities = querySnapshot.docs.map(mapToActivityDefinition);
      
      // order順にソート
      return activities.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to get activities:', error);
      throw new StorageError(
        'Failed to fetch activities from Firestore',
        'read',
        error
      );
    }
  }
  
  async saveActivities(activities: ActivityDefinition[]): Promise<void> {
    try {
      // バッチ更新の代わりに、各アクティビティを個別に保存
      // （Firestoreのバッチは別途実装可能）
      const promises = activities.map(activity => 
        setDoc(
          doc(this.getActivitiesCollection(), activity.id),
          {
            ...activity,
            updatedAt: serverTimestamp(),
          }
        )
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to save activities:', error);
      throw new StorageError(
        'Failed to save activities to Firestore',
        'write',
        error
      );
    }
  }
  
  async addActivity(activity: ActivityDefinition): Promise<ActivityDefinition> {
    try {
      const docRef = doc(this.getActivitiesCollection(), activity.id);
      
      const activityData = {
        ...activity,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(docRef, activityData);
      
      // 保存後のデータを返す（serverTimestampを実際の値に変換）
      return {
        ...activity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to add activity:', error);
      throw new StorageError(
        'Failed to add activity to Firestore',
        'write',
        error
      );
    }
  }
  
  async updateActivity(
    id: string,
    updates: Partial<ActivityDefinition>
  ): Promise<ActivityDefinition> {
    try {
      const docRef = doc(this.getActivitiesCollection(), id);
      
      // 既存データを取得
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new StorageError(
          `Activity not found: ${id}`,
          'write'
        );
      }
      
      // 更新
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      // 更新後のデータを返す
      const updatedDoc = await getDoc(docRef);
      return mapToActivityDefinition(updatedDoc as QueryDocumentSnapshot<DocumentData>);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      
      console.error('[FirebaseStorageService] Failed to update activity:', error);
      throw new StorageError(
        'Failed to update activity in Firestore',
        'write',
        error
      );
    }
  }
  
  async deleteActivity(id: string): Promise<void> {
    try {
      const docRef = doc(this.getActivitiesCollection(), id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to delete activity:', error);
      throw new StorageError(
        'Failed to delete activity from Firestore',
        'delete',
        error
      );
    }
  }
  
  // ==================== Records ====================
  
  async getRecords(): Promise<ActivityRecord[]> {
    try {
      const querySnapshot = await getDocs(this.getRecordsCollection());
      const records = querySnapshot.docs.map(mapToActivityRecord);
      
      // timestamp順にソート（新しい順）
      return records.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to get records:', error);
      throw new StorageError(
        'Failed to fetch records from Firestore',
        'read',
        error
      );
    }
  }
  
  async saveRecords(records: ActivityRecord[]): Promise<void> {
    try {
      const promises = records.map(record => 
        setDoc(
          doc(this.getRecordsCollection(), record.id),
          {
            ...record,
            updatedAt: serverTimestamp(),
          }
        )
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to save records:', error);
      throw new StorageError(
        'Failed to save records to Firestore',
        'write',
        error
      );
    }
  }
  
  async addRecord(record: ActivityRecord): Promise<ActivityRecord> {
    try {
      const docRef = doc(this.getRecordsCollection(), record.id);
      
      const recordData = {
        ...record,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(docRef, recordData);
      
      // 保存後のデータを返す
      return {
        ...record,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to add record:', error);
      throw new StorageError(
        'Failed to add record to Firestore',
        'write',
        error
      );
    }
  }
  
  async updateRecord(
    id: string,
    updates: Partial<ActivityRecord>
  ): Promise<ActivityRecord> {
    try {
      const docRef = doc(this.getRecordsCollection(), id);
      
      // 既存データを取得
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new StorageError(
          `Record not found: ${id}`,
          'write'
        );
      }
      
      // 更新
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      // 更新後のデータを返す
      const updatedDoc = await getDoc(docRef);
      return mapToActivityRecord(updatedDoc as QueryDocumentSnapshot<DocumentData>);
    } catch (error) {
      if (error instanceof StorageError) {
        throw error;
      }
      
      console.error('[FirebaseStorageService] Failed to update record:', error);
      throw new StorageError(
        'Failed to update record in Firestore',
        'write',
        error
      );
    }
  }
  
  async deleteRecord(id: string): Promise<void> {
    try {
      const docRef = doc(this.getRecordsCollection(), id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to delete record:', error);
      throw new StorageError(
        'Failed to delete record from Firestore',
        'delete',
        error
      );
    }
  }
  
  async getRecordsByActivityId(activityId: string): Promise<ActivityRecord[]> {
    try {
      const q = query(
        this.getRecordsCollection(),
        where('activityId', '==', activityId)
      );
      
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(mapToActivityRecord);
      
      // timestamp順にソート（新しい順）
      return records.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to get records by activity:', error);
      throw new StorageError(
        'Failed to fetch records by activity from Firestore',
        'read',
        error
      );
    }
  }
  
  // ==================== Grid Layout ====================
  
  async getGridLayout(): Promise<SavedLayout | null> {
    try {
      const docSnap = await getDoc(this.getSettingsDoc());
      
      if (!docSnap.exists()) {
        return null;
      }
      
      const data = docSnap.data();
      return {
        positions: data.positions || {},
      };
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to get grid layout:', error);
      throw new StorageError(
        'Failed to fetch grid layout from Firestore',
        'read',
        error
      );
    }
  }
  
  async saveGridLayout(layout: SavedLayout): Promise<void> {
    try {
      await setDoc(this.getSettingsDoc(), {
        positions: layout.positions,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('[FirebaseStorageService] Failed to save grid layout:', error);
      throw new StorageError(
        'Failed to save grid layout to Firestore',
        'write',
        error
      );
    }
  }
}
