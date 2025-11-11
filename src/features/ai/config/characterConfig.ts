import { colors } from '@/shared/config';

/**
 * パララックスレイヤーの型定義
 */
export interface ParallaxLayer {
  size: number;
  color: string;
  speed: number;
  top?: string;
  left?: string;
  right?: string;
}

/**
 * AIキャラクターのパララックスレイヤー設定
 * 吹き出しは中央下部（marginTop: 120px付近）に配置されるため、
 * パララックス円は上部と左右端に配置して重ならないようにする
 */
export const PARALLAX_LAYERS: ParallaxLayer[] = [
  { size: 120, color: colors.parallax.layer1, speed: 0.015, top: '5%', left: '15%' },
  { size: 100, color: colors.parallax.layer1, speed: 0.020, top: '25%', right: '25%' },
  { size: 90, color: colors.parallax.layer2, speed: 0.025, top: '15%', right: '8%' },
  { size: 75, color: colors.parallax.layer3, speed: 0.035, top: '40%', left: '22%' },
  { size: 65, color: colors.parallax.layer3, speed: 0.030, top: '43%', left: '60%' },
];

/**
 * 目のサイズ設定
 */
export const EYE_CONFIG = {
  width: 50,
  height: 70,
  pupilSize: 22,
  pupilInnerSize: 10,
  maxDistance: 12,
  distanceDivisor: 10,
} as const;
