import type { GridItemConfig } from '../../types';

/**
 * シャドウスタイルの戻り値型
 */
export interface ShadowStyles {
  /** Mantineのshadowプロパティ */
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** カスタムboxShadow CSS */
  boxShadow?: string;
}

/**
 * グリッドアイテムのシャドウスタイルを決定
 * ドラッグ状態、ホバー状態、カスタムシャドウの有無に基づいて適切なシャドウを返す
 * 
 * @param item - グリッドアイテム
 * @param isDragging - ドラッグ中かどうか
 * @param isHovered - ホバー中かどうか
 * @returns シャドウスタイル
 */
export function getItemShadow(
  item: GridItemConfig,
  isDragging: boolean,
  isHovered: boolean
): ShadowStyles {
  if (isDragging) {
    return { shadow: 'xl' };
  }
  
  if (item.customShadow) {
    return {
      boxShadow: isHovered ? item.customShadow.hover : item.customShadow.default,
    };
  }
  
  return { shadow: item.shadow || 'sm' };
}

/**
 * ドラッグハンドルのスタイルを生成
 * 
 * @param top - 上からの位置（px）
 * @param left - 左からの位置（px）
 * @param icon - 表示するアイコン
 * @returns スタイルオブジェクト
 */
export function getDragHandleStyle(
  top: number = 8,
  left: number = 8
): React.CSSProperties {
  return {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    fontSize: '20px',
    fontWeight: 'bold',
    opacity: 0.5,
    userSelect: 'none',
    cursor: 'grab',
    padding: '4px',
    zIndex: 10,
  };
}
