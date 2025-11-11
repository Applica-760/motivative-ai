import { Modal, type ModalProps } from '@mantine/core';
import type { ReactNode } from 'react';

/**
 * StyledModalのProps
 * Mantineの標準Modalを継承
 */
export interface StyledModalProps extends Omit<ModalProps, 'styles' | 'overlayProps' | 'transitionProps'> {
  /** モーダルの内容 */
  children: ReactNode;
  /** カスタムスタイルを上書きする場合 */
  styles?: ModalProps['styles'];
  /** カスタムオーバーレイプロパティを上書きする場合 */
  overlayProps?: ModalProps['overlayProps'];
  /** カスタムトランジションを上書きする場合 */
  transitionProps?: ModalProps['transitionProps'];
}

/**
 * アプリケーション全体で統一されたスタイルのモーダル
 * Feature-Sliced Design: shared/ui
 * 
 * ダークテーマに最適化され、アニメーション付きのモーダルコンポーネント。
 * すべてのモーダルはこのコンポーネントを使用することで、
 * 一貫したUXとメンテナンス性を確保する。
 * 
 * @example
 * ```tsx
 * <StyledModal
 *   opened={opened}
 *   onClose={onClose}
 *   title="タイトル"
 *   size="md"
 * >
 *   <p>モーダルの内容</p>
 * </StyledModal>
 * ```
 */
export function StyledModal({
  children,
  styles: customStyles,
  overlayProps: customOverlayProps,
  transitionProps: customTransitionProps,
  ...props
}: StyledModalProps) {
  // デフォルトスタイル
  const defaultStyles: ModalProps['styles'] = {
    content: {
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      border: '1px solid #333',
    },
    header: {
      backgroundColor: '#1a1a1a',
      borderBottom: '1px solid #333',
      padding: '1.5rem',
    },
    title: {
      color: '#fff',
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    body: {
      padding: '1.5rem',
      color: '#fff',
    },
    close: {
      color: '#fff',
      '&:hover': {
        backgroundColor: '#333',
      },
    },
  };

  // デフォルトオーバーレイ
  const defaultOverlayProps: ModalProps['overlayProps'] = {
    backgroundOpacity: 0.55,
    blur: 3,
  };

  // デフォルトトランジション（より目立つアニメーション）
  const defaultTransitionProps: ModalProps['transitionProps'] = {
    transition: 'pop',      // スケール + フェード効果
    duration: 250,          // 250ms（体感できる速度）
    timingFunction: 'ease-out',
  };

  return (
    <Modal
      {...props}
      styles={customStyles ?? defaultStyles}
      overlayProps={customOverlayProps ?? defaultOverlayProps}
      transitionProps={customTransitionProps ?? defaultTransitionProps}
      centered
    >
      {children}
    </Modal>
  );
}
