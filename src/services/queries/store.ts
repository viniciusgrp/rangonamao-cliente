import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Store } from '@/types/store';

export function useStoreQuery(storeUrl: string) {
  return useQuery({
    queryKey: ['store', storeUrl],
    queryFn: async () => {
      try {
        const { data } = await api.get<Store>(`/stores/url/${storeUrl}`);
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar a loja';
        throw error;
      }
    },
    enabled: !!storeUrl,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });
} 