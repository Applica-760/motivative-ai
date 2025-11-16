import { Box } from '@mantine/core';
import { TextLogList } from './TextLogList';
import type { ActivityDefinition, ActivityRecord } from '@/shared/types';
import type { ContainerSize } from '@/features/grid-layout';

interface TextLogWidgetProps {
  /** アクティビティ定義 */
  activity: ActivityDefinition;
  
  /** アクティビティ記録 */
  records: ActivityRecord[];
  
  /** クリックハンドラー（オプション） */
  onClick?: () => void;
  
  /** コンテナサイズ */
  containerSize?: ContainerSize;
}

/**
 * TextLogListをウィジェットとして提供
 * グリッドアイテムに注入できる形式でラップ
 * 
 * 役割:
 * - グリッドレイアウトシステムとの統合
 * - クリック可能な場合のインタラクション処理
 * - アクセシビリティ対応
 * 
 * graph/calendar featureのWidget実装パターンを踏襲
 */
export function TextLogWidget({ activity, records, onClick }: TextLogWidgetProps) {
  const isClickable = !!onClick;

  return (
    <Box
      onClick={onClick}
      style={{
        height: '100%',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (isClickable) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={isClickable ? `${activity.title}のテキストログを表示` : undefined}
    >
      <TextLogList activity={activity} records={records} />
    </Box>
  );
}
