import { NumberInput, TextInput, Checkbox, Textarea, Box, Text } from '@mantine/core';
import type { ActivityValue, ActivityDefinition } from '@/shared/types';
import { useActivity } from '../../hooks/useActivities';

interface ValueInputProps {
  activityId: string;
  value: ActivityValue;
  onChange: (value: ActivityValue) => void;
  error?: string;
}

/**
 * 値入力フィールド
 * 
 * 選択されたアクティビティの記録タイプに応じて、
 * 適切な入力フィールドを表示する。
 * 
 * - number: 数値入力
 * - duration: 時間入力（分）
 * - boolean: チェックボックス
 * - text: テキストエリア
 */
export function ValueInput({ activityId, value, onChange, error }: ValueInputProps) {
  const { activity, isLoading } = useActivity(activityId);

  // アクティビティが選択されていない場合
  if (!activityId) {
    return (
      <Box>
        <Text size="sm" fw={500} mb="0.5rem" style={{ color: '#ccc' }}>
          値 <span style={{ color: '#fa5252' }}>*</span>
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
            アクティビティを選択してください
          </Text>
        </Box>
      </Box>
    );
  }

  // 読み込み中
  if (isLoading) {
    return (
      <Box>
        <Text size="sm" fw={500} mb="0.5rem" style={{ color: '#ccc' }}>
          値 <span style={{ color: '#fa5252' }}>*</span>
        </Text>
        <TextInput
          placeholder="読み込み中..."
          disabled
          styles={{
            input: {
              backgroundColor: '#2a2a2a',
              borderColor: '#444',
              color: '#888',
            },
          }}
        />
      </Box>
    );
  }

  // アクティビティが見つからない場合
  if (!activity) {
    return null;
  }

  return (
    <Box>
      {renderInputByType(activity, value, onChange, error)}
    </Box>
  );
}

/**
 * アクティビティの記録タイプに応じた入力フィールドをレンダリング
 */
function renderInputByType(
  activity: ActivityDefinition,
  value: ActivityValue,
  onChange: (value: ActivityValue) => void,
  error?: string
) {
  switch (activity.valueType) {
    case 'number':
      return (
        <NumberInput
          label="値"
          placeholder={`例: 5 ${activity.unit || ''}`}
          value={value.type === 'number' ? value.value : 0}
          onChange={(val) =>
            onChange({
              type: 'number',
              value: typeof val === 'number' ? val : 0,
              unit: activity.unit,
            })
          }
          min={0}
          step={0.1}
          decimalScale={2}
          required
          error={error}
          suffix={activity.unit ? ` ${activity.unit}` : undefined}
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
          }}
        />
      );

    case 'duration':
      return (
        <NumberInput
          label="時間"
          placeholder="例: 30"
          value={value.type === 'duration' ? value.value : 0}
          onChange={(val) =>
            onChange({
              type: 'duration',
              value: typeof val === 'number' ? val : 0,
              unit: 'minutes',
            })
          }
          min={0}
          step={1}
          required
          error={error}
          suffix=" 分"
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
          }}
        />
      );

    case 'boolean':
      return (
        <Box>
          <Checkbox
            label="実施しました"
            checked={value.type === 'boolean' ? value.value : false}
            onChange={(e) =>
              onChange({
                type: 'boolean',
                value: e.currentTarget.checked,
              })
            }
            size="md"
            styles={{
              root: {
                padding: '1rem',
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                border: '1px solid #444',
              },
              label: {
                color: '#fff',
                paddingLeft: '0.5rem',
              },
              input: {
                backgroundColor: '#1a1a1a',
                borderColor: '#444',
                '&:checked': {
                  backgroundColor: '#4ECDC4',
                  borderColor: '#4ECDC4',
                },
              },
            }}
          />
          {error && (
            <Text size="sm" c="red" mt="xs">
              {error}
            </Text>
          )}
        </Box>
      );

    case 'text':
      return (
        <Textarea
          label="テキスト"
          placeholder="メモや感想を入力"
          value={value.type === 'text' ? value.value : ''}
          onChange={(e) =>
            onChange({
              type: 'text',
              value: e.currentTarget.value,
            })
          }
          required
          error={error}
          minRows={3}
          maxRows={6}
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
          }}
        />
      );

    default:
      return null;
  }
}
