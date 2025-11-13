import { Select, Loader, Text, Box } from '@mantine/core';
import { colors } from '@/shared/config';
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
        <Text size="sm" fw={500} mb="0.5rem" style={{ color: colors.form.placeholder }}>
          アクティビティ <span style={{ color: colors.form.required }}>*</span>
        </Text>
        <Box
          p="md"
          style={{
            backgroundColor: colors.form.background,
            borderRadius: '8px',
            border: `1px solid ${colors.form.border}`,
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
          backgroundColor: colors.form.background,
          borderColor: colors.form.border,
          color: colors.form.text,
          '&:focus': {
            borderColor: colors.form.borderFocus,
          },
        },
        label: {
          color: colors.form.placeholder,
          marginBottom: '0.5rem',
        },
        dropdown: {
          backgroundColor: colors.form.background,
          borderColor: colors.form.border,
        },
        option: {
          color: colors.form.text,
          '&[data-selected]': {
            backgroundColor: colors.action.primary,
          },
          '&:hover': {
            backgroundColor: colors.button.secondaryBackground,
          },
        },
      }}
    />
  );
}
