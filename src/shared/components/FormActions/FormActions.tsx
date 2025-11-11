import { Box, Button } from '@mantine/core';

interface FormActionsProps {
  /** 送信中かどうか */
  isSubmitting: boolean;
  /** 送信ボタンのテキスト */
  submitText: string;
  /** キャンセルボタンを表示するか */
  showCancel?: boolean;
  /** キャンセル時のコールバック */
  onCancel?: () => void;
  /** 送信ボタンを無効化するか */
  disableSubmit?: boolean;
}

/**
 * フォームのアクションボタン（キャンセル・送信）
 * 
 * ActivityFormとRecordFormで共通のボタンレイアウトとスタイルを提供。
 * 複数のfeatureで使用されるため、shared/componentsに配置。
 */
export function FormActions({
  isSubmitting,
  submitText,
  showCancel = true,
  onCancel,
  disableSubmit = false,
}: FormActionsProps) {
  return (
    <Box
      style={{
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1rem',
      }}
    >
      {showCancel && onCancel && (
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          fullWidth
          styles={{
            root: {
              borderColor: '#444',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#333',
              },
            },
          }}
        >
          キャンセル
        </Button>
      )}
      
      <Button
        type="submit"
        loading={isSubmitting}
        disabled={disableSubmit}
        fullWidth
        styles={{
          root: {
            backgroundColor: '#4ECDC4',
            color: '#1a1a1a',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#3db8b8',
            },
            '&:disabled': {
              backgroundColor: '#333',
              color: '#666',
            },
          },
        }}
      >
        {submitText}
      </Button>
    </Box>
  );
}
