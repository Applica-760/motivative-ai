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
      gap={0}
      p={0}
      style={{ 
        height: '100%',
        width: '100%',
      }}
    >
      {/* ヘッダー: アイコンとタイトル - 右寄せで最上部配置 */}
      <Group gap={4} wrap="nowrap" align="center" style={{ paddingLeft: '32px', paddingTop: '2px', marginBottom: '12px' }}>
        <Text style={{ fontSize: '1.125rem', lineHeight: 1 }}>
          {activity.icon}
        </Text>
        <Text size="sm" fw={600} truncate style={{ lineHeight: 1 }}>
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
        <Text size="sm" fw={500} style={{ minWidth: '55px', textAlign: 'center', lineHeight: 1 }}>
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

      {/* カレンダー本体 - 拡大・横方向のみ中央揃え */}
      <Box style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', width: '100%' }}>
        <Box style={{ width: '100%', maxWidth: '300px', height: '100%', display: 'flex', justifyContent: 'center' }}>
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
                fontSize: '10px',
                color: 'dimgray',
                padding: '2px',
              },
              day: {
                height: '36px',
                fontSize: '13px',
                padding: '2px',
              },
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
