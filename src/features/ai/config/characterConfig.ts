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
 * 座標を広げて視覚的な広がりを演出
 * speed値を下げてマウス追従の動きを控えめに
 */
export const PARALLAX_LAYERS: ParallaxLayer[] = [
  { size: 120, color: colors.parallax.layer1, speed: 0.012, top: '12%', left: '8%' },
  { size: 100, color: colors.parallax.layer1, speed: 0.016, top: '31%', right: '15%' },
  { size: 90, color: colors.parallax.layer2, speed: 0.020, top: '21%', right: '3%' },
  { size: 75, color: colors.parallax.layer3, speed: 0.028, top: '54%', left: '19%' },
  { size: 65, color: colors.parallax.layer3, speed: 0.024, top: '57%', left: '68%' },
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
