/**
 * グリッドレイアウトの定数定義
 */
export const GRID_CONFIG = {
  /** グリッド間のギャップ（px） */
  GAP: 24,
  
  /** デスクトップの列数 */
  DESKTOP_COLUMNS: 4,
  
  /** モバイルの列数 */
  MOBILE_COLUMNS: 2,
  
  /** モバイル判定のブレークポイント（px） */
  MOBILE_BREAKPOINT: 768,
  
  /** ドラッグ検出の最小移動距離（px） */
  DRAG_THRESHOLD: 10,
  
  /** ホバーアニメーションの移動距離（px） */
  HOVER_TRANSLATE_Y: -4,
  
  /** ドラッグハンドルのアイコン */
  DRAG_HANDLE_ICON: '⋮⋮',
  
  /** ドラッグハンドルの位置（px） */
  DRAG_HANDLE_POSITION: {
    top: 0,
    left: 4,
  },
  
  /** ドラッグ中の不透明度 */
  DRAGGING_OPACITY: 0.5,
  
  /** ドラッグオーバーレイの不透明度 */
  DRAG_OVERLAY_OPACITY: 0.8,
} as const;
