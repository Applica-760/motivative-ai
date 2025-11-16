import { Group, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import './GridItemHeader.css';

interface GridItemHeaderProps {
  /** アイコン（絵文字） */
  icon: string;
  /** タイトル */
  title: string;
  /** 右側に配置する追加要素（オプション） */
  actions?: ReactNode;
}

/**
 * グリッドアイテムの共通ヘッダーコンポーネント
 * 
 * 役割:
 * - アイコンとタイトルを統一的なスタイルで表示
 * - オプションで右側にアクション要素（ボタンなど）を配置可能
 * - Container Queryによるレスポンシブ対応
 * 
 * デザイン原則:
 * - タイトルは長い場合に省略表示（...）
 * - 固定の余白・サイズ設定で一貫性を保つ
 * - アクションは右側に配置（チャート切り替えボタンなど）
 */
export function GridItemHeader({ icon, title, actions }: GridItemHeaderProps) {
  return (
    <Group
      justify="space-between"
      align="center"
      wrap="nowrap"
      className="grid-item-header"
    >
      {/* 左側: アイコンとタイトル */}
      <Group gap={6} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        <Text className="grid-item-header-icon">
          {icon}
        </Text>
        <Text className="grid-item-header-title">
          {title}
        </Text>
      </Group>

      {/* 右側: アクション要素（オプション） */}
      {actions && (
        <Group gap="xs" wrap="nowrap" className="grid-item-header-actions">
          {actions}
        </Group>
      )}
    </Group>
  );
}
