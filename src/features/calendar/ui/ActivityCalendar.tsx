import { Stack } from '@mantine/core';
import { MonthlyActivityCalendar } from './MonthlyActivityCalendar';
import { useActivityContext } from '@/features/activity/model';
import type { ActivityDefinition } from '@/shared/types';

interface ActivityCalendarProps {
  /** 表示するアクティビティ */
  activity: ActivityDefinition;
}

/**
 * アクティビティカレンダーコンポーネント
 * 月次カレンダーで記録を可視化
 */
export function ActivityCalendar({ activity }: ActivityCalendarProps) {
  const { getRecordsByActivityId } = useActivityContext();
  
  // このアクティビティの記録のみを取得
  const activityRecords = getRecordsByActivityId(activity.id);

  return (
    <Stack 
      gap={0}
      p={0}
      style={{ 
        height: '100%',
        width: '100%',
      }}
    >
      <MonthlyActivityCalendar activity={activity} records={activityRecords} />
    </Stack>
  );
}

