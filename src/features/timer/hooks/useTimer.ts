import { useState, useCallback, useEffect } from 'react';
import { useInterval } from '@mantine/hooks';
import type { TimerStatus } from '../model/types';

export interface UseTimerReturn {
  /** 経過秒数 */
  seconds: number;
  /** タイマーの状態 */
  status: TimerStatus;
  /** タイマーが実行中かどうか */
  isRunning: boolean;
  /** タイマーを開始 */
  start: () => void;
  /** タイマーを停止（時間は保持） */
  stop: () => void;
  /** タイマーをリセット（時間をクリア） */
  reset: () => void;
}

const STORAGE_KEY = 'timer-state';

/**
 * タイマーロジックを管理するカスタムフック
 * 
 * 機能:
 * - start/stop/resetのシンプルな操作
 * - 1秒ごとに経過時間を更新
 * - localStorageへの自動保存（ページリロード対応）
 * 
 * 停止と一時停止の違いを排除し、直感的な操作を実現
 */
export function useTimer(): UseTimerReturn {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const interval = useInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  // 初回マウント時にlocalStorageから復元
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { seconds: storedSeconds } = JSON.parse(stored);
        if (typeof storedSeconds === 'number' && storedSeconds > 0) {
          setSeconds(storedSeconds);
          setStatus('stopped');
        }
      } catch (error) {
        console.error('[useTimer] Failed to restore state:', error);
      }
    }
  }, []);

  // 状態が変更されたらlocalStorageに保存
  useEffect(() => {
    if (seconds > 0 || status !== 'idle') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ seconds, status }));
    }
  }, [seconds, status]);

  // タイマー開始
  const start = useCallback(() => {
    setStatus('running');
    interval.start();
  }, [interval]);

  // タイマー停止（時間は保持）
  const stop = useCallback(() => {
    setStatus('stopped');
    interval.stop();
  }, [interval]);

  // タイマーリセット（時間をクリア）
  const reset = useCallback(() => {
    setStatus('idle');
    setSeconds(0);
    interval.stop();
    localStorage.removeItem(STORAGE_KEY);
  }, [interval]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      interval.stop();
    };
  }, [interval]);

  return {
    seconds,
    status,
    isRunning: status === 'running',
    start,
    stop,
    reset,
  };
}
