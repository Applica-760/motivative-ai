import { Box } from '@mantine/core';
import { useState } from 'react';
import { PARALLAX_LAYERS } from '../config';

interface ParallaxBackgroundProps {
  /** パララックスオフセットを計算する関数 */
  getParallaxOffset: (speed: number) => { x: number; y: number };
  /** 円クリック時のコールバック（オプション） */
  onCircleClick?: () => void;
}

/**
 * AIキャラクター周囲のパララックス背景
 * 
 * マウスの動きに応じて異なる速度で動く複数の円を表示。
 * 視差効果により奥行き感を演出。
 * ホバー時には円が浮かび上がるアニメーション効果を追加。
 * 円をクリックするとイベントが発火（励ましメッセージ追加など）。
 */
export function ParallaxBackground({ getParallaxOffset, onCircleClick }: ParallaxBackgroundProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {PARALLAX_LAYERS.map((layer, index) => {
        const offset = getParallaxOffset(layer.speed);
        const isHovered = hoveredIndex === index;
        
        const style: React.CSSProperties = {
          position: 'absolute',
          width: `${layer.size}px`,
          height: `${layer.size}px`,
          backgroundColor: layer.color,
          borderRadius: '50%',
          transform: `translate(${offset.x}px, ${offset.y}px) ${isHovered ? 'scale(1.15)' : 'scale(1)'}`,
          transition: 'transform 0.01s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease',
          pointerEvents: 'auto',
          cursor: 'pointer',
          zIndex: isHovered ? 10 : 1,
          opacity: isHovered ? 1 : 0.8,
        };

        // 位置の設定
        if (layer.top) style.top = layer.top;
        if (layer.left) style.left = layer.left;
        if (layer.right) style.right = layer.right;

        return (
          <Box 
            key={index} 
            style={style}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={onCircleClick}
          />
        );
      })}
    </>
  );
}
