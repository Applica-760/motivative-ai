import type { ModalProps } from '@mantine/core';

/**
 * アクティビティ関連モーダルの共通スタイル
 */
export const MODAL_STYLES: ModalProps['styles'] = {
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

/**
 * モーダルのオーバーレイプロパティ
 */
export const MODAL_OVERLAY_PROPS: ModalProps['overlayProps'] = {
  backgroundOpacity: 0.55,
  blur: 3,
};
