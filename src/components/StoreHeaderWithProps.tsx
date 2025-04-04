'use client';

import Image from 'next/image';
import { Box, Container, Typography, useTheme, useMediaQuery, IconButton, Badge } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useState, useMemo } from 'react';
import { Store } from '@/types/store';
import { useAppSelector } from '@/store/hooks';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface StoreHeaderProps {
  store: Store;
  onCartClick?: () => void;
}

export function StoreHeaderWithProps({ store, onCartClick }: StoreHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);
  
  // Get cart from Redux
  const cart = useAppSelector(state => state.store.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Prevent hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    // Usar um pequeno atraso para garantir que o componente esteja completamente montado
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const { name, description, logo, color, background } = store;
  
  // Create a semi-transparent version of the color (20% opacity)
  const transparentColor = color ? alpha(color, 0.2) : 'rgba(0, 0, 0, 0.2)';

  // Memoize o placeholder para evitar recriações desnecessárias
  const placeholder = useMemo(() => (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '200px' : '150px', // Reduzido para 50% no desktop
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: transparentColor,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ width: isMobile ? '100px' : '100px', height: isMobile ? '100px' : '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
      </Container>
    </Box>
  ), [isMobile, transparentColor]);

  // During SSR and before hydration, render a placeholder with the same structure
  if (!mounted) {
    return placeholder;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '200px' : '150px', // Reduzido para 50% no desktop
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: background 
            ? `url(${background}) center/cover no-repeat` 
            : transparentColor,
          zIndex: 0,
        },
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: 2,
          py: 2, // Reduzido o padding vertical
        }}
      >
        <Box
          sx={{
            width: isMobile ? '100px' : '100px', // Reduzido o tamanho no desktop
            height: isMobile ? '100px' : '100px', // Reduzido o tamanho no desktop
            borderRadius: '50%',
            overflow: 'hidden',
            border: `4px solid ${color || theme.palette.primary.main}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            flexShrink: 0,
          }}
        >
          <Image
            src={logo}
            alt={name}
            width={isMobile ? 100 : 100} // Reduzido o tamanho no desktop
            height={isMobile ? 100 : 100} // Reduzido o tamanho no desktop
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Box>
        
        <Box sx={{ textAlign: isMobile ? 'center' : 'left', flexGrow: 1 }}>
          <Typography 
            variant={isMobile ? 'h4' : 'h4'} // Reduzido o tamanho da fonte no desktop
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 0.5, // Reduzido o margin bottom
            }}
          >
            {name}
          </Typography>
          
          {description && (
            <Typography 
              variant={isMobile ? 'body1' : 'body2'} // Reduzido o tamanho da fonte no desktop
              sx={{ 
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                maxWidth: '600px',
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
        
        {/* Carrinho no desktop */}
        {!isMobile && (
          <Box sx={{ ml: 'auto' }}>
            <Badge badgeContent={totalItems} color="primary">
              <IconButton 
                color="primary" 
                aria-label="carrinho" 
                onClick={onCartClick}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Badge>
          </Box>
        )}
      </Container>
    </Box>
  );
} 