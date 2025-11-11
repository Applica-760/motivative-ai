import { useRef, useEffect, useState } from 'react';
import { EYE_CONFIG } from '../config';

/**
 * マウス位置に応じて目の瞳が追従するカスタムフック
 * 
 * @returns 瞳の位置 { x, y } と目の要素に設定するref
 */
export function useEyeTracking() {
  const eyesRef = useRef<HTMLDivElement>(null);
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyesRef.current) return;

      const eyesRect = eyesRef.current.getBoundingClientRect();
      const eyesCenterX = eyesRect.left + eyesRect.width / 2;
      const eyesCenterY = eyesRect.top + eyesRect.height / 2;

      const angle = Math.atan2(e.clientY - eyesCenterY, e.clientX - eyesCenterX);
      const distance = Math.min(
        EYE_CONFIG.maxDistance,
        Math.hypot(e.clientX - eyesCenterX, e.clientY - eyesCenterY) / EYE_CONFIG.distanceDivisor
      );

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      setPupilPosition({ x: pupilX, y: pupilY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { eyesRef, pupilPosition };
}
