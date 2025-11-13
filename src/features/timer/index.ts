/**
 * Timer Feature
 * 
 * duration型アクティビティの記録を支援するタイマーウィジェット
 * MVP機能:
 * - 基本的なタイマー（start/pause/stop）
 * - RingProgressでの視覚表示
 * - duration型アクティビティの選択
 * - 手動での記録
 */

export { TimerWidget } from './ui/TimerWidget';
export { createTimerGridItems } from './config/gridConfig';
export type { TimerState } from './model/types';
