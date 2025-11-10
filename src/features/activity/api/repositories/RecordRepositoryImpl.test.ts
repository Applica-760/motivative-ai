import { describe, it, expect, beforeEach } from 'vitest';
import { RecordRepositoryImpl } from './RecordRepositoryImpl';
import { ActivityRepositoryImpl } from './ActivityRepositoryImpl';
import { LocalStorageService } from '@/shared/services/storage/LocalStorageService';
import type { ActivityRecord } from '@/shared/types';

describe('RecordRepositoryImpl', () => {
  let recordRepository: RecordRepositoryImpl;
  let activityRepository: ActivityRepositoryImpl;
  let storageService: LocalStorageService;
  let testActivityId: string;

  beforeEach(async () => {
    // localStorageをクリア
    localStorage.clear();
    storageService = new LocalStorageService();
    recordRepository = new RecordRepositoryImpl(storageService);
    activityRepository = new ActivityRepositoryImpl(storageService);

    // テスト用のアクティビティを作成
    const activity = await activityRepository.create({
      title: 'テストアクティビティ',
      icon: '📝',
      valueType: 'number',
      color: '#3b82f6',
      unit: '回',
      isArchived: false,
    });
    testActivityId = activity.id;
  });

  describe('Create (作成)', () => {
    it('新しい記録を作成できる', async () => {
      const recordData: Omit<ActivityRecord, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'> = {
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
        note: 'テスト記録',
      };

      const record = await recordRepository.create(recordData);

      expect(record.id).toBeTruthy();
      expect(record.activityId).toBe(testActivityId);
      expect(record.value).toEqual({ type: 'number', value: 10, unit: '回' });
      expect(record.date).toBe('2025-01-10');
      expect(record.note).toBe('テスト記録');
      expect(record.timestamp).toBeInstanceOf(Date);
      expect(record.createdAt).toBeInstanceOf(Date);
      expect(record.updatedAt).toBeInstanceOf(Date);
    });

    it('IDがユニークである', async () => {
      const record1 = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      const record2 = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 20, unit: '回' },
        date: '2025-01-11',
      });

      expect(record1.id).not.toBe(record2.id);
    });

    it('noteなしで作成できる', async () => {
      const record = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      expect(record.note).toBeUndefined();
    });

    it('StorageServiceに正しく保存される', async () => {
      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      const records = await storageService.getRecords();
      expect(records).toHaveLength(1);
      expect(records[0].activityId).toBe(testActivityId);
    });
  });

  describe('GetAll (全件取得)', () => {
    it('すべての記録を取得できる', async () => {
      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 20, unit: '回' },
        date: '2025-01-11',
      });

      const records = await recordRepository.getAll();
      expect(records).toHaveLength(2);
    });

    it('空の配列を返す（データがない場合）', async () => {
      const records = await recordRepository.getAll();
      expect(records).toEqual([]);
    });

    it('複数のアクティビティの記録を取得できる', async () => {
      const activity2 = await activityRepository.create({
        title: 'アクティビティ2',
        icon: '🏃',
        valueType: 'number',
        color: '#10b981',
        unit: 'km',
        isArchived: false,
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      await recordRepository.create({
        activityId: activity2.id,
        value: { type: 'number', value: 5, unit: 'km' },
        date: '2025-01-10',
      });

      const records = await recordRepository.getAll();
      expect(records).toHaveLength(2);
    });
  });

  describe('GetById (ID検索)', () => {
    it('IDで記録を取得できる', async () => {
      const created = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      const found = await recordRepository.getById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.activityId).toBe(testActivityId);
    });

    it('存在しないIDの場合はnullを返す', async () => {
      const found = await recordRepository.getById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('GetByActivityId (アクティビティIDで検索)', () => {
    it('特定のアクティビティの記録のみを取得できる', async () => {
      const activity2 = await activityRepository.create({
        title: 'アクティビティ2',
        icon: '🏃',
        valueType: 'number',
        color: '#10b981',
        unit: 'km',
        isArchived: false,
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 20, unit: '回' },
        date: '2025-01-11',
      });

      await recordRepository.create({
        activityId: activity2.id,
        value: { type: 'number', value: 5, unit: 'km' },
        date: '2025-01-10',
      });

      const records = await recordRepository.getByActivityId(testActivityId);
      expect(records).toHaveLength(2);
      expect(records.every(r => r.activityId === testActivityId)).toBe(true);
    });

    it('記録がない場合は空配列を返す', async () => {
      const records = await recordRepository.getByActivityId(testActivityId);
      expect(records).toEqual([]);
    });
  });

  describe('GetByDateRange (期間検索)', () => {
    beforeEach(async () => {
      // テストデータを作成
      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-05',
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 20, unit: '回' },
        date: '2025-01-10',
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 30, unit: '回' },
        date: '2025-01-15',
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 40, unit: '回' },
        date: '2025-01-20',
      });
    });

    it('指定期間の記録を取得できる', async () => {
      const records = await recordRepository.getByDateRange('2025-01-08', '2025-01-18');
      
      expect(records).toHaveLength(2);
      expect(records.map(r => r.date)).toEqual(['2025-01-10', '2025-01-15']);
    });

    it('開始日を含む', async () => {
      const records = await recordRepository.getByDateRange('2025-01-10', '2025-01-15');
      
      expect(records).toHaveLength(2);
      expect(records.map(r => r.date)).toEqual(['2025-01-10', '2025-01-15']);
    });

    it('終了日を含む', async () => {
      const records = await recordRepository.getByDateRange('2025-01-10', '2025-01-15');
      
      const dates = records.map(r => r.date);
      expect(dates).toContain('2025-01-15');
    });

    it('該当する記録がない場合は空配列を返す', async () => {
      const records = await recordRepository.getByDateRange('2025-02-01', '2025-02-28');
      expect(records).toEqual([]);
    });
  });

  describe('GetByActivityIdAndDateRange (アクティビティ + 期間検索)', () => {
    let activity2Id: string;

    beforeEach(async () => {
      const activity2 = await activityRepository.create({
        title: 'アクティビティ2',
        icon: '🏃',
        valueType: 'number',
        color: '#10b981',
        unit: 'km',
        isArchived: false,
      });
      activity2Id = activity2.id;

      // アクティビティ1の記録
      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-05',
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 20, unit: '回' },
        date: '2025-01-15',
      });

      // アクティビティ2の記録
      await recordRepository.create({
        activityId: activity2Id,
        value: { type: 'number', value: 5, unit: 'km' },
        date: '2025-01-10',
      });

      await recordRepository.create({
        activityId: activity2Id,
        value: { type: 'number', value: 10, unit: 'km' },
        date: '2025-01-20',
      });
    });

    it('特定のアクティビティの指定期間の記録を取得できる', async () => {
      const records = await recordRepository.getByActivityIdAndDateRange(
        testActivityId,
        '2025-01-01',
        '2025-01-10'
      );

      expect(records).toHaveLength(1);
      expect(records[0].activityId).toBe(testActivityId);
      expect(records[0].date).toBe('2025-01-05');
    });

    it('他のアクティビティの記録は含まれない', async () => {
      const records = await recordRepository.getByActivityIdAndDateRange(
        testActivityId,
        '2025-01-01',
        '2025-01-31'
      );

      expect(records.every(r => r.activityId === testActivityId)).toBe(true);
    });

    it('該当する記録がない場合は空配列を返す', async () => {
      const records = await recordRepository.getByActivityIdAndDateRange(
        testActivityId,
        '2025-02-01',
        '2025-02-28'
      );

      expect(records).toEqual([]);
    });
  });

  describe('Update (更新)', () => {
    it('記録を更新できる', async () => {
      const record = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
        note: '元のメモ',
      });

      const updated = await recordRepository.update(record.id, {
        value: { type: 'number', value: 20, unit: '回' },
        note: '更新されたメモ',
      });

      expect(updated.id).toBe(record.id);
      expect(updated.value).toEqual({ type: 'number', value: 20, unit: '回' });
      expect(updated.note).toBe('更新されたメモ');
      expect(updated.date).toBe('2025-01-10'); // 変更されていない
      expect(updated.activityId).toBe(testActivityId); // 変更されていない
    });

    it('updatedAtが更新される', async () => {
      const record = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      const originalUpdatedAt = record.updatedAt.getTime();

      // 少し待機
      await new Promise(resolve => setTimeout(resolve, 100));

      const updated = await recordRepository.update(record.id, {
        value: { type: 'number', value: 20, unit: '回' },
      });

      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt);
    });

    it('createdAtは変更されない', async () => {
      const record = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      const originalCreatedAt = record.createdAt.getTime();

      const updated = await recordRepository.update(record.id, {
        value: { type: 'number', value: 20, unit: '回' },
      });

      expect(updated.createdAt.getTime()).toBe(originalCreatedAt);
    });

    it('存在しないIDでエラーが発生する', async () => {
      await expect(
        recordRepository.update('non-existent-id', {
          value: { type: 'number', value: 20, unit: '回' },
        })
      ).rejects.toThrow();
    });
  });

  describe('Delete (削除)', () => {
    it('記録を削除できる', async () => {
      const record = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      await recordRepository.delete(record.id);

      const found = await recordRepository.getById(record.id);
      expect(found).toBeNull();
    });

    it('削除後、getAllで取得できない', async () => {
      const record1 = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 20, unit: '回' },
        date: '2025-01-11',
      });

      await recordRepository.delete(record1.id);

      const records = await recordRepository.getAll();
      expect(records).toHaveLength(1);
      expect(records[0].value).toEqual({ type: 'number', value: 20, unit: '回' });
    });

    it('存在しないIDでエラーが発生する', async () => {
      await expect(
        recordRepository.delete('non-existent-id')
      ).rejects.toThrow();
    });
  });

  describe('Data Persistence (データ永続化)', () => {
    it('新しいRepositoryインスタンスでもデータが保持される', async () => {
      const record = await recordRepository.create({
        activityId: testActivityId,
        value: { type: 'number', value: 10, unit: '回' },
        date: '2025-01-10',
      });

      // 新しいインスタンスを作成
      const newStorageService = new LocalStorageService();
      const newRepository = new RecordRepositoryImpl(newStorageService);

      const found = await newRepository.getById(record.id);
      expect(found).not.toBeNull();
      expect(found?.activityId).toBe(testActivityId);
    });
  });

  describe('Error Handling (エラーハンドリング)', () => {
    it('StorageServiceのエラーを適切に処理する', async () => {
      // StorageServiceが例外をスローする状況をシミュレート
      const faultyStorage = {
        ...storageService,
        getRecords: async () => {
          throw new Error('Storage error');
        },
      };

      const faultyRepository = new RecordRepositoryImpl(faultyStorage as unknown as LocalStorageService);

      await expect(
        faultyRepository.getAll()
      ).rejects.toThrow('Failed to fetch records');
    });
  });
});
