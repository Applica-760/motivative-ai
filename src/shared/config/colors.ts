/**
 * アプリケーション全体で使用される色定義
 * Feature-Sliced Design: shared/config
 */

/**
 * 共通で使用される色の定数定義
 */
const GRID_ITEM_BACKGROUND_DARK = '#303030ff'; // ほぼ黒に近いダークグレー

export const colors = {
  // Primary Colors (ブランドカラー)
  primary: {
    main: '#228be6',
    dark: '#1971c2',
    light: '#339af0',
  },

  // Background Colors
  background: {
    white: '#ffffff',
    black: '#000000',
    dark: '#242424',
    darkSecondary: '#1a1a1a',
    light: '#f9f9f9',
    gridItemDark: GRID_ITEM_BACKGROUND_DARK, // グリッドアイテム共通の背景色
    gray: {
      dark: '#2d3748',
      medium: '#4a5568',
      light: '#868e96', // アクティビティボタンと統一する暗めのグレー
    },
  },

  // Text Colors
  text: {
    primary: 'rgba(255, 255, 255, 0.87)',
    secondary: '#213547',
    link: '#646cff',
    linkHover: '#535bf2',
    linkHoverLight: '#747bff',
  },

  // Border Colors
  border: {
    primary: '#646cff',
    gray: '#4a5568',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.15)',
    medium: 'rgba(0, 0, 0, 0.2)',
    blue: 'rgba(51, 154, 240, 0.4)',
  },

  // Grid Item Background Colors
  gridItem: {
    addRecord: GRID_ITEM_BACKGROUND_DARK, // 記録を追加ウィジェットの背景色
    newActivity: GRID_ITEM_BACKGROUND_DARK, // 新しいアクティビティウィジェットの背景色
    chart: GRID_ITEM_BACKGROUND_DARK, // グラフウィジェットの背景色
    textLog: GRID_ITEM_BACKGROUND_DARK, // テキストログウィジェットの背景色
    default: GRID_ITEM_BACKGROUND_DARK, // デフォルト背景色（将来の拡張用）
  },

  // Mantine Color Names (for Mantine components)
  mantine: {
    gray: 'gray',
    green: 'green',
    blue: 'blue',
    cyan: 'cyan',
    teal: 'teal',
    lime: 'lime',
  },

  // Cursor & Animation Effects
  cursor: {
    outer: 'rgba(34, 139, 230, 0.5)',    // カスタムカーソル外側の円
    inner: 'rgba(34, 139, 230, 0.8)',    // カスタムカーソル内側の点
  },

  // Parallax Effects
  parallax: {
    layer1: 'rgba(34, 139, 230, 0.15)',   // 背景レイヤー（最も遅い）
    layer2: 'rgba(51, 154, 240, 0.25)',   // 中間レイヤー
    layer3: 'rgba(28, 126, 214, 0.35)',   // 前景レイヤー（最も速い）
  },
} as const;

export type Colors = typeof colors;

/**
 * グラデーション定義
 */
export const gradients = {
  blueCyan: {
    from: 'blue',
    to: 'cyan',
    deg: 45,
  },
  tealLime: {
    from: 'teal',
    to: 'lime',
    deg: 45,
  },
} as const;

export type Gradients = typeof gradients;

/**
 * グリッドアイテムのシャドウ定義
 */
export const gridItemShadows = {
  addRecord: {
    default: `0 8px 16px ${colors.shadow.light}`,
    hover: `0 12px 24px ${colors.shadow.light}`,
  },
  newActivity: {
    default: `0 8px 16px ${colors.shadow.light}`,
    hover: `0 12px 24px ${colors.shadow.light}`,
  },
} as const;

export type GridItemShadows = typeof gridItemShadows;
