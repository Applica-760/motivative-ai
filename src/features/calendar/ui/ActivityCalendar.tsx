import { Stack, Group, Text, ActionIcon, Box } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import type { ActivityCalendarProps } from '../model';
import { formatYearMonth } from '../model';
import { useCalendarNavigation } from '../hooks';
import 'dayjs/locale/ja';

/**
 * アクティビティカレンダーコンポーネント
 * アイコン、タイトルとカレンダーを表示する統合コンポーネント
 * ユーザーが月を切り替え可能
 * 
 * ロジックはカスタムフックに委譲し、UIの責務に集中
 */
export function ActivityCalendar({
  activity,
}: ActivityCalendarProps) {
  // カスタムフックでナビゲーションロジックを管理
  const { currentMonth, goToPrevMonth, goToNextMonth } = useCalendarNavigation();

  // 前月へ移動
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    goToPrevMonth();
  };

  // 次月へ移動
  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    goToNextMonth();
  };

  return (
    <Stack 
      gap={4}
      p="xs"
      style={{ 
        height: '100%',
        width: '100%',
      }}
    >
      {/* ヘッダー: アイコンとタイトル - コンパクトに上部配置 */}
      <Group gap={4} wrap="nowrap" align="center">
        <Text style={{ fontSize: '0.9rem', lineHeight: 1 }}>
          {activity.icon}
        </Text>
        <Text size="xs" fw={600} truncate style={{ lineHeight: 1 }}>
          {activity.title}
        </Text>
      </Group>

      {/* 月切り替えボタン - コンパクトに */}
      <Group justify="center" gap={4} wrap="nowrap">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="xs"
          onClick={handlePrevMonth}
          title="前月"
        >
          <IconChevronLeft size={12} />
        </ActionIcon>
        <Text size="xs" fw={500} style={{ minWidth: '55px', textAlign: 'center', lineHeight: 1 }}>
          {formatYearMonth(currentMonth)}
        </Text>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="xs"
          onClick={handleNextMonth}
          title="次月"
        >
          <IconChevronRight size={12} />
        </ActionIcon>
      </Group>

      {/* カレンダー本体 - 最大化 */}
      <Box style={{ flex: 1, overflow: 'hidden', width: '100%' }}>
        <Calendar
          date={currentMonth}
          locale="ja"
          static
          styles={{
            calendarHeader: {
              maxWidth: '100%',
              marginBottom: '2px',
            },
            calendarHeaderLevel: {
              display: 'none',
            },
            calendarHeaderControl: {
              display: 'none',
            },
            monthCell: {
              padding: '0',
            },
            weekday: {
              fontSize: '9px',
              color: 'dimgray',
              padding: '2px',
            },
            day: {
              height: '28px',
              fontSize: '11px',
              padding: '2px',
            },
          }}
        />
      </Box>
    </Stack>
  );
}
