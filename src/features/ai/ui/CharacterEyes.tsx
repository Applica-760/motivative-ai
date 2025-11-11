import { Box } from '@mantine/core';
import { colors } from '@/shared/config';
import { EYE_CONFIG } from '../config';

interface CharacterEyesProps {
  /** 瞳の位置 */
  pupilPosition: { x: number; y: number };
  /** 目の要素に設定するref */
  eyesRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * AIキャラクターの目のコンポーネント
 * 
 * マウスの動きを追跡して瞳が動く2つの目を表示。
 */
export function CharacterEyes({ pupilPosition, eyesRef }: CharacterEyesProps) {
  const Eye = () => (
    <Box
      style={{
        position: 'relative',
        width: `${EYE_CONFIG.width}px`,
        height: `${EYE_CONFIG.height}px`,
        borderRadius: '50%',
        backgroundColor: colors.background.white,
        border: `3px solid ${colors.primary.main}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          width: `${EYE_CONFIG.pupilSize}px`,
          height: `${EYE_CONFIG.pupilSize}px`,
          borderRadius: '50%',
          backgroundColor: colors.primary.dark,
          position: 'relative',
          transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
          transition: 'transform 0.1s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          style={{
            width: `${EYE_CONFIG.pupilInnerSize}px`,
            height: `${EYE_CONFIG.pupilInnerSize}px`,
            borderRadius: '50%',
            backgroundColor: colors.background.black,
          }}
        />
      </Box>
    </Box>
  );

  return (
    <div ref={eyesRef} style={{ display: 'flex', gap: '0.5rem' }}>
      <Eye />
      <Eye />
    </div>
  );
}
