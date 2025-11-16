/**
 * グリッドレイアウトの定数定義
 */
export const GRID_CONFIG = {
  /** グリッド間のギャップ（px） */
  GAP: 24,
  
  /** デスクトップの列数 */
  DESKTOP_COLUMNS: 5,
  
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
  
  /** Container Queryのブレークポイント（コンテナ幅ベース） */
  CONTAINER_BREAKPOINTS: {
    /** 極小サイズ（~200px）- モバイルの小さいグリッド */
    XS: 200,
    /** 小サイズ（~300px）- モバイルの通常グリッド */
    SM: 300,
    /** 中サイズ（~400px）- タブレットのグリッド */
    MD: 400,
    /** 大サイズ（~600px）- デスクトップの小グリッド */
    LG: 600,
    /** 特大サイズ（600px~）- デスクトップの大グリッド */
    XL: 800,
  },
} as const;

/**
 * Container Query用のメディアクエリ文字列を生成するヘルパー
 */
export const containerQuery = {
  xs: `(max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.XS}px)`,
  sm: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.XS + 1}px) and (max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.SM}px)`,
  md: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.SM + 1}px) and (max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.MD}px)`,
  lg: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.MD + 1}px) and (max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.LG}px)`,
  xl: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.LG + 1}px)`,
  // 最小幅からの指定
  minXs: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.XS}px)`,
  minSm: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.SM}px)`,
  minMd: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.MD}px)`,
  minLg: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.LG}px)`,
  minXl: `(min-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.XL}px)`,
  // 最大幅までの指定
  maxXs: `(max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.XS}px)`,
  maxSm: `(max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.SM}px)`,
  maxMd: `(max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.MD}px)`,
  maxLg: `(max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.LG}px)`,
  maxXl: `(max-width: ${GRID_CONFIG.CONTAINER_BREAKPOINTS.XL}px)`,
} as const;

