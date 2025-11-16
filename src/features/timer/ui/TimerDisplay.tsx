import { RingProgress, Text, Center, Stack } from '@mantine/core';
import { formatTime, calculateProgress } from '../model/timerUtils';
import './TimerDisplay.css';

interface TimerDisplayProps {
  /** 経過秒数 */
  seconds: number;
}

/**
 * タイマーの経過時間を視覚的に表示するコンポーネント
 * 
 * RingProgressで進捗を表示し、中央に経過時間を表示
 */
export function TimerDisplay({ seconds }: TimerDisplayProps) {
  const progress = calculateProgress(seconds);
  const timeString = formatTime(seconds);

  return (
    <Center className="timer-display-container">
      <RingProgress
        className="timer-display-ring"
        thickness={10}
        roundCaps
        sections={[
          {
            value: progress,
            color: progress < 33 ? 'green' : progress < 66 ? 'yellow' : 'red',
          },
        ]}
        label={
          <Center>
            <Stack gap={0} align="center">
              <Text c="dimmed" className="timer-display-label">
                経過時間
              </Text>
              <Text className="timer-display-time">
                {timeString}
              </Text>
            </Stack>
          </Center>
        }
      />
    </Center>
  );
}
