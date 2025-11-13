/**
 * Text Log Feature
 * テキスト型アクティビティの記録表示機能の公開インターフェース
 * 
 * 役割:
 * - テキスト型アクティビティの記録を時系列で表示
 * - 2×2のグリッドカードとして配置
 * - graph/calendar featureと同様の構造で独立管理
 */

// UI Components
export { TextLogWidget } from './ui';

// Grid Configuration
export { createTextLogGridItems } from './config';

// Types
export type { TextLogData } from './model';
