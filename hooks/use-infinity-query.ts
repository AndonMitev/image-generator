import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_KEY = '49760649-6e3a0edeebebc36500ef787e3';
const ITEMS_PER_PAGE = 50;

const fetchImages = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `https://pixabay.com/api/?key=${API_KEY}&q=landscape&image_type=photo&page=${pageParam}&per_page=${ITEMS_PER_PAGE}` // Increased to 50
  );
  return {
    images: res.data.hits,
    nextPage: pageParam + 1,
    hasMore: res.data.hits.length === ITEMS_PER_PAGE // Check if full page was returned
  };
};

export const useImageGallery = () =>
  useInfiniteQuery({
    queryKey: ['images'],
    queryFn: fetchImages,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000
  });
