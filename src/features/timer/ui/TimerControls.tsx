import { Stack, Button } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop, IconRefresh } from '@tabler/icons-react';
import type { TimerStatus } from '../model/types';

interface TimerControlsProps {
  /** タイマーの状態 */
  status: TimerStatus;
  /** 開始ボタンのハンドラ */
  onStart: () => void;
  /** 停止ボタンのハンドラ */
  onStop: () => void;
  /** リセットボタンのハンドラ */
  onReset: () => void;
}

/**
 * タイマーの制御ボタン群
 * 
 * 状態に応じて適切なボタンを表示:
 * - idle: START
 * - running: STOP
 * - stopped: START, RESET
 */
export function TimerControls({
  status,
  onStart,
  onStop,
  onReset,
}: TimerControlsProps) {
  return (
    <Stack gap="xs">
      {status === 'running' ? (
        <Button
          leftSection={<IconPlayerStop size={16} />}
          onClick={onStop}
          variant="light"
          color="red"
          fullWidth
          size="lg"
          style={{ minHeight: '82px' }}
        >
          停止
        </Button>
      ) : (
        <>
          <Button
            leftSection={<IconPlayerPlay size={16} />}
            onClick={onStart}
            variant="filled"
            color="green"
            fullWidth
          >
            開始
          </Button>
          {status === 'stopped' && (
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={onReset}
              variant="subtle"
              color="gray"
              fullWidth
            >
              リセット
            </Button>
          )}
        </>
      )}
    </Stack>
  );
}
