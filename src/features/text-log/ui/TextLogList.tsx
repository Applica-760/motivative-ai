import { Box, Text, Stack } from '@mantine/core';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { toTextLogItems, formatDisplayDate } from '../model';
import type { TextLogItem } from '../model';
import './TextLogList.css';

interface TextLogListProps {
  /** アクティビティ定義 */
  activity: ActivityDefinition;
  
  /** アクティビティ記録（テキスト型のみ） */
  records: ActivityRecord[];
  
  /** 表示する記録の最大数 */
  maxItems?: number;
}

/**
 * 日付でグループ化されたテキストログ
 */
interface GroupedLog {
  date: string;
  items: TextLogItem[];
}

/**
 * ログアイテムを日付でグループ化
 */
function groupLogsByDate(logItems: TextLogItem[]): GroupedLog[] {
  const grouped = new Map<string, TextLogItem[]>();
  
  for (const item of logItems) {
    const existing = grouped.get(item.date) || [];
    existing.push(item);
    grouped.set(item.date, existing);
  }
  
  return Array.from(grouped.entries()).map(([date, items]) => ({
    date,
    items,
  }));
}

/**
 * テキストログのリスト表示コンポーネント
 * 
 * 役割:
 * - テキスト型記録を時系列で表示
 * - 同じ日付の記録をグループ化
 * - 空状態の処理
 */
export function TextLogList({ activity, records, maxItems = 5 }: TextLogListProps) {
  const logItems = toTextLogItems(records, maxItems);
  const groupedLogs = groupLogsByDate(logItems);
  const hasRecords = logItems.length > 0;

  return (
    <Box className="text-log-container">
      {/* ヘッダー（6点ボタンと横並び） */}
      <Box className="text-log-header">
        <Text fw={600} className="text-log-title">
          {activity.icon} {activity.title}
        </Text>
      </Box>

      {/* 記録リスト */}
      <Box className="text-log-content">
        {hasRecords ? (
          <Stack gap="lg">
            {groupedLogs.map((group) => (
              <Box key={group.date}>
                {/* 日付ヘッダー */}
                <Text
                  c="dimmed"
                  className="text-log-date-header"
                >
                  {formatDisplayDate(group.date)}
                </Text>
                
                {/* 同じ日付のテキストを連続表示 */}
                <Stack gap="xs">
                  {group.items.map((item) => (
                    <Text
                      key={item.id}
                      className="text-log-item"
                    >
                      {item.displayText}
                    </Text>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box className="text-log-empty">
            <Text c="dimmed" className="text-log-empty-text">
              記録がありません
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
