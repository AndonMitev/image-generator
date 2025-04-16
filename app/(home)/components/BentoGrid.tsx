'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { useImageGallery } from '@/hooks/use-infinity-query';
import React from 'react';

type GalleryItem = {
  id: number;
  image: string;
  title: string;
  description: string;
  size: string;
  likes: number;
  author: string;
  category: string;
};

const mapSizeToGridSize = (
  size: string
): 'small' | 'wide' | 'tall' | 'large' => {
  switch (size) {
    case 'medium':
      return 'wide';
    case 'large':
      return 'large';
    case 'wide':
      return 'wide';
    case 'tall':
      return 'tall';
    default:
      return 'small';
  }
};

const calculateLayout = (
  newItems: GalleryItem[],
  existingGrid: (number | null)[][],
  existingPositions: Record<
    number,
    { row: number; col: number; width: number; height: number }
  >,
  containerWidth: number,
  isMobile: boolean
) => {
  const minCellSize = 250;
  const maxCellSize = 350;
  const maxColumns = isMobile
    ? 2
    : Math.max(2, Math.floor(containerWidth / minCellSize));
  const cellSize = Math.min(maxCellSize, containerWidth / maxColumns);

  // Clone existing grid and positions
  let grid = existingGrid.length ? existingGrid.map((row) => [...row]) : [];
  let positions = { ...existingPositions };

  // Initialize column heights from existing items
  const columnHeights = Array(maxColumns).fill(0);
  Object.values(existingPositions).forEach((pos) => {
    const itemBottom = pos.row + pos.height;
    for (let c = pos.col; c < pos.col + pos.width; c++) {
      columnHeights[c] = Math.max(columnHeights[c], itemBottom);
    }
  });

  // Place new items in the shortest column span
  newItems.forEach((item) => {
    const gridSize = mapSizeToGridSize(item.size);
    let width = 1;
    let height = 1;
    if (gridSize === 'wide' || gridSize === 'large')
      width = isMobile ? 2 : Math.min(2, maxColumns);
    if (gridSize === 'tall' || gridSize === 'large') height = 2;
    if (width > maxColumns) width = maxColumns;

    let bestCol = 0;
    let bestRow = Infinity;

    // Find the best starting column with the smallest height
    for (let col = 0; col <= maxColumns - width; col++) {
      let maxRowInSpan = 0;
      for (let c = col; c < col + width; c++) {
        maxRowInSpan = Math.max(maxRowInSpan, columnHeights[c]);
      }
      if (maxRowInSpan < bestRow) {
        bestRow = maxRowInSpan;
        bestCol = col;
      }
    }

    // Place the item at the best position
    const row = bestRow;
    positions[item.id] = { row, col: bestCol, width, height };

    // Update grid
    for (let r = row; r < row + height; r++) {
      while (grid.length <= r) {
        grid.push(Array(maxColumns).fill(null));
      }
      for (let c = bestCol; c < bestCol + width; c++) {
        grid[r][c] = item.id;
      }
    }

    // Update column heights
    for (let c = bestCol; c < bestCol + width; c++) {
      columnHeights[c] = row + height;
    }
  });

  // Calculate total height and pixel positions
  const totalRows = Math.max(...columnHeights, grid.length);
  const pixelPositions = Object.entries(positions).map(([id, pos]) => ({
    id: Number.parseInt(id),
    left: pos.col * cellSize,
    top: pos.row * cellSize,
    width: pos.width * cellSize,
    height: pos.height * cellSize
  }));

  return {
    positions: pixelPositions,
    totalHeight: totalRows * cellSize,
    cellSize,
    columns: maxColumns,
    grid,
    positionsMap: positions
  };
};

