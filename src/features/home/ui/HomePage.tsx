import { AppShell, Burger, Container, Title, Box } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { DashboardComposition } from '@/app/compositions';
import { LeftSidebar } from './LeftSidebar';
import { MainContent } from './MainContent';
import { RightSidebar } from './RightSidebar';
import { MobileSidebar } from './MobileSidebar';
import { AddRecordModal } from '@/features/activity/ui/modals';

/**
 * HomePage
 * Feature-Sliced Design: features/home/ui
 * 
 * ダッシュボード画面のレイアウトを担当。
 * 
 * 責務:
 * - 3カラムレイアウトの構築
 * - モバイル対応（サイドバーの折りたたみ）
 * - モーダルの表示管理
 * 
 * データ取得と統合はapp/compositionsが担当。
 */
export function HomePage() {
  const [leftOpened, { toggle: toggleLeft }] = useDisclosure();
  const [rightOpened, { toggle: toggleRight }] = useDisclosure();
  const [addRecordOpened, { open: openAddRecord, close: closeAddRecord }] = useDisclosure();
  const [preselectedActivityId, setPreselectedActivityId] = useState<string | undefined>(undefined);
  
  // タブレット以下（1200px未満）でサイドバーを折りたたみ可能に
  const isMobile = useMediaQuery('(max-width: 1200px)');

  // グラフクリック時のハンドラー
  const handleChartClick = (activityId: string) => {
    setPreselectedActivityId(activityId);
    openAddRecord();
  };

  // モーダルを閉じる際に事前選択をクリア
  const handleCloseAddRecord = () => {
    closeAddRecord();
    setPreselectedActivityId(undefined);
  };

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Container size="xl" h="100%" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
          {isMobile && (
            <Burger
              opened={leftOpened}
              onClick={toggleLeft}
              size="sm"
              aria-label="左サイドバーを切り替え"
            />
          )}
          <Title order={1} style={{ flex: 1, textAlign: 'left' }}>
            Motivative AI
          </Title>
          {isMobile && (
            <Burger
              opened={rightOpened}
              onClick={toggleRight}
              size="sm"
              aria-label="右サイドバーを切り替え"
            />
          )}
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="2100px" px="md">
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : 'minmax(280px, 350px) minmax(600px, 1400px) minmax(280px, 350px)',
            gap: '1rem',
            justifyContent: 'center',
          }}>
            {!isMobile && (
              <Box style={{ border: 'none', height: 'calc(100vh - 60px - 2rem)' }}>
                <LeftSidebar />
              </Box>
            )}
            
            <Box>
              <DashboardComposition onChartClick={handleChartClick}>
                {(gridItems) => <MainContent gridItems={gridItems} />}
              </DashboardComposition>
            </Box>
            
            {!isMobile && (
              <Box style={{ border: 'none', height: 'calc(100vh - 60px - 2rem)' }}>
                <RightSidebar />
              </Box>
            )}
          </div>
        </Container>

        {/* モバイル用のサイドバー */}
        {isMobile && (
          <>
            <MobileSidebar isOpen={leftOpened} onClose={toggleLeft} side="left">
              <LeftSidebar />
            </MobileSidebar>
            
            <MobileSidebar isOpen={rightOpened} onClose={toggleRight} side="right">
              <RightSidebar />
            </MobileSidebar>
          </>
        )}
      </AppShell.Main>

      {/* グラフクリックからの記録追加モーダル */}
      <AddRecordModal
        opened={addRecordOpened}
        onClose={handleCloseAddRecord}
        preselectedActivityId={preselectedActivityId}
      />
    </AppShell>
  );
}
