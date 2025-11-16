import { Stack, Button, Divider, Box } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { colors } from '@/shared/config';
import type { ContainerSize } from '@/features/grid-layout';
import { useTimer } from '../hooks/useTimer';
import { useQuickRecord } from '../hooks/useQuickRecord';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { ActivitySelector } from './ActivitySelector';
import './TimerWidget.css';

interface TimerWidgetProps {
  /** コンテナサイズ */
  containerSize?: ContainerSize;
}

/**
 * タイマーウィジェット（MVP版）
 * 
 * 機能:
 * - タイマーの開始/停止/リセット
 * - RingProgressでの視覚的な時間表示
 * - duration型アクティビティの選択
 * - 記録ボタンでの手動記録
 * 
 * グリッドサイズ: small-square（1×1の正方形）
 */
export function TimerWidget({ containerSize: _containerSize }: TimerWidgetProps = {}) {
  const { seconds, status, start, stop, reset } = useTimer();
  const { selectedActivityId, selectActivity, isSaving, saveRecord } = useQuickRecord();

  const handleSaveRecord = async () => {
    const success = await saveRecord(seconds);
    if (success) {
      reset(); // 記録成功時のみリセット
    }
  };

  // ボタンを有効にする条件: タイマーが停止していることのみ
  // アクティビティ未選択や1分未満は、クリック時にエラー通知で対応
  const canSaveRecord = status === 'stopped' && seconds > 0;

  return (
    <Stack gap="sm" className="timer-widget-container">
      {/* タイマー表示 */}
      <TimerDisplay seconds={seconds} />

      {/* 制御ボタン */}
      <TimerControls
        status={status}
        onStart={start}
        onStop={stop}
        onReset={reset}
      />

      <Divider className="timer-widget-divider" />

      {/* アクティビティ選択 */}
      <Box className="timer-widget-activity-selector">
        <ActivitySelector
          selectedActivityId={selectedActivityId}
          onSelect={selectActivity}
        />
      </Box>

      {/* 記録ボタン */}
      <Button
        leftSection={<IconDeviceFloppy size={16} />}
        onClick={handleSaveRecord}
        disabled={!canSaveRecord}
        loading={isSaving}
        fullWidth
        size="sm"
        className="timer-widget-button"
        styles={{
          root: {
            backgroundColor: colors.action.primary,
            color: colors.button.textDark,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: colors.action.primaryHover,
            },
            '&[data-disabled]': {
              backgroundColor: `${colors.button.disabledBackground} !important`,
              color: `${colors.button.disabledText} !important`,
              borderColor: `${colors.button.disabledBackground} !important`,
              opacity: '1 !important',
              pointerEvents: 'none',
            },
          },
        }}
      >
        記録を追加
      </Button>
    </Stack>
  );
}
