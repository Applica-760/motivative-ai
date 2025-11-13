/**
 * タイマーの状態
 */
export type TimerStatus = 'idle' | 'running' | 'stopped';

/**
 * タイマーの状態を表す型
 */
export interface TimerState {
  /** 経過秒数 */
  seconds: number;
  /** タイマーの状態 */
  status: TimerStatus;
  /** 選択中のアクティビティID */
  selectedActivityId: string | null;
}
