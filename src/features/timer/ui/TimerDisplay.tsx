import { RingProgress, Text, Center, Stack } from '@mantine/core';
import { formatTime, calculateProgress } from '../model/timerUtils';

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
    <Center style={{ flexShrink: 0 }}>
      <RingProgress
        size={160}
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
              <Text size="xs" c="dimmed" fw={500}>
                経過時間
              </Text>
              <Text
                size="lg"
                fw={700}
                style={{ fontVariant: 'tabular-nums', letterSpacing: '0.05em' }}
              >
                {timeString}
              </Text>
            </Stack>
          </Center>
        }
      />
    </Center>
  );
}
