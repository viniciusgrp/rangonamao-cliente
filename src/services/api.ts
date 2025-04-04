import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const api = axios.create({
    baseURL: 'http://localhost:3022',
    timeout: 60000,
});

export { queryClient };
export default api;
