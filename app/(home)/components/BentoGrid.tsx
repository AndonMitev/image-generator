'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility
import { galleryItems } from '@/lib/constants/mock-data'; // Use our items

// Interface from mock-data
interface BentoGridItemProps {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  likes: number;
  className?: string; // Add className for grid spans
}

interface BentoGridProps {
  items?: BentoGridItemProps[]; // Optional items, default to galleryItems
}

// Reusable classes for badge styling
const badgeClass =
  'text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm';

function BentoGridItem({
  item,
  className
}: {
  item: BentoGridItemProps;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded group transition-all duration-300',
        className
      )}
    >
      {/* Image Container */}
      <div className='relative w-full h-full'>
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.title}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
      </div>

      {/* Info Panel - slide up on hover */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 p-3',
          'bg-black/50 backdrop-blur-sm',
          'translate-y-full group-hover:translate-y-0',
          'transition-transform duration-300 ease-out'
        )}
      >
        {/* Category and Likes row */}
        <div className='flex justify-between items-center mb-1.5'>
          <span className={badgeClass}>{item.category}</span>
          <div className={cn(badgeClass, 'flex items-center gap-1')}>
            <Heart className='w-2.5 h-2.5' />
            <span>{item.likes}</span>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className='text-sm font-semibold text-white mb-0.5 line-clamp-1'>
          {item.title}
        </h3>
        <p className='text-xs text-white/80 line-clamp-2'>{item.description}</p>
      </div>
    </div>
  );
}

export function BentoGrid({ items = galleryItems }: BentoGridProps) {
  // Simplified span patterns
  const spanPattern = [
    'row-span-2', // Medium
    'row-span-1', // Small
    'row-span-1', // Small
    'row-span-3', // Large
    'row-span-1', // Small
    'row-span-2', // Medium
    'row-span-1', // Small
    'row-span-1', // Small
    'row-span-2', // Medium
    'row-span-1', // Small
    'row-span-1', // Small
    'row-span-2', // Medium
    'row-span-1', // Small
    'row-span-3', // Large
    'row-span-1', // Small
    'row-span-1', // Small
    'row-span-2', // Medium
    'row-span-1' // Small
  ];

  // Assign classNames based on the pattern
  const itemsWithSpan = useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      className: spanPattern[index % spanPattern.length] || 'row-span-1'
    }));
  }, [items]);

  return (
    <div className='w-full mx-auto px-1 md:px-2 max-w-screen-2xl'>
      {/* Responsive grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-1.5 auto-rows-[10rem] md:auto-rows-[12rem]'>
        {itemsWithSpan.map((item) => (
          <BentoGridItem key={item.id} item={item} className={item.className} />
        ))}
      </div>
    </div>
  );
}
