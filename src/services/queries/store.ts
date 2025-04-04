import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Store } from '@/types/store';
import { useAppDispatch } from '@/store/hooks';
import { setStore, setLoading, setError } from '@/store/slices/storeSlice';

export function useStoreQuery(storeUrl: string) {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ['store', storeUrl],
    queryFn: async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const { data } = await api.get<Store>(`/stores/url/${storeUrl}`);
        dispatch(setStore(data));
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar a loja';
        dispatch(setError(errorMessage));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    enabled: !!storeUrl,
  });
} 