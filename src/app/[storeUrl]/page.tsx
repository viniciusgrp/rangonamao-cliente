'use client';

import { useStoreQuery } from '@/services/queries/store';
import { StoreHeaderWithProps } from '@/components/StoreHeaderWithProps';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Container, Typography, Alert, Box } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { use } from 'react';

export default function StorePage({ params }: { params: Promise<{ storeUrl: string }> }) {
  const resolvedParams = use(params);
  const { isLoading, error, data: store } = useStoreQuery(resolvedParams.storeUrl);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize o placeholder para evitar recriações desnecessárias
  const placeholder = useMemo(() => (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Box sx={{ height: '200px', background: 'rgba(0,0,0,0.1)' }} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ height: '40px', width: '200px', background: 'rgba(0,0,0,0.1)', mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' }, height: '150px', background: 'rgba(255,255,255,0.5)' }} />
          ))}
        </Box>
      </Container>
    </Box>
  ), []);

  // During SSR and before hydration, render a placeholder
  if (!mounted) {
    return placeholder;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          {typeof error === 'string' ? error : 'Ocorreu um erro ao carregar a loja'}
        </Alert>
      </Container>
    );
  }

  if (!store) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Loja não encontrada
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      <StoreHeaderWithProps store={store} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Categorias
        </Typography>
        
        {store.categories.length === 0 ? (
          <Typography>Nenhuma categoria disponível</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {store.categories.map((category) => (
              <Box 
                key={category.id}
                sx={{ 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1,
                  width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {category.Product.length} produtos
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
