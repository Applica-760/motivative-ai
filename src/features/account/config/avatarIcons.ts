import {
  IconUser,
  IconHeart,
  IconStar,
  IconRocket,
  IconMoodSmile,
  IconFlame,
  IconBrain,
  IconTarget,
  IconTrophy,
  IconSparkles,
  IconBolt,
  IconCrown,
  type Icon,
} from '@tabler/icons-react';

/**
 * アバターアイコンの定義
 */
export interface AvatarIconDefinition {
  /** アイコン名（識別子） */
  name: string;
  /** アイコンコンポーネント */
  icon: Icon;
  /** 表示用ラベル */
  label: string;
}

/**
 * 利用可能なアバターアイコンのリスト
 */
export const AVATAR_ICONS: AvatarIconDefinition[] = [
  { name: 'IconUser', icon: IconUser, label: 'ユーザー' },
  { name: 'IconHeart', icon: IconHeart, label: 'ハート' },
  { name: 'IconStar', icon: IconStar, label: '星' },
  { name: 'IconRocket', icon: IconRocket, label: 'ロケット' },
  { name: 'IconMoodSmile', icon: IconMoodSmile, label: 'スマイル' },
  { name: 'IconFlame', icon: IconFlame, label: '炎' },
  { name: 'IconBrain', icon: IconBrain, label: '脳' },
  { name: 'IconTarget', icon: IconTarget, label: 'ターゲット' },
  { name: 'IconTrophy', icon: IconTrophy, label: 'トロフィー' },
  { name: 'IconSparkles', icon: IconSparkles, label: 'キラキラ' },
  { name: 'IconBolt', icon: IconBolt, label: '稲妻' },
  { name: 'IconCrown', icon: IconCrown, label: '王冠' },
];

/**
 * デフォルトのアイコン色
 */
export const DEFAULT_COLORS = [
  '#228be6', // blue
  '#fa5252', // red
  '#40c057', // green
  '#fd7e14', // orange
  '#be4bdb', // violet
  '#fab005', // yellow
  '#15aabf', // cyan
  '#f06595', // pink
];

/**
 * アイコン名からアイコンコンポーネントを取得
 */
export function getAvatarIcon(iconName: string): Icon {
  const iconDef = AVATAR_ICONS.find(icon => icon.name === iconName);
  return iconDef?.icon || IconUser;
}
