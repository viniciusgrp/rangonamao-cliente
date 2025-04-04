'use client';

import { useStoreQuery } from '@/services/queries/store';
import { StoreHeaderWithProps } from '@/components/StoreHeaderWithProps';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Container, Typography, Alert, Box, Grid, Card, CardMedia, CardContent, Divider, IconButton, Badge, Button, useTheme, useMediaQuery } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import { use } from 'react';
import { ProductModal } from '@/components/ProductModal';
import { Product } from '@/types/store';
import { useAppSelector } from '@/store/hooks';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function StorePage({ params }: { params: Promise<{ storeUrl: string }> }) {
  const resolvedParams = use(params);
  const { isLoading, error, data: store } = useStoreQuery(resolvedParams.storeUrl);
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get cart from Redux
  const cart = useAppSelector(state => state.store.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Prevent hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCartClick = () => {
    // Aqui você pode adicionar a lógica para abrir o carrinho
    console.log('Carrinho clicado');
  };

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
    <Box sx={{ pb: isMobile ? 8 : 0 }}>
      <StoreHeaderWithProps store={store} onCartClick={handleCartClick} />
      
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
                      <Card 
                        key={product.id} 
                        sx={{ 
                          minWidth: 200, 
                          maxWidth: 200,
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                          }
                        }}
                        onClick={() => handleProductClick(product)}
                      >
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
      
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          open={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
      
      {/* Botão de carrinho fixo no mobile */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 1000,
            p: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={handleCartClick}
            sx={{
              py: 1.5,
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="subtitle1" component="span">
                Carrinho
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                ({totalItems} itens)
              </Typography>
            </Box>
            <Typography variant="subtitle1" component="span">
              R$ {cart.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}
            </Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
}
