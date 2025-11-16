import { useEffect, useState, type RefObject } from 'react';

/**
 * コンテナのサイズ情報
 */
export interface ContainerSize {
  /** コンテナの幅（px） */
  width: number;
  /** コンテナの高さ（px） */
  height: number;
  /** サイズカテゴリ（xs, sm, md, lg, xl） */
  category: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** アスペクト比 */
  aspectRatio: number;
}

/**
 * サイズカテゴリを判定
 */
function getSizeCategory(width: number): ContainerSize['category'] {
  if (width <= 200) return 'xs';
  if (width <= 300) return 'sm';
  if (width <= 400) return 'md';
  if (width <= 600) return 'lg';
  return 'xl';
}

/**
 * ResizeObserverを使用してコンテナのサイズを監視するカスタムフック
 * 
 * @param ref - 監視する要素への参照
 * @param debounceMs - デバウンス時間（ミリ秒）、デフォルトは50ms
 * @returns コンテナのサイズ情報
 * 
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const size = useContainerSize(ref);
 * 
 * return (
 *   <div ref={ref}>
 *     <p>Width: {size.width}px</p>
 *     <p>Category: {size.category}</p>
 *   </div>
 * );
 * ```
 */
export function useContainerSize(
  ref: RefObject<HTMLElement | null>,
  debounceMs = 50
): ContainerSize {
  const [size, setSize] = useState<ContainerSize>({
    width: 0,
    height: 0,
    category: 'md',
    aspectRatio: 1,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resizeObserver = new ResizeObserver((entries) => {
      // デバウンス処理
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          
          setSize({
            width,
            height,
            category: getSizeCategory(width),
            aspectRatio: height > 0 ? width / height : 1,
          });
        }
      }, debounceMs);
    });

    resizeObserver.observe(element);

    // 初期サイズを設定
    const { width, height } = element.getBoundingClientRect();
    setSize({
      width,
      height,
      category: getSizeCategory(width),
      aspectRatio: height > 0 ? width / height : 1,
    });

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [ref, debounceMs]);

  return size;
}
