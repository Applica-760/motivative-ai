import { Box, Text, Group, Stack, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { isSameDay } from '../model';

interface MonthlyActivityCalendarProps {
  /** 表示するアクティビティ */
  activity: ActivityDefinition;
  /** アクティビティの記録データ */
  records: ActivityRecord[];
}

/**
 * 月次アクティビティカレンダーコンポーネント
 * 月単位でカレンダーを表示し、記録があった日にアイコンを表示
 */
export function MonthlyActivityCalendar({
  activity,
  records,
}: MonthlyActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 現在表示中の月の情報
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // 月の最初と最後の日を取得
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // 月の最初の曜日（0=日曜, 6=土曜）
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // 月の日数
  const daysInMonth = lastDayOfMonth.getDate();

  // カレンダーグリッド用の日付配列を生成
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    
    // 月の最初の日までの空白セルを追加
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // 月の各日を追加
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [year, month, firstDayOfWeek, daysInMonth]);

  // 特定の日付に記録があるかチェック
  const hasRecordOnDate = (date: Date): boolean => {
    return records.some(record => {
      const recordDate = new Date(record.date);
      return isSameDay(recordDate, date);
    });
  };

  // 今日の日付かチェック
  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  // 前月へ移動
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 次月へ移動
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 年月の表示形式
  const yearMonthDisplay = `${year}年 ${month + 1}月`;

  // 曜日ラベル
  const weekdayLabels = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <Stack gap="sm" p="md" style={{ height: '100%', width: '100%' }}>
      {/* ヘッダー：月切り替え */}
      <Group justify="space-between" wrap="nowrap" mb="xs">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={goToPrevMonth}
          aria-label="前月"
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        
        <Text size="sm" fw={600}>
          {yearMonthDisplay}
        </Text>
        
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={goToNextMonth}
          aria-label="次月"
        >
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>

      {/* 曜日ヘッダー */}
      <Group gap={0} wrap="nowrap" style={{ width: '100%' }}>
        {weekdayLabels.map((label, index) => (
          <Box
            key={label}
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              size="xs"
              fw={600}
              c={index === 0 ? 'red' : index === 6 ? 'blue' : 'dimmed'}
            >
              {label}
            </Text>
          </Box>
        ))}
      </Group>

      {/* カレンダーグリッド - 縦長レイアウト最適化 */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* 週ごとに行を分割 */}
        {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
          <Group key={weekIndex} gap={0} wrap="nowrap" style={{ flex: 1, width: '100%' }}>
            {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => {
              if (!date) {
                // 空のセル
                return <Box key={`empty-${dayIndex}`} style={{ flex: 1 }} />;
              }

              const hasRecord = hasRecordOnDate(date);
              const today = isToday(date);
              const dayOfWeek = date.getDay();

              return (
                <Box
                  key={date.toISOString()}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: '60px',
                    position: 'relative',
                    backgroundColor: hasRecord ? '#d3f9d8' : 'transparent',
                    borderRadius: '6px',
                    padding: '6px 3px',
                    border: today ? '2px solid #339af0' : '2px solid transparent',
                  }}
                >
                  {/* 日付 */}
                  <Text
                    size="sm"
                    fw={today ? 600 : 400}
                    c={dayOfWeek === 0 ? 'red' : dayOfWeek === 6 ? 'blue' : 'dark'}
                    style={{
                      marginBottom: '4px',
                    }}
                  >
                    {date.getDate()}
                  </Text>

                  {/* アクティビティアイコン（記録がある場合） */}
                  {hasRecord && (
                    <Text
                      style={{
                        fontSize: '28px',
                        lineHeight: 1,
                      }}
                    >
                      {activity.icon}
                    </Text>
                  )}
                </Box>
              );
            })}
          </Group>
        ))}
      </Box>
    </Stack>
  );
}
