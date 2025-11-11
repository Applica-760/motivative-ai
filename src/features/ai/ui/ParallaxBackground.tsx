import { Box } from '@mantine/core';
import { PARALLAX_LAYERS } from '../config';

interface ParallaxBackgroundProps {
  /** パララックスオフセットを計算する関数 */
  getParallaxOffset: (speed: number) => { x: number; y: number };
}

/**
 * AIキャラクター周囲のパララックス背景
 * 
 * マウスの動きに応じて異なる速度で動く複数の円を表示。
 * 視差効果により奥行き感を演出。
 */
export function ParallaxBackground({ getParallaxOffset }: ParallaxBackgroundProps) {
  return (
    <>
      {PARALLAX_LAYERS.map((layer, index) => {
        const offset = getParallaxOffset(layer.speed);
        const style: React.CSSProperties = {
          position: 'absolute',
          width: `${layer.size}px`,
          height: `${layer.size}px`,
          backgroundColor: layer.color,
          borderRadius: '50%',
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: 'transform 0.2s ease-out',
          pointerEvents: 'none',
          zIndex: 0,
        };

        // 位置の設定
        if (layer.top) style.top = layer.top;
        if (layer.left) style.left = layer.left;
        if (layer.right) style.right = layer.right;

        return <Box key={index} style={style} />;
      })}
    </>
  );
}