export function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [layout, setLayout] = useState<{
    positions: any[];
    totalHeight: number;
    cellSize: number;
    columns: number;
    grid: (number | null)[][];
    positionsMap: Record<
      number,
      { row: number; col: number; width: number; height: number }
    >;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const scrollPositionRef = useRef(0);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useImageGallery();

  const { ref: bottomRef, inView } = useInView({
    rootMargin: '1000px 0px' // Pre-fetch when 1000px from bottom
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  useEffect(() => {
    const flat = data?.pages.flatMap((page) => page.images) ?? [];
    const mapped = flat.map((img: any, idx: number) => ({
      id: img.id ?? idx,
      image: img.webformatURL,
      title: img.tags,
      description: img.user,
      size: ['small', 'medium', 'tall', 'wide', 'large'][
        Math.floor(Math.random() * 5)
      ],
      likes: img.likes,
      author: img.user,
      category: img.type
    }));

    const newItems = mapped.filter(
      (newItem) => !items.some((existing) => existing.id === newItem.id)
    );

    setItems(mapped);

    if (newItems.length > 0 && containerWidth > 0) {
      try {
        const existingGrid = layout?.grid ?? [];
        const existingPositions = layout?.positionsMap ?? {};
        const newLayout = calculateLayout(
          newItems,
          existingGrid,
          existingPositions,
          containerWidth,
          isMobile
        );
        setLayout(newLayout);
      } catch (e) {
        console.error('Layout error:', e);
      }
    }
  }, [data, containerWidth, isMobile]);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [items]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width || window.innerWidth || 1000);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const cachedVisibleItemsRef = useRef<any[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateVisibleItems = useCallback(() => {
    if (!containerRef.current || !layout) return;

    const scrollTop = containerRef.current.scrollTop;
    scrollPositionRef.current = scrollTop;
    const viewportTop = scrollTop - 1000;
    const viewportBottom = scrollTop + containerRef.current.clientHeight + 1000;

    const newVisibleItems = layout.positions.filter((item) => {
      const itemBottom = item.top + item.height;
      const itemTop = item.top;
      return itemBottom >= viewportTop && itemTop <= viewportBottom;
    });

    if (
      newVisibleItems.length !== cachedVisibleItemsRef.current.length ||
      newVisibleItems.some(
        (item, index) => item !== cachedVisibleItemsRef.current[index]
      )
    ) {
      cachedVisibleItemsRef.current = newVisibleItems;
      setVisibleItems(newVisibleItems);
    }
  }, [layout, containerRef]);

  const handleScroll = useCallback(() => {
    if (!scrollTimeoutRef.current) {
      scrollTimeoutRef.current = setTimeout(() => {
        window.requestAnimationFrame(updateVisibleItems);
        scrollTimeoutRef.current = null;
      }, 16);
    }
  }, [updateVisibleItems]);

  useEffect(() => {
    updateVisibleItems();
  }, [updateVisibleItems]);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener('scroll', handleScroll);
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className='relative'>
      <div className='absolute right-4 top-4 z-10 rounded-lg bg-black/70 p-2 text-xs text-white backdrop-blur-sm shadow-md'>
        <div>Total Items: {items.length}</div>
        <div>Visible Items: {visibleItems.length}</div>
        <div>Columns: {layout?.columns || 0}</div>
      </div>

      <div
        ref={containerRef}
        className='mx-auto h-[100dvh] w-full max-w-7xl overflow-auto rounded-xl border border-white/10 bg-black/50'
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.2) transparent'
        }}
      >
        <div
          className='relative w-full'
          style={{ height: `${layout?.totalHeight || 0}px` }}
        >
          {visibleItems.map((pos) => {
            const item = items.find((i) => i.id === pos.id);
            if (!item) return null;
            return <GalleryItem key={item.id} pos={pos} item={item} />;
          })}

          {hasNextPage && (
            <div
              ref={bottomRef}
              className='absolute bottom-0 left-0 h-20 w-full'
            />
          )}
        </div>
        {isFetchingNextPage && (
          <div className='flex justify-center py-4 text-white'>
            <Loader2 className='h-6 w-6 animate-spin' />
          </div>
        )}
      </div>
    </div>
  );
}

const GalleryItem = React.memo(({ pos, item }: { pos: any; item: any }) => (
  <div
    className={cn(
      'absolute overflow-hidden rounded-xl border border-white/10 bg-gray-900/50 transition-all duration-300 hover:shadow-xl hover:border-white/30 hover:scale-[1.02]'
    )}
    style={{
      left: `${pos.left}px`,
      top: `${pos.top}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}
  >
    <div className='relative h-full w-full'>
      <Image
        src={item.image || '/placeholder.svg'}
        alt={item.title}
        fill
        sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
        className='object-cover transition-transform duration-500'
        quality={85}
        placeholder='blur'
        blurDataURL='data:image/jpeg;base64,/9j/2wBDAA...'
      />
      <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 hover:opacity-100'>
        <div className='flex items-start justify-between'>
          <div>
            <h3 className='line-clamp-1 text-lg font-semibold text-white md:text-xl'>
              {item.title}
            </h3>
            <p className='mt-1 line-clamp-2 text-sm text-white/80'>
              {item.description}
            </p>
          </div>
          <div className='flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-sm text-white backdrop-blur-sm'>
            <Heart className='h-4 w-4 text-red-500' fill='#ef4444' />
            <span>{item.likes.toLocaleString()}</span>
          </div>
        </div>
        <div className='mt-2 flex items-center justify-between'>
          <span className='rounded-full bg-black/30 px-2 py-1 text-sm text-white/90 backdrop-blur-sm'>
            {item.category}
          </span>
          <span className='text-sm text-white/70'>by {item.author}</span>
        </div>
      </div>
    </div>
  </div>
));
