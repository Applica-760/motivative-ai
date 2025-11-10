import type { ActivityDefinition } from '@/shared/types';

/**
 * モックアクティビティ定義
 * 開発・テスト用のサンプルデータ
 */
export const mockActivityDefinitions: ActivityDefinition[] = [
  {
    id: 'running-001',
    title: 'ランニング',
    icon: '🏃',
    valueType: 'number',
    unit: 'km',
    color: '#FF6B6B',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    order: 1,
    isArchived: false,
  },
  {
    id: 'reading-001',
    title: '読書',
    icon: '📚',
    valueType: 'duration',
    unit: 'minutes',
    color: '#95E1D3',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    order: 2,
    isArchived: false,
  },
];
