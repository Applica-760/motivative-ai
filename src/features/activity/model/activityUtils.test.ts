import { describe, it, expect } from 'vitest';
import {
  formatDateString,
  getTodayDateString,
  extractNumericValue,
  formatActivityValue,
  calculateTotalValue,
  calculateAverageValue,
  generateId,
} from './activityUtils';
import type { ActivityValue, ActivityRecord } from '@/shared/types';

describe('activityUtils', () => {
  describe('formatDateString', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2025-01-09T10:30:00');
      expect(formatDateString(date)).toBe('2025-01-09');
    });
  });

  describe('getTodayDateString', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const result = getTodayDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('extractNumericValue', () => {
    it('should extract number value', () => {
      const value: ActivityValue = { type: 'number', value: 5.2, unit: 'km' };
      expect(extractNumericValue(value)).toBe(5.2);
    });

    it('should extract duration value', () => {
      const value: ActivityValue = { type: 'duration', value: 30, unit: 'minutes' };
      expect(extractNumericValue(value)).toBe(30);
    });

    it('should convert boolean to number', () => {
      const trueValue: ActivityValue = { type: 'boolean', value: true };
      const falseValue: ActivityValue = { type: 'boolean', value: false };
      expect(extractNumericValue(trueValue)).toBe(1);
      expect(extractNumericValue(falseValue)).toBe(0);
    });

    it('should return 0 for text and image', () => {
      const textValue: ActivityValue = { type: 'text', value: 'test' };
      const imageValue: ActivityValue = { type: 'image', value: 'url' };
      expect(extractNumericValue(textValue)).toBe(0);
      expect(extractNumericValue(imageValue)).toBe(0);
    });
  });

  describe('formatActivityValue', () => {
    it('should format number value with unit', () => {
      const value: ActivityValue = { type: 'number', value: 5.2, unit: 'km' };
      expect(formatActivityValue(value)).toBe('5.2km');
    });

    it('should format duration value', () => {
      const value: ActivityValue = { type: 'duration', value: 30, unit: 'minutes' };
      expect(formatActivityValue(value)).toBe('30分');
    });

    it('should format boolean value', () => {
      const trueValue: ActivityValue = { type: 'boolean', value: true };
      const falseValue: ActivityValue = { type: 'boolean', value: false };
      expect(formatActivityValue(trueValue)).toBe('実施');
      expect(formatActivityValue(falseValue)).toBe('未実施');
    });

    it('should format text value', () => {
      const value: ActivityValue = { type: 'text', value: 'test note' };
      expect(formatActivityValue(value)).toBe('test note');
    });
  });

  describe('calculateTotalValue', () => {
    it('should calculate total value from records', () => {
      const records: ActivityRecord[] = [
        {
          id: '1',
          activityId: 'running-001',
          value: { type: 'number', value: 5, unit: 'km' },
          date: '2025-01-09',
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          activityId: 'running-001',
          value: { type: 'number', value: 3, unit: 'km' },
          date: '2025-01-08',
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      expect(calculateTotalValue(records)).toBe(8);
    });
  });

  describe('calculateAverageValue', () => {
    it('should calculate average value from records', () => {
      const records: ActivityRecord[] = [
        {
          id: '1',
          activityId: 'running-001',
          value: { type: 'number', value: 5, unit: 'km' },
          date: '2025-01-09',
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          activityId: 'running-001',
          value: { type: 'number', value: 3, unit: 'km' },
          date: '2025-01-08',
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      expect(calculateAverageValue(records)).toBe(4);
    });

    it('should return 0 for empty records', () => {
      expect(calculateAverageValue([])).toBe(0);
    });
  });

  describe('generateId', () => {
    it('should generate unique id', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
    });
  });
});
