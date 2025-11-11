import { Select, Loader, Text, Box } from '@mantine/core';
import { useActivities } from '../hooks/useActivities';

interface ActivitySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * アクティビティ選択ドロップダウン
 * 
 * 既存のアクティビティ一覧から選択する。
 * useActivitiesフックを使用してアクティビティデータを取得。
 */
export function ActivitySelect({ value, onChange, error }: ActivitySelectProps) {
  const { activities, isLoading } = useActivities();

  // アクティビティが存在しない場合の表示
  if (!isLoading && activities.length === 0) {
    return (
      <Box>
        <Text size="sm" fw={500} mb="0.5rem" style={{ color: '#ccc' }}>
          アクティビティ <span style={{ color: '#fa5252' }}>*</span>
        </Text>
        <Box
          p="md"
          style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            border: '1px solid #444',
            textAlign: 'center',
          }}
        >
          <Text size="sm" c="dimmed">
            アクティビティが存在しません。
            <br />
            先にアクティビティを作成してください。
          </Text>
        </Box>
      </Box>
    );
  }

  // ドロップダウンのデータを作成
  const selectData = activities.map((activity) => ({
    value: activity.id,
    label: `${activity.icon} ${activity.title}`,
  }));

  return (
    <Select
      label="アクティビティ"
      placeholder={isLoading ? '読み込み中...' : 'アクティビティを選択'}
      value={value}
      onChange={(val) => val && onChange(val)}
      data={selectData}
      searchable
      required
      disabled={isLoading}
      error={error}
      leftSection={isLoading ? <Loader size="xs" /> : undefined}
      styles={{
        input: {
          backgroundColor: '#2a2a2a',
          borderColor: '#444',
          color: '#fff',
          '&:focus': {
            borderColor: '#4ECDC4',
          },
        },
        label: {
          color: '#ccc',
          marginBottom: '0.5rem',
        },
        dropdown: {
          backgroundColor: '#2a2a2a',
          borderColor: '#444',
        },
        option: {
          color: '#fff',
          '&[data-selected]': {
            backgroundColor: '#4ECDC4',
          },
          '&:hover': {
            backgroundColor: '#333',
          },
        },
      }}
    />
  );
}
