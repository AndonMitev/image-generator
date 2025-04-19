import { useQuery } from '@tanstack/react-query';
import { getRecentPrompts } from '@/lib/actions/prompt';

export const useRecentPromptsQuery = ({ limit }: { limit?: number } = {}) => {
  return useQuery({
    queryKey: ['prompts', 'recent', limit],
    queryFn: () => getRecentPrompts({ limit })
  });
};
