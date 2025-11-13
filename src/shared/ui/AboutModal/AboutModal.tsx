import { Stack, Text, List, ThemeIcon, Box } from '@mantine/core';
import { IconRocket, IconTarget, IconChartBar, IconClock } from '@tabler/icons-react';
import { StyledModal } from '../StyledModal';

export interface AboutModalProps {
  /** モーダルの表示状態 */
  opened: boolean;
  /** モーダルを閉じるハンドラー */
  onClose: () => void;
}

/**
 * Motivative AIの概要を説明するモーダル
 * 
 * アプリケーション全体の目的や主要機能を紹介する。
 * LeftSidebarから呼び出される。
 */
export function AboutModal({ opened, onClose }: AboutModalProps) {
  return (
    <StyledModal
      opened={opened}
      onClose={onClose}
      title="Motivative AIとは？"
      size="lg"
    >
      <Stack gap="xl">
        {/* アプリケーションの説明 */}
        <Box>
          <Text size="md" c="white" mb="md">
            Motivative AIは、あなたの日々の活動を記録し、
            モチベーションを高めるための活動管理ツールです。
          </Text>
          <Text size="sm" c="dimmed">
            習慣化したい活動や目標を設定し、継続的に記録することで、
            自己成長を可視化できます。
          </Text>
        </Box>

        {/* 主要機能 */}
        <Box>
          <Text size="lg" fw={600} mb="md" c="white">
            主要機能
          </Text>
          <List
            spacing="md"
            size="sm"
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconRocket size={16} />
              </ThemeIcon>
            }
          >
            <List.Item
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconTarget size={16} />
                </ThemeIcon>
              }
            >
              <Text fw={500} c="white">アクティビティ管理</Text>
              <Text size="xs" c="dimmed" mt={4}>
                習慣化したい活動を自由に登録・管理できます
              </Text>
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconClock size={16} />
                </ThemeIcon>
              }
            >
              <Text fw={500} c="white">活動記録</Text>
              <Text size="xs" c="dimmed" mt={4}>
                実施した活動の時間や内容を簡単に記録できます
              </Text>
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconChartBar size={16} />
                </ThemeIcon>
              }
            >
              <Text fw={500} c="white">データ可視化</Text>
              <Text size="xs" c="dimmed" mt={4}>
                活動の履歴をグラフで確認し、進捗を把握できます
              </Text>
            </List.Item>
          </List>
        </Box>

        {/* 使い始め方 */}
        <Box>
          <Text size="lg" fw={600} mb="md" c="white">
            使い始め方
          </Text>
          <List spacing="sm" size="sm" c="dimmed" type="ordered">
            <List.Item>
              左サイドバーの「＋」ボタンから新しいアクティビティを作成
            </List.Item>
            <List.Item>
              作成したアクティビティをクリックして詳細を確認・編集
            </List.Item>
            <List.Item>
              ダッシュボードのウィジェットから活動を記録
            </List.Item>
            <List.Item>
              グラフで進捗を確認し、モチベーションを維持
            </List.Item>
          </List>
        </Box>
      </Stack>
    </StyledModal>
  );
}
