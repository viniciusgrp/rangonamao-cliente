'use client';

import { useAppSelector } from '@/store/hooks';
import Image from 'next/image';
import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useState, useMemo } from 'react';

export function StoreHeader() {
  const { store } = useAppSelector((state) => state.store);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!store) return null;

  const { name, description, logo, color, background } = store;
  
  // Create a semi-transparent version of the color (20% opacity)
  const transparentColor = color ? alpha(color, 0.2) : 'rgba(0, 0, 0, 0.2)';

  // Memoize o placeholder para evitar recriações desnecessárias
  const placeholder = useMemo(() => (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '200px' : '300px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: transparentColor,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ width: isMobile ? '100px' : '150px', height: isMobile ? '100px' : '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
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
        height: isMobile ? '200px' : '300px',
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
          py: 4,
        }}
      >
        <Box
          sx={{
            width: isMobile ? '100px' : '150px',
            height: isMobile ? '100px' : '150px',
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
            width={isMobile ? 100 : 150}
            height={isMobile ? 100 : 150}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Box>
        
        <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
          <Typography 
            variant={isMobile ? 'h4' : 'h2'} 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 1,
            }}
          >
            {name}
          </Typography>
          
          {description && (
            <Typography 
              variant={isMobile ? 'body1' : 'h6'} 
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
      </Container>
    </Box>
  );
} 