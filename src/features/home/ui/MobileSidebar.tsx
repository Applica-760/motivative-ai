import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

interface MobileSidebarProps {
  /** サイドバーが開いているかどうか */
  isOpen: boolean;
  /** サイドバーを閉じるコールバック */
  onClose: () => void;
  /** サイドバーの位置 */
  side: 'left' | 'right';
  /** サイドバーの内容 */
  children: ReactNode;
}

/**
 * モバイル表示時のサイドバー
 * 左右どちらにも対応した共通コンポーネント
 */
export function MobileSidebar({ isOpen, onClose, side, children }: MobileSidebarProps) {
  const sideStyle = side === 'left' 
    ? { left: isOpen ? 0 : -300 }
    : { right: isOpen ? 0 : -300 };

  return (
    <>
      {/* サイドバー本体 */}
      <Box
        style={{
          position: 'fixed',
          top: 60,
          width: 300,
          height: 'calc(100vh - 60px)',
          backgroundColor: 'var(--mantine-color-body)',
          boxShadow: isOpen ? 'var(--mantine-shadow-lg)' : 'none',
          transition: side === 'left' ? 'left 0.3s ease' : 'right 0.3s ease',
          zIndex: 100,
          overflowY: 'auto',
          padding: '1rem',
          ...sideStyle,
        }}
      >
        {children}
      </Box>

      {/* オーバーレイ背景 */}
      {isOpen && (
        <Box
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 99,
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}
    </>
  );
}
