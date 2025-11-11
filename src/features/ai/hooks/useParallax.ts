import { useRef } from 'react';
import { useMouse } from '@mantine/hooks';

interface ParallaxOffset {
  x: number;
  y: number;
}

/**
 * マウス位置に応じたパララックス効果を計算するカスタムフック
 * 
 * @returns コンテナのrefと、速度に応じたオフセットを計算する関数
 */
export function useParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x: mouseX, y: mouseY } = useMouse();

  /**
   * 指定された速度でパララックスオフセットを計算
   * @param speed - パララックスの速度係数（大きいほど速く動く）
   */
  const getParallaxOffset = (speed: number): ParallaxOffset => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (mouseX - centerX) * speed;
    const offsetY = (mouseY - centerY) * speed;

    return { x: offsetX, y: offsetY };
  };

  return { containerRef, getParallaxOffset };
}
