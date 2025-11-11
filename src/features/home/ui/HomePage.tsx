import { AppShell, Burger, Container, Title, Box } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { DashboardComposition } from '@/app/compositions';
import { LeftSidebar } from './LeftSidebar';
import { MainContent } from './MainContent';
import { RightSidebar } from './RightSidebar';
import { MobileSidebar } from './MobileSidebar';
import { AddRecordModal } from '@/features/activity-record/ui/modals';

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
  
  // 完全なモバイル表示（1200px未満）
  const isMobile = useMediaQuery('(max-width: 1200px)');
  // サイドバーを折りたたむ（1600px未満）
  const shouldCollapseSidebar = useMediaQuery('(max-width: 1600px)');

  // グラフ・カレンダークリック時のハンドラー（どちらも記録追加モーダルを開く）
  const handleActivityClick = (activityId: string) => {
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
          {(isMobile || shouldCollapseSidebar) && (
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
          {(isMobile || shouldCollapseSidebar) && (
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
              : shouldCollapseSidebar
                ? '1fr'
                : 'minmax(200px, 280px) minmax(500px, 1fr) minmax(200px, 280px)',
            gap: '1rem',
            justifyContent: 'center',
          }}>
            {!isMobile && !shouldCollapseSidebar && (
              <Box style={{ border: 'none', height: 'calc(100vh - 60px - 2rem)' }}>
                <LeftSidebar />
              </Box>
            )}
            
            <Box>
              <DashboardComposition 
                onChartClick={handleActivityClick}
                onCalendarClick={handleActivityClick}
              >
                {(gridItems) => <MainContent gridItems={gridItems} />}
              </DashboardComposition>
            </Box>
            
            {!isMobile && !shouldCollapseSidebar && (
              <Box style={{ border: 'none', height: 'calc(100vh - 60px - 2rem)' }}>
                <RightSidebar />
              </Box>
            )}
          </div>
        </Container>

        {/* タブレット用: サイドバーが折りたたまれている場合にバーガーメニューを表示 */}
        {shouldCollapseSidebar && !isMobile && (
          <>
            <MobileSidebar isOpen={leftOpened} onClose={toggleLeft} side="left">
              <LeftSidebar />
            </MobileSidebar>
            
            <MobileSidebar isOpen={rightOpened} onClose={toggleRight} side="right">
              <RightSidebar />
            </MobileSidebar>
          </>
        )}

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
