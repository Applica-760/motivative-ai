import { useEffect, useState, useRef } from 'react';
import { colors } from '@/shared/config';

/**
 * CustomCursor
 * Feature-Sliced Design: shared/ui
 * 
 * アプリケーション全体で使用されるカスタムカーソル。
 * マウス位置を滑らかに追従し、外側の円と内側の点で構成される。
 * 
 * 使用方法:
 * - App.tsxなどのルートコンポーネントに配置
 * - 自動的にデフォルトカーソルを非表示にする
 * 
 * 最適化:
 * - requestAnimationFrame を使用して滑らかなアニメーション
 * - 線形補間（lerp）で遅延追従効果
 */
export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [outerPos, setOuterPos] = useState({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | undefined>(undefined);

  useEffect(() => {
    // カーソルスタイルをグローバルに設定
    document.body.style.cursor = 'none';
    
    // マウス位置を追跡
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // アニメーションループ（滑らかな追従）
    const animate = () => {
      // 内側の点は即座に追従
      setCursorPos(mousePos.current);

      // 外側の円は遅延して追従（線形補間）
      setOuterPos((prev) => ({
        x: prev.x + (mousePos.current.x - prev.x) * 0.15,
        y: prev.y + (mousePos.current.y - prev.y) * 0.15,
      }));

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* 外側の円（遅延追従） */}
      <div
        style={{
          position: 'fixed',
          top: outerPos.y - 20,
          left: outerPos.x - 20,
          width: 40,
          height: 40,
          border: `2px solid ${colors.cursor.outer}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
      {/* 内側の点（即座に追従） */}
      <div
        style={{
          position: 'fixed',
          top: cursorPos.y - 4,
          left: cursorPos.x - 4,
          width: 8,
          height: 8,
          backgroundColor: colors.cursor.inner,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
    </>
  );
}
