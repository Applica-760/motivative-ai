import { DraggableGrid } from '@/features/grid-layout';
import type { GridItemConfig } from '@/features/grid-layout';

/**
 * MainContentのProps
 */
interface MainContentProps {
  /** 表示するグリッドアイテム */
  gridItems: GridItemConfig[];
}

/**
 * MainContent
 * Feature-Sliced Design: features/home/ui
 * 
 * ダッシュボードのメインコンテンツ表示を担当。
 * データ取得とFeature統合はapp層のCompositionが担当し、
 * このコンポーネントは純粋なUI表示のみを行う。
 * 
 * @example
 * ```tsx
 * <MainContent gridItems={gridItems} />
 * ```
 */
export function MainContent({ gridItems }: MainContentProps) {
  return <DraggableGrid items={gridItems} key={`grid-${gridItems.length}`} />;
}
