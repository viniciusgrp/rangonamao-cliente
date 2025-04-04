'use client';

import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export function LoadingSpinner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Usar um pequeno atraso para garantir que o componente esteja completamente montado
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // During SSR and before hydration, render a placeholder
  if (!mounted) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: '#f5f5f5',
        }}
      >
        <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,0,0,0.1)' }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}
    >
      <CircularProgress />
    </Box>
  );
} 