import type { ActivityDefinition } from '@/shared/types';

/**
 * デフォルトアクティビティ定義
 * 初回起動時にユーザーに使い方を例示するためのサンプルデータ
 */
export const defaultActivities: ActivityDefinition[] = [
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
  {
    id: 'meditation-001',
    title: '瞑想',
    icon: '🧘',
    valueType: 'boolean',
    color: '#A8DADC',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    order: 3,
    isArchived: false,
  },
];
