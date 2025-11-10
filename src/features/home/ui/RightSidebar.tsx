import { Paper, Stack, Text, Box, Center, Group } from '@mantine/core';
import { useRef, useEffect, useState } from 'react';
import { colors } from '@/shared/config';

export function RightSidebar() {
  const eyesRef = useRef<HTMLDivElement>(null);
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyesRef.current) return;

      const eyesRect = eyesRef.current.getBoundingClientRect();
      const eyesCenterX = eyesRect.left + eyesRect.width / 2;
      const eyesCenterY = eyesRect.top + eyesRect.height / 2;

      const angle = Math.atan2(e.clientY - eyesCenterY, e.clientX - eyesCenterX);
      const distance = Math.min(12, Math.hypot(e.clientX - eyesCenterX, e.clientY - eyesCenterY) / 10);

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      setPupilPosition({ x: pupilX, y: pupilY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const Eye = () => (
    <Box
      style={{
        position: 'relative',
        width: '50px',
        height: '70px',
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
          width: '22px',
          height: '22px',
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
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: colors.background.black,
          }}
        />
      </Box>
    </Box>
  );

  return (
    <aside>
      <Paper p="md">
        <Stack gap="xl" align="center">
          {/* マウス追跡する目のアニメーション */}
          <Center ref={eyesRef}>
            <Group gap="sm">
              <Eye />
              <Eye />
            </Group>
          </Center>

          {/* 吹き出し */}
          <Paper
            shadow="md"
            p="md"
            radius="lg"
            withBorder
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '250px',
              marginTop: '20px',
            }}
          >
            <Stack gap={0}>
              <Text size="lg" fw={600} ta="center">
                ゲストユーザさん
              </Text>
              <Text size="lg" fw={600} ta="center">
                こんにちは！
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </aside>
  );
}
