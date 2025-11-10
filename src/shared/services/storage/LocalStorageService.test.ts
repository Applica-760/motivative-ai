import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageService } from './LocalStorageService';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { STORAGE_KEYS } from '@/shared/config';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    // localStorageをクリア
    localStorage.clear();
    service = new LocalStorageService();
  });

  describe('Activities', () => {
    const mockActivity: ActivityDefinition = {
      id: 'test-activity-1',
      title: 'Test Activity',
      icon: '🏃',
      valueType: 'number',
      unit: 'km',
      color: '#FF6B6B',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
      order: 1,
      isArchived: false,
    };

    it('should return empty array when no activities exist', async () => {
      const activities = await service.getActivities();
      expect(activities).toEqual([]);
    });

    it('should save and retrieve activities', async () => {
      await service.saveActivities([mockActivity]);
      const activities = await service.getActivities();
      
      expect(activities).toHaveLength(1);
      expect(activities[0].id).toBe(mockActivity.id);
      expect(activities[0].title).toBe(mockActivity.title);
    });

    it('should restore Date objects when retrieving activities', async () => {
      await service.saveActivities([mockActivity]);
      const activities = await service.getActivities();
      
      expect(activities[0].createdAt).toBeInstanceOf(Date);
      expect(activities[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should add a new activity', async () => {
      const added = await service.addActivity(mockActivity);
      const activities = await service.getActivities();
      
      expect(activities).toHaveLength(1);
      expect(added.id).toBe(mockActivity.id);
    });

    it('should update an existing activity', async () => {
      await service.addActivity(mockActivity);
      
      const updated = await service.updateActivity(mockActivity.id, {
        title: 'Updated Title',
      });
      
      expect(updated.title).toBe('Updated Title');
      expect(updated.id).toBe(mockActivity.id);
      
      const activities = await service.getActivities();
      expect(activities[0].title).toBe('Updated Title');
    });

    it('should throw error when updating non-existent activity', async () => {
      await expect(
        service.updateActivity('non-existent-id', { title: 'Updated' })
      ).rejects.toThrow('Activity not found');
    });

    it('should delete an activity', async () => {
      await service.addActivity(mockActivity);
      await service.deleteActivity(mockActivity.id);
      
      const activities = await service.getActivities();
      expect(activities).toHaveLength(0);
    });

    it('should throw error when deleting non-existent activity', async () => {
      await expect(
        service.deleteActivity('non-existent-id')
      ).rejects.toThrow('Activity not found');
    });
  });

  describe('Records', () => {
    const mockRecord: ActivityRecord = {
      id: 'test-record-1',
      activityId: 'activity-1',
      value: { type: 'number', value: 5.2, unit: 'km' },
      date: '2025-01-01',
      timestamp: new Date('2025-01-01T10:00:00'),
      note: 'Test note',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    };

    it('should return empty array when no records exist', async () => {
      const records = await service.getRecords();
      expect(records).toEqual([]);
    });

    it('should save and retrieve records', async () => {
      await service.saveRecords([mockRecord]);
      const records = await service.getRecords();
      
      expect(records).toHaveLength(1);
      expect(records[0].id).toBe(mockRecord.id);
    });

    it('should restore Date objects when retrieving records', async () => {
      await service.saveRecords([mockRecord]);
      const records = await service.getRecords();
      
      expect(records[0].timestamp).toBeInstanceOf(Date);
      expect(records[0].createdAt).toBeInstanceOf(Date);
      expect(records[0].updatedAt).toBeInstanceOf(Date);
    });

    it('should add a new record', async () => {
      const added = await service.addRecord(mockRecord);
      const records = await service.getRecords();
      
      expect(records).toHaveLength(1);
      expect(added.id).toBe(mockRecord.id);
    });

    it('should update an existing record', async () => {
      await service.addRecord(mockRecord);
      
      const updated = await service.updateRecord(mockRecord.id, {
        note: 'Updated note',
      });
      
      expect(updated.note).toBe('Updated note');
      expect(updated.id).toBe(mockRecord.id);
    });

    it('should delete a record', async () => {
      await service.addRecord(mockRecord);
      await service.deleteRecord(mockRecord.id);
      
      const records = await service.getRecords();
      expect(records).toHaveLength(0);
    });

    it('should get records by activity ID', async () => {
      const record1 = { ...mockRecord, id: 'record-1', activityId: 'activity-1' };
      const record2 = { ...mockRecord, id: 'record-2', activityId: 'activity-2' };
      
      await service.saveRecords([record1, record2]);
      
      const filtered = await service.getRecordsByActivityId('activity-1');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('record-1');
    });
  });

  describe('Grid Layout', () => {
    const mockLayout = {
      positions: {
        'item-1': { column: 1, row: 1, columnSpan: 1 as const },
        'item-2': { column: 2, row: 1, columnSpan: 2 as const },
      },
    };

    it('should return null when no layout exists', async () => {
      const layout = await service.getGridLayout();
      expect(layout).toBeNull();
    });

    it('should save and retrieve grid layout', async () => {
      await service.saveGridLayout(mockLayout);
      const layout = await service.getGridLayout();
      
      expect(layout).toEqual(mockLayout);
    });
  });

  describe('Error Handling', () => {
    it('should throw StorageError on invalid JSON', async () => {
      // 不正なJSONを直接設定
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, 'invalid-json{');
      
      await expect(service.getActivities()).rejects.toThrow('Failed to read');
    });
  });
});
