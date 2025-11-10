import { describe, it, expect, beforeEach } from 'vitest';import { describe, it, expect, beforeEach } from 'vitest';import { describe, it, expect, beforeEach } from 'vitest';import { describe, it, expect, beforeEach } from 'vitest';import { describe, it, expect, beforeEach } from 'vitest';

import { ActivityRepositoryImpl } from './ActivityRepositoryImpl';

import { LocalStorageService } from '@/shared/services/storage/LocalStorageService';import { ActivityRepositoryImpl } from './ActivityRepositoryImpl';

import type { ActivityDefinition } from '@/shared/types';

import { LocalStorageService } from '@/shared/services/storage/LocalStorageService';import { ActivityRepositoryImpl } from './ActivityRepositoryImpl';

describe('ActivityRepositoryImpl', () => {

  let repository: ActivityRepositoryImpl;import type { ActivityDefinition } from '@/shared/types';

  let storageService: LocalStorageService;

import { LocalStorageService } from '@/shared/services/storage/LocalStorageService';import { ActivityRepositoryImpl } from './ActivityRepositoryImpl';import { ActivityRepositoryImpl } from './ActivityRepositoryImpl';

  beforeEach(() => {

    localStorage.clear();describe('ActivityRepositoryImpl', () => {

    storageService = new LocalStorageService();

    repository = new ActivityRepositoryImpl(storageService);  let repository: ActivityRepositoryImpl;import type { ActivityDefinition } from '@/shared/types';

  });

  let storageService: LocalStorageService;

  describe('Create', () => {

    it('新しいアクティビティを作成できる', async () => {import { LocalStorageService } from '@/shared/services/storage/LocalStorageService';import { LocalStorageService } from '@/shared/services/storage/LocalStorageService';

      const activityData: Omit<ActivityDefinition, 'id' | 'order' | 'createdAt' | 'updatedAt'> = {

        title: 'テストアクティビティ',  beforeEach(() => {

        icon: '📝',

        valueType: 'number',    // localStorageをクリアdescribe('ActivityRepositoryImpl', () => {

        color: '#3b82f6',

        unit: '回',    localStorage.clear();

        isArchived: false,

      };    storageService = new LocalStorageService();  let repository: ActivityRepositoryImpl;import type { ActivityDefinition } from '@/shared/types';import type { ActivityDefinition } from '@/shared/types';



      const activity = await repository.create(activityData);    repository = new ActivityRepositoryImpl(storageService);



      expect(activity.id).toBeTruthy();  });  let storageService: LocalStorageService;

      expect(activity.title).toBe('テストアクティビティ');

      expect(activity.icon).toBe('📝');

      expect(activity.valueType).toBe('number');

      expect(activity.color).toBe('#3b82f6');  describe('Create', () => {

      expect(activity.unit).toBe('回');

      expect(activity.isArchived).toBe(false);    it('新しいアクティビティを作成できる', async () => {

      expect(activity.order).toBe(1);

      expect(activity.createdAt).toBeInstanceOf(Date);      const activityData: Omit<ActivityDefinition, 'id' | 'order' | 'createdAt' | 'updatedAt'> = {  beforeEach(() => {

      expect(activity.updatedAt).toBeInstanceOf(Date);

    });        title: 'テストアクティビティ',



    it('IDがユニークである', async () => {        icon: '📝',    localStorage.clear();describe('ActivityRepositoryImpl', () => {describe('ActivityRepositoryImpl', () => {

      const activity1 = await repository.create({

        title: 'アクティビティ1',        valueType: 'number',

        icon: '📝',

        valueType: 'number',        color: '#3b82f6',    storageService = new LocalStorageService();

        color: '#3b82f6',

        unit: '回',        unit: '回',

        isArchived: false,

      });        isArchived: false,    repository = new ActivityRepositoryImpl(storageService);  let repository: ActivityRepositoryImpl;  let repository: ActivityRepositoryImpl;



      const activity2 = await repository.create({      };

        title: 'アクティビティ2',

        icon: '📚',  });

        valueType: 'boolean',

        color: '#10b981',      const activity = await repository.create(activityData);

        isArchived: false,

      });  let storageService: LocalStorageService;  let storageService: LocalStorageService;



      expect(activity1.id).not.toBe(activity2.id);      expect(activity.id).toBeTruthy();

    });

      expect(activity.title).toBe('テストアクティビティ');  describe('Create', () => {

    it('StorageServiceに正しく保存される', async () => {

      await repository.create({      expect(activity.icon).toBe('📝');

        title: 'テストアクティビティ',

        icon: '📝',      expect(activity.valueType).toBe('number');    it('新しいアクティビティを作成できる', async () => {

        valueType: 'number',

        color: '#3b82f6',      expect(activity.color).toBe('#3b82f6');

        unit: '回',

        isArchived: false,      expect(activity.unit).toBe('回');      const activityData: Omit<ActivityDefinition, 'id' | 'order' | 'createdAt' | 'updatedAt'> = {

      });

      expect(activity.isArchived).toBe(false);

      const activities = await storageService.getActivities();

      expect(activities).toHaveLength(1);      expect(activity.order).toBe(1);        title: 'テストアクティビティ',  beforeEach(() => {  beforeEach(() => {

      expect(activities[0].title).toBe('テストアクティビティ');

    });      expect(activity.createdAt).toBeInstanceOf(Date);

  });

      expect(activity.updatedAt).toBeInstanceOf(Date);        icon: '📝',

  describe('GetAll', () => {

    it('すべてのアクティビティを取得できる', async () => {    });

      await repository.create({

        title: 'アクティビティ1',        valueType: 'number',    // localStorageをクリア    // localStorageをクリア

        icon: '📝',

        valueType: 'number',    it('IDがユニークである', async () => {

        color: '#3b82f6',

        unit: '回',      const activity1 = await repository.create({        color: '#3b82f6',

        isArchived: false,

      });        title: 'アクティビティ1',



      await repository.create({        icon: '📝',        unit: '回',    localStorage.clear();    localStorage.clear();

        title: 'アクティビティ2',

        icon: '📚',        valueType: 'number',

        valueType: 'boolean',

        color: '#10b981',        color: '#3b82f6',        isArchived: false,

        isArchived: false,

      });        unit: '回',



      const activities = await repository.getAll();        isArchived: false,      };    storageService = new LocalStorageService();    storageService = new LocalStorageService();

      expect(activities).toHaveLength(2);

    });      });



    it('空の配列を返す（データがない場合）', async () => {

      const activities = await repository.getAll();

      expect(activities).toEqual([]);      const activity2 = await repository.create({

    });

  });        title: 'アクティビティ2',      const activity = await repository.create(activityData);    repository = new ActivityRepositoryImpl(storageService);    repository = new ActivityRepositoryImpl(storageService);



  describe('GetById', () => {        icon: '📚',

    it('IDでアクティビティを取得できる', async () => {

      const created = await repository.create({        valueType: 'boolean',

        title: 'テストアクティビティ',

        icon: '📝',        color: '#10b981',

        valueType: 'number',

        color: '#3b82f6',        isArchived: false,      expect(activity.id).toBeTruthy();  });  });

        unit: '回',

        isArchived: false,      });

      });

      expect(activity.title).toBe(activityData.title);

      const activity = await repository.getById(created.id);

      expect(activity).not.toBeNull();      expect(activity1.id).not.toBe(activity2.id);

      expect(activity?.id).toBe(created.id);

      expect(activity?.title).toBe('テストアクティビティ');    });      expect(activity.order).toBe(0);

    });



    it('存在しないIDの場合はnullを返す', async () => {

      const activity = await repository.getById('non-existent-id');    it('orderが自動的に採番される', async () => {      expect(activity.createdAt).toBeInstanceOf(Date);

      expect(activity).toBeNull();

    });      const activity1 = await repository.create({

  });

        title: 'アクティビティ1',      expect(activity.updatedAt).toBeInstanceOf(Date);  describe('Create (作成)', () => {  describe('Create (作成)', () => {

  describe('Update', () => {

    it('アクティビティを更新できる', async () => {        icon: '📝',

      const activity = await repository.create({

        title: '元のタイトル',        valueType: 'number',    });

        icon: '📝',

        valueType: 'number',        color: '#3b82f6',

        color: '#3b82f6',

        unit: '回',        unit: '回',  });    it('新しいアクティビティを作成できる', async () => {    it('新しいアクティビティを作成できる', async () => {

        isArchived: false,

      });        isArchived: false,



      const updated = await repository.update(activity.id, {      });

        title: '更新されたタイトル',

        icon: '📝',

        valueType: 'number',

        color: '#3b82f6',      const activity2 = await repository.create({  describe('GetAll', () => {      const activityData: Omit<ActivityDefinition, 'id' | 'order' | 'createdAt' | 'updatedAt'> = {      const activityData: Omit<ActivityDefinition, 'id' | 'order' | 'createdAt' | 'updatedAt'> = {

        unit: '回',

        isArchived: false,        title: 'アクティビティ2',

      });

        icon: '📚',    it('すべてのアクティビティを取得できる', async () => {

      expect(updated.title).toBe('更新されたタイトル');

      expect(updated.id).toBe(activity.id);        valueType: 'boolean',

    });

        color: '#10b981',      await repository.create({        title: 'テストアクティビティ',        title: 'テストアクティビティ',

    it('存在しないIDでエラーが発生する', async () => {

      await expect(        isArchived: false,

        repository.update('non-existent-id', {

          title: '更新されたタイトル',      });        title: 'アクティビティ1',

          icon: '📝',

          valueType: 'number',

          color: '#3b82f6',

          unit: '回',      expect(activity1.order).toBe(1);        icon: '📝',        icon: '📝',        valueType: 'number',

          isArchived: false,

        })      expect(activity2.order).toBe(2);

      ).rejects.toThrow();

    });    });        valueType: 'number',

  });



  describe('Delete', () => {

    it('アクティビティを削除できる', async () => {    it('isArchivedのデフォルト値がfalseである', async () => {        isArchived: false,        valueType: 'number',        icon: '📝',

      const activity = await repository.create({

        title: 'テストアクティビティ',      const activity = await repository.create({

        icon: '📝',

        valueType: 'number',        title: 'テストアクティビティ',      });

        color: '#3b82f6',

        unit: '回',        icon: '📝',

        isArchived: false,

      });        valueType: 'number',        color: '#3b82f6',        valueType: 'number',



      await repository.delete(activity.id);        color: '#3b82f6',



      const activities = await repository.getAll();        unit: '回',      const activities = await repository.getAll();

      expect(activities).toHaveLength(0);

    });      });



    it('存在しないIDでエラーが発生する', async () => {      expect(activities).toHaveLength(1);        unit: '回',        color: '#3b82f6',

      await expect(repository.delete('non-existent-id')).rejects.toThrow();

    });      expect(activity.isArchived).toBe(false);

  });

    });    });

  describe('GetAllActive', () => {

    it('アーカイブされていないアクティビティのみを取得できる', async () => {

      await repository.create({

        title: 'アクティブ1',    it('StorageServiceに正しく保存される', async () => {  });        isArchived: false,        unit: '回',

        icon: '📝',

        valueType: 'number',      await repository.create({

        color: '#3b82f6',

        unit: '回',        title: 'テストアクティビティ',});

        isArchived: false,

      });        icon: '📝',



      await repository.create({        valueType: 'number',      };        isArchived: false,

        title: 'アーカイブ済み',

        icon: '📚',        color: '#3b82f6',

        valueType: 'boolean',

        color: '#10b981',        unit: '回',      };

        isArchived: true,

      });        isArchived: false,



      const activities = await repository.getAllActive();      });      const activity = await repository.create(activityData);

      expect(activities).toHaveLength(1);

      expect(activities[0].title).toBe('アクティブ1');

    });

  });      const activities = await storageService.getActivities();      const activity = await repository.create(activityData);



  describe('Archive', () => {      expect(activities).toHaveLength(1);

    it('アクティビティをアーカイブできる', async () => {

      const activity = await repository.create({      expect(activities[0].title).toBe('テストアクティビティ');      expect(activity.id).toBeTruthy();

        title: 'テストアクティビティ',

        icon: '📝',    });

        valueType: 'number',

        color: '#3b82f6',  });      expect(activity.title).toBe(activityData.title);      expect(activity.id).toBeTruthy();

        unit: '回',

        isArchived: false,

      });

  describe('GetAll', () => {      expect(activity.icon).toBe(activityData.icon);      expect(activity.title).toBe(activityData.title);

      const archived = await repository.archive(activity.id);

    it('すべてのアクティビティを取得できる', async () => {

      expect(archived.isArchived).toBe(true);

      expect(archived.id).toBe(activity.id);      await repository.create({      expect(activity.valueType).toBe(activityData.valueType);      expect(activity.icon).toBe(activityData.icon);

    });

  });        title: 'アクティビティ1',



  describe('Restore', () => {        icon: '📝',      expect(activity.color).toBe(activityData.color);      expect(activity.valueType).toBe(activityData.valueType);

    it('アーカイブされたアクティビティを復元できる', async () => {

      const activity = await repository.create({        valueType: 'number',

        title: 'テストアクティビティ',

        icon: '📝',        color: '#3b82f6',      expect(activity.unit).toBe(activityData.unit);      expect(activity.color).toBe(activityData.color);

        valueType: 'number',

        color: '#3b82f6',        unit: '回',

        unit: '回',

        isArchived: true,        isArchived: false,      expect(activity.order).toBe(0); // 最初のアクティビティ      expect(activity.unit).toBe(activityData.unit);

      });

      });

      const restored = await repository.restore(activity.id);

      expect(activity.isArchived).toBe(false);      expect(activity.order).toBe(0); // 最初のアクティビティ

      expect(restored.isArchived).toBe(false);

      expect(restored.id).toBe(activity.id);      await repository.create({

    });

  });        title: 'アクティビティ2',      expect(activity.createdAt).toBeInstanceOf(Date);      expect(activity.isArchived).toBe(false);

});

        icon: '📚',

        valueType: 'boolean',      expect(activity.updatedAt).toBeInstanceOf(Date);      expect(activity.createdAt).toBeInstanceOf(Date);

        color: '#10b981',

        isArchived: false,    });      expect(activity.updatedAt).toBeInstanceOf(Date);

      });

    });

      const activities = await repository.getAll();

      expect(activities).toHaveLength(2);    it('複数のアクティビティを作成すると、orderが自動的にインクリメントされる', async () => {

      expect(activities[0].title).toBe('アクティビティ1');

      expect(activities[1].title).toBe('アクティビティ2');      const activity1 = await repository.create({    it('複数のアクティビティを作成すると、orderが自動的にインクリメントされる', async () => {

    });

        title: 'アクティビティ1',      const activity1 = await repository.create({

    it('空の配列を返す（データがない場合）', async () => {

      const activities = await repository.getAll();        icon: '📝',        title: 'アクティビティ1',

      expect(activities).toEqual([]);

    });        valueType: 'number',        valueType: 'number',



    it('アーカイブされたアクティビティも含む', async () => {        color: '#3b82f6',        icon: '📝',

      await repository.create({

        title: 'アクティブ',        unit: '回',        color: '#3b82f6',

        icon: '📝',

        valueType: 'number',        isArchived: false,        unit: '回',

        color: '#3b82f6',

        unit: '回',      });        isArchived: false,

        isArchived: false,

      });      });



      await repository.create({      const activity2 = await repository.create({

        title: 'アーカイブ済み',

        icon: '📚',        title: 'アクティビティ2',      const activity2 = await repository.create({

        valueType: 'boolean',

        color: '#10b981',        icon: '🏃',        title: 'アクティビティ2',

        isArchived: true,

      });        valueType: 'number',        valueType: 'number',



      const activities = await repository.getAll();        color: '#10b981',        icon: '🏃',

      expect(activities).toHaveLength(2);

    });        unit: 'km',        color: '#10b981',

  });

        isArchived: false,        unit: 'km',

  describe('GetById', () => {

    it('IDでアクティビティを取得できる', async () => {      });        isArchived: false,

      const created = await repository.create({

        title: 'テストアクティビティ',      });

        icon: '📝',

        valueType: 'number',      const activity3 = await repository.create({

        color: '#3b82f6',

        unit: '回',        title: 'アクティビティ3',      const activity3 = await repository.create({

        isArchived: false,

      });        icon: '💪',        title: 'アクティビティ3',



      const activity = await repository.getById(created.id);        valueType: 'number',        valueType: 'number',

      expect(activity).not.toBeNull();

      expect(activity?.id).toBe(created.id);        color: '#f59e0b',        icon: '💪',

      expect(activity?.title).toBe('テストアクティビティ');

    });        unit: '回',        color: '#f59e0b',



    it('存在しないIDの場合はnullを返す', async () => {        isArchived: false,        unit: '回',

      const activity = await repository.getById('non-existent-id');

      expect(activity).toBeNull();      });        isArchived: false,

    });

  });      });



  describe('GetAllActive', () => {      expect(activity1.order).toBe(0);

    it('アーカイブされていないアクティビティのみを取得できる', async () => {

      await repository.create({      expect(activity2.order).toBe(1);      expect(activity1.order).toBe(0);

        title: 'アクティブ1',

        icon: '📝',      expect(activity3.order).toBe(2);      expect(activity2.order).toBe(1);

        valueType: 'number',

        color: '#3b82f6',    });      expect(activity3.order).toBe(2);

        unit: '回',

        isArchived: false,    });

      });

    it('IDがユニークである', async () => {

      await repository.create({

        title: 'アーカイブ済み',      const activity1 = await repository.create({    it('IDがユニークである', async () => {

        icon: '📚',

        valueType: 'boolean',        title: 'アクティビティ1',      const activity1 = await repository.create({

        color: '#10b981',

        isArchived: true,        icon: '📝',        title: 'アクティビティ1',

      });

        valueType: 'number',        valueType: 'number',

      await repository.create({

        title: 'アクティブ2',        color: '#3b82f6',        icon: '📝',

        icon: '💪',

        valueType: 'duration',        unit: '回',        color: '#3b82f6',

        color: '#f59e0b',

        unit: '分',        isArchived: false,        unit: '回',

        isArchived: false,

      });      });        isArchived: false,



      const activities = await repository.getAllActive();      });

      expect(activities).toHaveLength(2);

      expect(activities.every((a) => !a.isArchived)).toBe(true);      const activity2 = await repository.create({

    });

        title: 'アクティビティ2',      const activity2 = await repository.create({

    it('すべてアーカイブ済みの場合は空配列を返す', async () => {

      await repository.create({        icon: '🏃',        title: 'アクティビティ2',

        title: 'アーカイブ済み1',

        icon: '📝',        valueType: 'number',        valueType: 'number',

        valueType: 'number',

        color: '#3b82f6',        color: '#10b981',        icon: '🏃',

        unit: '回',

        isArchived: true,        unit: 'km',        color: '#10b981',

      });

        isArchived: false,        unit: 'km',

      await repository.create({

        title: 'アーカイブ済み2',      });        isArchived: false,

        icon: '📚',

        valueType: 'boolean',      });

        color: '#10b981',

        isArchived: true,      expect(activity1.id).not.toBe(activity2.id);

      });

    });      expect(activity1.id).not.toBe(activity2.id);

      const activities = await repository.getAllActive();

      expect(activities).toEqual([]);    });

    });

  });    it('StorageServiceに正しく保存される', async () => {



  describe('Update', () => {      await repository.create({    it('StorageServiceに正しく保存される', async () => {

    it('アクティビティを更新できる', async () => {

      const activity = await repository.create({        title: 'テストアクティビティ',      await repository.create({

        title: '元のタイトル',

        icon: '📝',        icon: '📝',        title: 'テストアクティビティ',

        valueType: 'number',

        color: '#3b82f6',        valueType: 'number',        valueType: 'number',

        unit: '回',

        isArchived: false,        color: '#3b82f6',        icon: '📝',

      });

        unit: '回',        color: '#3b82f6',

      const updated = await repository.update(activity.id, {

        title: '更新されたタイトル',        isArchived: false,        unit: '回',

        icon: '📝',

        valueType: 'number',      });        isArchived: false,

        color: '#3b82f6',

        unit: '回',      });

        isArchived: false,

      });      const activities = await storageService.getActivities();



      expect(updated.title).toBe('更新されたタイトル');      expect(activities).toHaveLength(1);      const activities = await storageService.getActivities();

      expect(updated.id).toBe(activity.id);

    });      expect(activities[0].title).toBe('テストアクティビティ');      expect(activities).toHaveLength(1);



    it('部分更新ができる', async () => {    });      expect(activities[0].title).toBe('テストアクティビティ');

      const activity = await repository.create({

        title: '元のタイトル',  });    });

        icon: '📝',

        valueType: 'number',  });

        color: '#3b82f6',

        unit: '回',  describe('GetAll (全件取得)', () => {

        isArchived: false,

      });    it('すべてのアクティビティを取得できる', async () => {  describe('GetAll (全件取得)', () => {



      const updated = await repository.update(activity.id, {      await repository.create({    it('すべてのアクティビティを取得できる', async () => {

        title: '更新されたタイトル',

        icon: '📝',        title: 'アクティビティ1',      await repository.create({

        valueType: 'number',

        color: '#3b82f6',        icon: '📝',        title: 'アクティビティ1',

        unit: '回',

        isArchived: false,        valueType: 'number',        valueType: 'number',

      });

        color: '#3b82f6',        icon: '📝',

      expect(updated.title).toBe('更新されたタイトル');

      expect(updated.icon).toBe(activity.icon);        unit: '回',        color: '#3b82f6',

    });

        isArchived: false,        unit: '回',

    it('updatedAtが更新される', async () => {

      const activity = await repository.create({      });        isArchived: false,

        title: 'テストアクティビティ',

        icon: '📝',      });

        valueType: 'number',

        color: '#3b82f6',      await repository.create({

        unit: '回',

        isArchived: false,        title: 'アクティビティ2',      await repository.create({

      });

        icon: '🏃',        title: 'アクティビティ2',

      // 少し待機

      await new Promise((resolve) => setTimeout(resolve, 100));        valueType: 'number',        valueType: 'number',



      const updated = await repository.update(activity.id, {        color: '#10b981',        icon: '🏃',

        title: '更新されたタイトル',

        icon: '📝',        unit: 'km',        color: '#10b981',

        valueType: 'number',

        color: '#3b82f6',        isArchived: false,        unit: 'km',

        unit: '回',

        isArchived: false,      });        isArchived: false,

      });

      });

      expect(updated.updatedAt.getTime()).toBeGreaterThan(activity.updatedAt.getTime());

    });      const activities = await repository.getAll();



    it('createdAtは変更されない', async () => {      expect(activities).toHaveLength(2);      const activities = await repository.getAll();

      const activity = await repository.create({

        title: 'テストアクティビティ',    });      expect(activities).toHaveLength(2);

        icon: '📝',

        valueType: 'number',    });

        color: '#3b82f6',

        unit: '回',    it('アーカイブ済みも含めてすべて取得する', async () => {

        isArchived: false,

      });      await repository.create({    it('アーカイブ済みも含めてすべて取得する', async () => {



      const updated = await repository.update(activity.id, {        title: 'アクティビティ1',      await repository.create({

        title: '更新されたタイトル',

        icon: '📝',        icon: '📝',        title: 'アクティビティ1',

        valueType: 'number',

        color: '#3b82f6',        valueType: 'number',        valueType: 'number',

        unit: '回',

        isArchived: false,        color: '#3b82f6',        icon: '📝',

      });

        unit: '回',        color: '#3b82f6',

      expect(updated.createdAt).toEqual(activity.createdAt);

    });        isArchived: false,        unit: '回',



    it('存在しないIDでエラーが発生する', async () => {      });        isArchived: false,

      await expect(

        repository.update('non-existent-id', {      });

          title: '更新されたタイトル',

          icon: '📝',      const activity2 = await repository.create({

          valueType: 'number',

          color: '#3b82f6',        title: 'アクティビティ2',      const activity2 = await repository.create({

          unit: '回',

          isArchived: false,        icon: '🏃',        title: 'アクティビティ2',

        })

      ).rejects.toThrow();        valueType: 'number',        valueType: 'number',

    });

  });        color: '#10b981',        icon: '🏃',



  describe('Delete', () => {        unit: 'km',        color: '#10b981',

    it('アクティビティを削除できる', async () => {

      const activity = await repository.create({        isArchived: false,        unit: 'km',

        title: 'テストアクティビティ',

        icon: '📝',      });        isArchived: false,

        valueType: 'number',

        color: '#3b82f6',      });

        unit: '回',

        isArchived: false,      // アーカイブ

      });

      await repository.archive(activity2.id);      // アーカイブ

      await repository.delete(activity.id);

      await repository.archive(activity2.id);

      const activities = await repository.getAll();

      expect(activities).toHaveLength(0);      const activities = await repository.getAll();

    });

      expect(activities).toHaveLength(2);      const activities = await repository.getAll();

    it('削除後、getByIdでnullが返る', async () => {

      const activity = await repository.create({      expect(activities.filter(a => a.isArchived)).toHaveLength(1);      expect(activities).toHaveLength(2);

        title: 'テストアクティビティ',

        icon: '📝',    });      expect(activities.filter(a => a.isArchived)).toHaveLength(1);

        valueType: 'number',

        color: '#3b82f6',    });

        unit: '回',

        isArchived: false,    it('空の配列を返す（データがない場合）', async () => {

      });

      const activities = await repository.getAll();    it('空の配列を返す（データがない場合）', async () => {

      await repository.delete(activity.id);

      expect(activities).toEqual([]);      const activities = await repository.getAll();

      const result = await repository.getById(activity.id);

      expect(result).toBeNull();    });      expect(activities).toEqual([]);

    });

  });    });

    it('存在しないIDでエラーが発生する', async () => {

      await expect(repository.delete('non-existent-id')).rejects.toThrow();  });

    });

  });  describe('GetAllActive (アクティブなアクティビティの取得)', () => {



  describe('Archive', () => {    it('アーカイブされていないアクティビティのみを取得する', async () => {  describe('GetAllActive (アクティブなアクティビティの取得)', () => {

    it('アクティビティをアーカイブできる', async () => {

      const activity = await repository.create({      const activity1 = await repository.create({    it('アーカイブされていないアクティビティのみを取得する', async () => {

        title: 'テストアクティビティ',

        icon: '📝',        title: 'アクティビティ1',      const activity1 = await repository.create({

        valueType: 'number',

        color: '#3b82f6',        icon: '📝',        title: 'アクティビティ1',

        unit: '回',

        isArchived: false,        valueType: 'number',        valueType: 'number',

      });

        color: '#3b82f6',        icon: '📝',

      const archived = await repository.archive(activity.id);

        unit: '回',        color: '#3b82f6',

      expect(archived.isArchived).toBe(true);

      expect(archived.id).toBe(activity.id);        isArchived: false,        unit: '回',

    });

      });        isArchived: false,

    it('アーカイブ後、getAllActiveで取得できない', async () => {

      const activity = await repository.create({      });

        title: 'テストアクティビティ',

        icon: '📝',      const activity2 = await repository.create({

        valueType: 'number',

        color: '#3b82f6',        title: 'アクティビティ2',      const activity2 = await repository.create({

        unit: '回',

        isArchived: false,        icon: '🏃',        title: 'アクティビティ2',

      });

        valueType: 'number',        valueType: 'number',

      await repository.archive(activity.id);

        color: '#10b981',        icon: '🏃',

      const activeActivities = await repository.getAllActive();

      expect(activeActivities).toHaveLength(0);        unit: 'km',        color: '#10b981',

    });

  });        isArchived: false,        unit: 'km',



  describe('Restore', () => {      });        isArchived: false,

    it('アーカイブされたアクティビティを復元できる', async () => {

      const activity = await repository.create({      });

        title: 'テストアクティビティ',

        icon: '📝',      // activity2をアーカイブ

        valueType: 'number',

        color: '#3b82f6',      await repository.archive(activity2.id);      // activity2をアーカイブ

        unit: '回',

        isArchived: true,      await repository.archive(activity2.id);

      });

      const activeActivities = await repository.getAllActive();

      const restored = await repository.restore(activity.id);

      expect(activeActivities).toHaveLength(1);      const activeActivities = await repository.getAllActive();

      expect(restored.isArchived).toBe(false);

      expect(restored.id).toBe(activity.id);      expect(activeActivities[0].id).toBe(activity1.id);      expect(activeActivities).toHaveLength(1);

    });

      expect(activeActivities[0].isArchived).toBe(false);      expect(activeActivities[0].id).toBe(activity1.id);

    it('復元後、getAllActiveで取得できる', async () => {

      const activity = await repository.create({    });      expect(activeActivities[0].isArchived).toBe(false);

        title: 'テストアクティビティ',

        icon: '📝',    });

        valueType: 'number',

        color: '#3b82f6',    it('すべてアーカイブ済みの場合は空配列を返す', async () => {

        unit: '回',

        isArchived: true,      const activity1 = await repository.create({    it('すべてアーカイブ済みの場合は空配列を返す', async () => {

      });

        title: 'アクティビティ1',      const activity1 = await repository.create({

      await repository.restore(activity.id);

        icon: '📝',        title: 'アクティビティ1',

      const activeActivities = await repository.getAllActive();

      expect(activeActivities).toHaveLength(1);        valueType: 'number',        valueType: 'number',

      expect(activeActivities[0].id).toBe(activity.id);

    });        color: '#3b82f6',        icon: '📝',

  });

        unit: '回',        color: '#3b82f6',

  describe('Data Persistence', () => {

    it('新しいRepositoryインスタンスでもデータが保持される', async () => {        isArchived: false,        unit: '回',

      await repository.create({

        title: 'テストアクティビティ',      });        isArchived: false,

        icon: '📝',

        valueType: 'number',      });

        color: '#3b82f6',

        unit: '回',      await repository.archive(activity1.id);

        isArchived: false,

      });      await repository.archive(activity1.id);



      // 新しいインスタンスを作成      const activeActivities = await repository.getAllActive();

      const newRepository = new ActivityRepositoryImpl(storageService);

      const activities = await newRepository.getAll();      expect(activeActivities).toEqual([]);      const activeActivities = await repository.getAllActive();



      expect(activities).toHaveLength(1);    });      expect(activeActivities).toEqual([]);

      expect(activities[0].title).toBe('テストアクティビティ');

    });  });    });

  });

  });

  describe('Error Handling', () => {

    it('StorageServiceのエラーを適切に処理する', async () => {  describe('GetById (ID検索)', () => {

      // エラーを投げるモックStorageService

      const errorStorage = {    it('IDでアクティビティを取得できる', async () => {  describe('GetById (ID検索)', () => {

        getActivities: () => Promise.reject(new Error('Storage error')),

        addActivity: () => Promise.reject(new Error('Storage error')),      const created = await repository.create({    it('IDでアクティビティを取得できる', async () => {

        updateActivity: () => Promise.reject(new Error('Storage error')),

        deleteActivity: () => Promise.reject(new Error('Storage error')),        title: 'テストアクティビティ',      const created = await repository.create({

      } as any;

        icon: '📝',        title: 'テストアクティビティ',

      const errorRepository = new ActivityRepositoryImpl(errorStorage);

        valueType: 'number',        valueType: 'number',

      await expect(errorRepository.getAll()).rejects.toThrow('Failed to fetch activities');

    });        color: '#3b82f6',        icon: '📝',

  });

});        unit: '回',        color: '#3b82f6',


        isArchived: false,        unit: '回',

      });        isArchived: false,

      });

      const found = await repository.getById(created.id);

      const found = await repository.getById(created.id);

      expect(found).not.toBeNull();

      expect(found?.id).toBe(created.id);      expect(found).not.toBeNull();

      expect(found?.title).toBe(created.title);      expect(found?.id).toBe(created.id);

    });      expect(found?.title).toBe(created.title);

    });

    it('存在しないIDの場合はnullを返す', async () => {

      const found = await repository.getById('non-existent-id');    it('存在しないIDの場合はnullを返す', async () => {

      expect(found).toBeNull();      const found = await repository.getById('non-existent-id');

    });      expect(found).toBeNull();

  });    });

  });

  describe('Update (更新)', () => {

    it('アクティビティを更新できる', async () => {  describe('Update (更新)', () => {

      const activity = await repository.create({    it('アクティビティを更新できる', async () => {

        title: 'テストアクティビティ',      const activity = await repository.create({

        icon: '📝',        title: 'テストアクティビティ',

        valueType: 'number',        valueType: 'number',

        color: '#3b82f6',        icon: '📝',

        unit: '回',        color: '#3b82f6',

        isArchived: false,        unit: '回',

      });        isArchived: false,

      });

      const updated = await repository.update(activity.id, {

        title: '更新されたアクティビティ',      const updated = await repository.update(activity.id, {

        color: '#ef4444',        title: '更新されたアクティビティ',

      });        valueType: 'number',

        color: '#ef4444',

      expect(updated.id).toBe(activity.id);      });

      expect(updated.title).toBe('更新されたアクティビティ');

      expect(updated.color).toBe('#ef4444');      expect(updated.id).toBe(activity.id);

      expect(updated.icon).toBe('📝'); // 変更されていない      expect(updated.title).toBe('更新されたアクティビティ');

      expect(updated.unit).toBe('回'); // 変更されていない      expect(updated.color).toBe('#ef4444');

    });      expect(updated.icon).toBe('📝'); // 変更されていない

      expect(updated.unit).toBe('回'); // 変更されていない

    it('updatedAtが更新される', async () => {    });

      const activity = await repository.create({

        title: 'テストアクティビティ',    it('updatedAtが更新される', async () => {

        icon: '📝',      const activity = await repository.create({

        valueType: 'number',        title: 'テストアクティビティ',

        color: '#3b82f6',        valueType: 'number',

        unit: '回',        icon: '📝',

        isArchived: false,        color: '#3b82f6',

      });        unit: '回',

        isArchived: false,

      const originalUpdatedAt = activity.updatedAt.getTime();      });



      // 少し待機      const originalUpdatedAt = activity.updatedAt.getTime();

      await new Promise(resolve => setTimeout(resolve, 100));

      // 少し待機

      const updated = await repository.update(activity.id, {      await new Promise(resolve => setTimeout(resolve, 100));

        title: '更新されたアクティビティ',

      });      const updated = await repository.update(activity.id, {

        title: '更新されたアクティビティ',

      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt);        valueType: 'number',

    });      });



    it('createdAtは変更されない', async () => {      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt);

      const activity = await repository.create({    });

        title: 'テストアクティビティ',

        icon: '📝',    it('createdAtは変更されない', async () => {

        valueType: 'number',      const activity = await repository.create({

        color: '#3b82f6',        title: 'テストアクティビティ',

        unit: '回',        valueType: 'number',

        isArchived: false,        icon: '📝',

      });        color: '#3b82f6',

        unit: '回',

      const originalCreatedAt = activity.createdAt.getTime();        isArchived: false,

      });

      const updated = await repository.update(activity.id, {

        title: '更新されたアクティビティ',      const originalCreatedAt = activity.createdAt.getTime();

      });

      const updated = await repository.update(activity.id, {

      expect(updated.createdAt.getTime()).toBe(originalCreatedAt);        title: '更新されたアクティビティ',

    });        valueType: 'number',

      });

    it('存在しないIDでエラーが発生する', async () => {

      await expect(      expect(updated.createdAt.getTime()).toBe(originalCreatedAt);

        repository.update('non-existent-id', { title: '更新' })    });

      ).rejects.toThrow();

    });    it('存在しないIDでエラーが発生する', async () => {

  });      await expect(

        repository.update('non-existent-id', { title: '更新' })

  describe('Delete (削除)', () => {        valueType: 'number',

    it('アクティビティを削除できる', async () => {      ).rejects.toThrow();

      const activity = await repository.create({    });

        title: 'テストアクティビティ',  });

        icon: '📝',

        valueType: 'number',  describe('Delete (削除)', () => {

        color: '#3b82f6',    it('アクティビティを削除できる', async () => {

        unit: '回',      const activity = await repository.create({

        isArchived: false,        title: 'テストアクティビティ',

      });        valueType: 'number',

        icon: '📝',

      await repository.delete(activity.id);        color: '#3b82f6',

        unit: '回',

      const found = await repository.getById(activity.id);        isArchived: false,

      expect(found).toBeNull();      });

    });

      await repository.delete(activity.id);

    it('削除後、getAllで取得できない', async () => {

      const activity1 = await repository.create({      const found = await repository.getById(activity.id);

        title: 'アクティビティ1',      expect(found).toBeNull();

        icon: '📝',    });

        valueType: 'number',

        color: '#3b82f6',    it('削除後、getAllで取得できない', async () => {

        unit: '回',      const activity1 = await repository.create({

        isArchived: false,        title: 'アクティビティ1',

      });        valueType: 'number',

        icon: '📝',

      await repository.create({        color: '#3b82f6',

        title: 'アクティビティ2',        unit: '回',

        icon: '🏃',        isArchived: false,

        valueType: 'number',      });

        color: '#10b981',

        unit: 'km',      await repository.create({

        isArchived: false,        title: 'アクティビティ2',

      });        valueType: 'number',

        icon: '🏃',

      await repository.delete(activity1.id);        color: '#10b981',

        unit: 'km',

      const activities = await repository.getAll();        isArchived: false,

      expect(activities).toHaveLength(1);      });

      expect(activities[0].title).toBe('アクティビティ2');

    });      await repository.delete(activity1.id);



    it('存在しないIDでエラーが発生する', async () => {      const activities = await repository.getAll();

      await expect(      expect(activities).toHaveLength(1);

        repository.delete('non-existent-id')      expect(activities[0].title).toBe('アクティビティ2');

      ).rejects.toThrow();    });

    });

  });    it('存在しないIDでエラーが発生する', async () => {

      await expect(

  describe('Archive (アーカイブ)', () => {        repository.delete('non-existent-id')

    it('アクティビティをアーカイブできる', async () => {      ).rejects.toThrow();

      const activity = await repository.create({    });

        title: 'テストアクティビティ',  });

        icon: '📝',

        valueType: 'number',  describe('Archive (アーカイブ)', () => {

        color: '#3b82f6',    it('アクティビティをアーカイブできる', async () => {

        unit: '回',      const activity = await repository.create({

        isArchived: false,        title: 'テストアクティビティ',

      });        valueType: 'number',

        icon: '📝',

      const archived = await repository.archive(activity.id);        color: '#3b82f6',

        unit: '回',

      expect(archived.id).toBe(activity.id);        isArchived: false,

      expect(archived.isArchived).toBe(true);      });

      expect(archived.updatedAt.getTime()).toBeGreaterThan(activity.updatedAt.getTime());

    });      const archived = await repository.archive(activity.id);



    it('アーカイブ後、getAllActiveで取得できない', async () => {      expect(archived.id).toBe(activity.id);

      const activity = await repository.create({      expect(archived.isArchived).toBe(true);

        title: 'テストアクティビティ',      expect(archived.updatedAt.getTime()).toBeGreaterThan(activity.updatedAt.getTime());

        icon: '📝',    });

        valueType: 'number',

        color: '#3b82f6',    it('アーカイブ後、getAllActiveで取得できない', async () => {

        unit: '回',      const activity = await repository.create({

        isArchived: false,        title: 'テストアクティビティ',

      });        valueType: 'number',

        icon: '📝',

      await repository.archive(activity.id);        color: '#3b82f6',

        unit: '回',

      const activeActivities = await repository.getAllActive();        isArchived: false,

      expect(activeActivities).toHaveLength(0);      });

    });

      await repository.archive(activity.id);

    it('アーカイブ後、getAllでは取得できる', async () => {

      const activity = await repository.create({      const activeActivities = await repository.getAllActive();

        title: 'テストアクティビティ',      expect(activeActivities).toHaveLength(0);

        icon: '📝',    });

        valueType: 'number',

        color: '#3b82f6',    it('アーカイブ後、getAllでは取得できる', async () => {

        unit: '回',      const activity = await repository.create({

        isArchived: false,        title: 'テストアクティビティ',

      });        valueType: 'number',

        icon: '📝',

      await repository.archive(activity.id);        color: '#3b82f6',

        unit: '回',

      const allActivities = await repository.getAll();        isArchived: false,

      expect(allActivities).toHaveLength(1);      });

      expect(allActivities[0].isArchived).toBe(true);

    });      await repository.archive(activity.id);



    it('存在しないIDでエラーが発生する', async () => {      const allActivities = await repository.getAll();

      await expect(      expect(allActivities).toHaveLength(1);

        repository.archive('non-existent-id')      expect(allActivities[0].isArchived).toBe(true);

      ).rejects.toThrow();    });

    });

  });    it('存在しないIDでエラーが発生する', async () => {

      await expect(

  describe('Restore (復元)', () => {        repository.archive('non-existent-id')

    it('アーカイブされたアクティビティを復元できる', async () => {      ).rejects.toThrow();

      const activity = await repository.create({    });

        title: 'テストアクティビティ',  });

        icon: '📝',

        valueType: 'number',  describe('Restore (復元)', () => {

        color: '#3b82f6',    it('アーカイブされたアクティビティを復元できる', async () => {

        unit: '回',      const activity = await repository.create({

        isArchived: false,        title: 'テストアクティビティ',

      });        valueType: 'number',

        icon: '📝',

      await repository.archive(activity.id);        color: '#3b82f6',

      const restored = await repository.restore(activity.id);        unit: '回',

        isArchived: false,

      expect(restored.id).toBe(activity.id);      });

      expect(restored.isArchived).toBe(false);

      expect(restored.updatedAt.getTime()).toBeGreaterThan(activity.updatedAt.getTime());      await repository.archive(activity.id);

    });      const restored = await repository.restore(activity.id);



    it('復元後、getAllActiveで取得できる', async () => {      expect(restored.id).toBe(activity.id);

      const activity = await repository.create({      expect(restored.isArchived).toBe(false);

        title: 'テストアクティビティ',      expect(restored.updatedAt.getTime()).toBeGreaterThan(activity.updatedAt.getTime());

        icon: '📝',    });

        valueType: 'number',

        color: '#3b82f6',    it('復元後、getAllActiveで取得できる', async () => {

        unit: '回',      const activity = await repository.create({

        isArchived: false,        title: 'テストアクティビティ',

      });        valueType: 'number',

        icon: '📝',

      await repository.archive(activity.id);        color: '#3b82f6',

      await repository.restore(activity.id);        unit: '回',

        isArchived: false,

      const activeActivities = await repository.getAllActive();      });

      expect(activeActivities).toHaveLength(1);

      expect(activeActivities[0].id).toBe(activity.id);      await repository.archive(activity.id);

    });      await repository.restore(activity.id);



    it('存在しないIDでエラーが発生する', async () => {      const activeActivities = await repository.getAllActive();

      await expect(      expect(activeActivities).toHaveLength(1);

        repository.restore('non-existent-id')      expect(activeActivities[0].id).toBe(activity.id);

      ).rejects.toThrow();    });

    });

  });    it('存在しないIDでエラーが発生する', async () => {

      await expect(

  describe('Data Persistence (データ永続化)', () => {        repository.restore('non-existent-id')

    it('新しいRepositoryインスタンスでもデータが保持される', async () => {      ).rejects.toThrow();

      const activity = await repository.create({    });

        title: 'テストアクティビティ',  });

        icon: '📝',

        valueType: 'number',  describe('Data Persistence (データ永続化)', () => {

        color: '#3b82f6',    it('新しいRepositoryインスタンスでもデータが保持される', async () => {

        unit: '回',      const activity = await repository.create({

        isArchived: false,        title: 'テストアクティビティ',

      });        valueType: 'number',

        icon: '📝',

      // 新しいインスタンスを作成        color: '#3b82f6',

      const newStorageService = new LocalStorageService();        unit: '回',

      const newRepository = new ActivityRepositoryImpl(newStorageService);        isArchived: false,

      });

      const found = await newRepository.getById(activity.id);

      expect(found).not.toBeNull();      // 新しいインスタンスを作成

      expect(found?.title).toBe(activity.title);      const newStorageService = new LocalStorageService();

    });      const newRepository = new ActivityRepositoryImpl(newStorageService);



    it('複数のアクティビティを作成・取得できる', async () => {      const found = await newRepository.getById(activity.id);

      await repository.create({      expect(found).not.toBeNull();

        title: 'アクティビティ1',      expect(found?.title).toBe(activity.title);

        icon: '📝',    });

        valueType: 'number',

        color: '#3b82f6',    it('複数のアクティビティを作成・取得できる', async () => {

        unit: '回',      await repository.create({

        isArchived: false,        title: 'アクティビティ1',

      });        valueType: 'number',

        icon: '📝',

      await repository.create({        color: '#3b82f6',

        title: 'アクティビティ2',        unit: '回',

        icon: '🏃',        isArchived: false,

        valueType: 'number',      });

        color: '#10b981',

        unit: 'km',      await repository.create({

        isArchived: false,        title: 'アクティビティ2',

      });        valueType: 'number',

        icon: '🏃',

      await repository.create({        color: '#10b981',

        title: 'アクティビティ3',        unit: 'km',

        icon: '💪',        isArchived: false,

        valueType: 'number',      });

        color: '#f59e0b',

        unit: '回',      await repository.create({

        isArchived: false,        title: 'アクティビティ3',

      });        valueType: 'number',

        icon: '💪',

      const activities = await repository.getAll();        color: '#f59e0b',

      expect(activities).toHaveLength(3);        unit: '回',

    });        isArchived: false,

  });      });



  describe('Order Management (順序管理)', () => {      const activities = await repository.getAll();

    it('削除したアクティビティのorderは詰められない（既存の動作を維持）', async () => {      expect(activities).toHaveLength(3);

      const activity1 = await repository.create({    });

        title: 'アクティビティ1',  });

        icon: '📝',

        valueType: 'number',  describe('Order Management (順序管理)', () => {

        color: '#3b82f6',    it('削除したアクティビティのorderは詰められない（既存の動作を維持）', async () => {

        unit: '回',      const activity1 = await repository.create({

        isArchived: false,        title: 'アクティビティ1',

      });        valueType: 'number',

        icon: '📝',

      const activity2 = await repository.create({        color: '#3b82f6',

        title: 'アクティビティ2',        unit: '回',

        icon: '🏃',        isArchived: false,

        valueType: 'number',      });

        color: '#10b981',

        unit: 'km',      const activity2 = await repository.create({

        isArchived: false,        title: 'アクティビティ2',

      });        valueType: 'number',

        icon: '🏃',

      const activity3 = await repository.create({        color: '#10b981',

        title: 'アクティビティ3',        unit: 'km',

        icon: '💪',        isArchived: false,

        valueType: 'number',      });

        color: '#f59e0b',

        unit: '回',      const activity3 = await repository.create({

        isArchived: false,        title: 'アクティビティ3',

      });        valueType: 'number',

        icon: '💪',

      // activity2を削除        color: '#f59e0b',

      await repository.delete(activity2.id);        unit: '回',

        isArchived: false,

      // 残りのアクティビティのorderは変わらない      });

      const activities = await repository.getAll();

      expect(activities).toHaveLength(2);      // activity2を削除

      expect(activities.find(a => a.id === activity1.id)?.order).toBe(0);      await repository.delete(activity2.id);

      expect(activities.find(a => a.id === activity3.id)?.order).toBe(2);

    });      // 残りのアクティビティのorderは変わらない

      const activities = await repository.getAll();

    it('新規作成時、既存の最大order + 1が設定される', async () => {      expect(activities).toHaveLength(2);

      await repository.create({      expect(activities.find(a => a.id === activity1.id)?.order).toBe(0);

        title: 'アクティビティ1',      expect(activities.find(a => a.id === activity3.id)?.order).toBe(2);

        icon: '📝',    });

        valueType: 'number',

        color: '#3b82f6',    it('新規作成時、既存の最大order + 1が設定される', async () => {

        unit: '回',      await repository.create({

        isArchived: false,        title: 'アクティビティ1',

      });        valueType: 'number',

        icon: '📝',

      const activity2 = await repository.create({        color: '#3b82f6',

        title: 'アクティビティ2',        unit: '回',

        icon: '🏃',        isArchived: false,

        valueType: 'number',      });

        color: '#10b981',

        unit: 'km',      const activity2 = await repository.create({

        isArchived: false,        title: 'アクティビティ2',

      });        valueType: 'number',

        icon: '🏃',

      // activity2を削除        color: '#10b981',

      await repository.delete(activity2.id);        unit: 'km',

        isArchived: false,

      // 新しいアクティビティを作成      });

      const activity3 = await repository.create({

        title: 'アクティビティ3',      // activity2を削除

        icon: '💪',      await repository.delete(activity2.id);

        valueType: 'number',

        color: '#f59e0b',      // 新しいアクティビティを作成

        unit: '回',      const activity3 = await repository.create({

        isArchived: false,        title: 'アクティビティ3',

      });        valueType: 'number',

        icon: '💪',

      // order は 2 になる（削除されたactivity2のorderが1だったため）        color: '#f59e0b',

      expect(activity3.order).toBe(2);        unit: '回',

    });        isArchived: false,

  });      });



  describe('Error Handling (エラーハンドリング)', () => {      // order は 2 になる（削除されたactivity2のorderが1だったため）

    it('StorageServiceのエラーを適切に処理する', async () => {      expect(activity3.order).toBe(2);

      // StorageServiceが例外をスローする状況をシミュレート    });

      const faultyStorage = {  });

        ...storageService,

        getActivities: async () => {  describe('Error Handling (エラーハンドリング)', () => {

          throw new Error('Storage error');    it('StorageServiceのエラーを適切に処理する', async () => {

        },      // StorageServiceが例外をスローする状況をシミュレート

      };      const faultyStorage = {

        ...storageService,

      const faultyRepository = new ActivityRepositoryImpl(faultyStorage as LocalStorageService);        getActivities: async () => {

          throw new Error('Storage error');

      await expect(        },

        faultyRepository.getAll()      };

      ).rejects.toThrow('Failed to fetch activities');

    });      const faultyRepository = new ActivityRepositoryImpl(faultyStorage as LocalStorageService);

  });

});      await expect(

        faultyRepository.getAll()
      ).rejects.toThrow('Failed to fetch activities');
    });
  });
});
