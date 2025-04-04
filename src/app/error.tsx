'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Algo deu errado
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Ocorreu um erro ao carregar esta página. Por favor, tente novamente.
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={reset}
        sx={{ mr: 2 }}
      >
        Tentar novamente
      </Button>
      
      <Button 
        variant="outlined" 
        onClick={() => window.location.href = '/'}
      >
        Voltar para a página inicial
      </Button>
    </Container>
  );
} 