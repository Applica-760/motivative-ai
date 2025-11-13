import { useState, useCallback, useEffect, useMemo } from 'react';
import { useInterval } from '@mantine/hooks';
import { useStorage } from '@/shared/services/storage';
import { TimerRepository } from '../api/repositories';
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

/**
 * タイマーロジックを管理するカスタムフック
 * 
 * 3層アーキテクチャに準拠し、TimerRepositoryを通してデータアクセス。
 * 
 * 機能:
 * - start/stop/resetのシンプルな操作
 * - 1秒ごとに経過時間を更新
 * - StorageService経由で状態を永続化（ログイン状態に応じてLocalStorage/Firebase自動切替）
 * 
 * 停止と一時停止の違いを排除し、直感的な操作を実現
 */
export function useTimer(): UseTimerReturn {
  const storage = useStorage();
  const repository = useMemo(() => new TimerRepository(storage), [storage]);
  
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const interval = useInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  // 初回マウント時にRepositoryから復元
  useEffect(() => {
    const loadState = async () => {
      try {
        const state = await repository.loadTimerState();
        if (state && typeof state.seconds === 'number' && state.seconds > 0) {
          setSeconds(state.seconds);
          setStatus('stopped');
        }
      } catch (error) {
        console.error('[useTimer] Failed to restore state:', error);
      }
    };
    
    loadState();
  }, [repository]);

  // 状態が変更されたらRepositoryへ保存
  useEffect(() => {
    if (seconds > 0 || status !== 'idle') {
      repository.saveTimerState(seconds, status);
    }
  }, [seconds, status, repository]);

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
    repository.clearTimerState();
  }, [interval, repository]);

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
