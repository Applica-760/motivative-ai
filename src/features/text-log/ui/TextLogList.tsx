import { Box, Text, Stack } from '@mantine/core';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import { toTextLogItems, formatDisplayDate } from '../model';
import type { TextLogItem } from '../model';

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
    <Box
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 1rem 1rem 0.5rem',
      }}
    >
      {/* ヘッダー（6点ボタンと横並び） */}
      <Box mb="xs" style={{ marginLeft: '1rem' }}>
        <Text
          size="lg"
          fw={600}
          style={{
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {activity.icon} {activity.title}
        </Text>
      </Box>

      {/* 記録リスト */}
      <Box style={{ flex: 1, overflow: 'auto', marginLeft: '1.5rem' }}>
        {hasRecords ? (
          <Stack gap="lg">
            {groupedLogs.map((group) => (
              <Box key={group.date}>
                {/* 日付ヘッダー */}
                <Text
                  size="xs"
                  c="dimmed"
                  mb="xs"
                  style={{ fontWeight: 600 }}
                >
                  {formatDisplayDate(group.date)}
                </Text>
                
                {/* 同じ日付のテキストを連続表示 */}
                <Stack gap="xs">
                  {group.items.map((item) => (
                    <Text
                      key={item.id}
                      size="sm"
                      style={{
                        color: '#e0e0e0',
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                      }}
                    >
                      {item.displayText}
                    </Text>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '120px',
            }}
          >
            <Text size="sm" c="dimmed" ta="center">
              記録がありません
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
