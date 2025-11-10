import { Center, Loader, Text } from '@mantine/core';
import { DraggableGrid } from '@/features/grid-layout';
import { useHomeData } from '../model';
import { createDashboardGridItems } from '../config/dashboardConfig';

interface MainContentProps {
  onChartClick?: (activityId: string) => void;
}

export function MainContent({ onChartClick }: MainContentProps) {
  const { data, isLoading, error } = useHomeData();

  if (isLoading) {
    return (
      <Center h="400px">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="400px">
        <Text c="red">データの取得に失敗しました: {error.message}</Text>
      </Center>
    );
  }

  if (!data) {
    return (
      <Center h="400px">
        <Text>データがありません</Text>
      </Center>
    );
  }

  const gridItems = createDashboardGridItems(data.activities, onChartClick);

  return <DraggableGrid items={gridItems} key={`grid-${data.activities.length}`} />;
}
