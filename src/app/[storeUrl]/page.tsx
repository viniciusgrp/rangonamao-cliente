'use client';

import { Header } from './components/Header';
import { useStoreQuery } from '@/services/queries/store';
import { useParams } from 'next/navigation';
import { CircularProgress } from '@mui/material';
export default function StorePage() {
  const { storeUrl } = useParams();

  const { data: store, isLoading } = useStoreQuery(storeUrl as string);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <CircularProgress />
      </div>
    );
  }

  if (!store) {
    return <div>Loja não encontrada</div>;
  }

  return (
    <div>
      <Header />
      StorePage
    </div>
  );
}
