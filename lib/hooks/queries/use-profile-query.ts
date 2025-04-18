import { getProfile } from '@/lib/actions/profile';
import { useQuery } from '@tanstack/react-query';

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });
};
