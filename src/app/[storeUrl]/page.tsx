'use client';

import { useStoreQuery } from '@/services/queries/store';
import { StoreHeaderWithProps } from '@/components/StoreHeaderWithProps';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Container, Typography, Alert, Box, Grid, Card, CardMedia, CardContent, Divider } from '@mui/material';
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
      <Box sx={{ height: '150px', background: 'rgba(0,0,0,0.1)' }} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ height: '40px', width: '200px', background: 'rgba(0,0,0,0.1)', mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i}>
              <Box sx={{ height: '40px', width: '300px', background: 'rgba(0,0,0,0.1)', mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                {[1, 2, 3, 4].map((j) => (
                  <Box key={j} sx={{ minWidth: '200px', height: '200px', background: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
                ))}
              </Box>
            </Box>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
            {store.categories.map((category) => (
              <Box key={category.id}>
                <Typography variant="h5" gutterBottom>
                  {category.name}
                </Typography>
                {category.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                )}
                
                {category.Product.length > 0 ? (
                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                    {category.Product.map((product) => (
                      <Card elevation={2} key={product.id} sx={{ minWidth: 200, maxWidth: 300 }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                        />
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {product.description}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                            R$ {product.price.toFixed(2)}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum produto disponível nesta categoria
                  </Typography>
                )}
                
                <Divider sx={{ mt: 3 }} />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
