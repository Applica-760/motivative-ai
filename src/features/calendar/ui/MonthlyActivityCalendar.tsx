import { Box, Text, Group, Stack, ActionIcon } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { isSameDay } from '../model';
import './MonthlyActivityCalendar.css';

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

  // カレンダーの行数を計算（週数）
  const numberOfWeeks = Math.ceil(calendarDays.length / 7);

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

  // アクティビティのテーマ色（デフォルトは緑）
  const activityColor = activity.color || '#51cf66';
  
  // 記録がある日の背景色を計算（アクティビティのテーマ色を薄くする）
  const recordBackgroundColor = `${activityColor}30`; // 透明度を追加

  return (
    <Stack gap={0} className="monthly-calendar-container">
      {/* ヘッダー: 月切り替え */}
      <Group justify="space-between" wrap="nowrap" className="monthly-calendar-nav-group">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={goToPrevMonth}
          aria-label="前月"
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        
        <Text className="monthly-calendar-year-month">
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

      {/* カレンダー全体のラッパー - 中央揃えで親要素からはみ出さない */}
      <Box className="monthly-calendar-wrapper">
        {/* カレンダーグリッド - 曜日ヘッダーと日付を統合した7列固定グリッド */}
        <Box 
          className="monthly-calendar-grid"
          style={{ 
            gridTemplateRows: `auto repeat(${numberOfWeeks}, 1fr)`,
          }}
        >
          {/* 曜日ヘッダー（グリッドの最初の行） */}
          {weekdayLabels.map((label, index) => (
            <Box key={label} className="monthly-calendar-weekday">
              <Text
                className="monthly-calendar-weekday-text"
                c={index === 0 ? 'red' : index === 6 ? 'blue' : 'gray.6'}
              >
                {label}
              </Text>
            </Box>
          ))}

          {/* カレンダーの日付セル */}
        {calendarDays.map((date, index) => {
          if (!date) {
            // 空のセル
            return <Box key={`empty-${index}`} />;
          }

          const hasRecord = hasRecordOnDate(date);
          const today = isToday(date);
          const dayOfWeek = date.getDay();

          return (
            <Box
              key={date.toISOString()}
              className="monthly-calendar-day-cell"
              style={{
                backgroundColor: hasRecord ? recordBackgroundColor : 'transparent',
                // 今日のみ青いボーダー
                border: today ? '2px solid #339af0' : '2px solid transparent',
              }}
            >
              {/* 日付（常に上部固定） */}
              <Text
                fw={today ? 600 : 400}
                c={dayOfWeek === 0 ? 'red' : dayOfWeek === 6 ? 'blue' : 'gray.5'}
                className="monthly-calendar-day-number"
              >
                {date.getDate()}
              </Text>

              {/* アクティビティアイコン（記録がある場合のみ、常に下部固定） */}
              {hasRecord && (
                <Text className="monthly-calendar-activity-icon">
                  {activity.icon}
                </Text>
              )}
            </Box>
          );
        })}
        </Box>
      </Box>
    </Stack>
  );
}
