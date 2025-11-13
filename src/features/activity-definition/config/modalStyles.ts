import type { ModalProps } from '@mantine/core';
import { colors } from '@/shared/config';

/**
 * アクティビティ関連モーダルの共通スタイル
 */
export const MODAL_STYLES: ModalProps['styles'] = {
  content: {
    backgroundColor: colors.modal.background,
    borderRadius: '12px',
    border: `1px solid ${colors.modal.border}`,
  },
  header: {
    backgroundColor: colors.modal.background,
    borderBottom: `1px solid ${colors.modal.border}`,
    padding: '1.5rem',
  },
  title: {
    color: colors.form.text,
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  body: {
    padding: '1.5rem',
    color: colors.form.text,
  },
  close: {
    color: colors.form.text,
    '&:hover': {
      backgroundColor: colors.button.secondaryBackground,
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

/**
 * モーダルのトランジション設定
 * スムーズな開閉アニメーションを提供
 */
export const MODAL_TRANSITION_PROPS: ModalProps['transitionProps'] = {
  transition: 'fade',
  duration: 200,
  timingFunction: 'ease',
};
