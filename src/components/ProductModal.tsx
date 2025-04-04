'use client';

import { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Divider, 
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Image from 'next/image';
import { Product } from '@/types/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, updateCartItemQuantity } from '@/store/slices/storeSlice';

interface ProductModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.store.cart);
  const [mounted, setMounted] = useState(false);
  
  // Find the current quantity in cart
  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleIncreaseQuantity = () => {
    dispatch(updateCartItemQuantity({ productId: product.id, quantity: quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      dispatch(updateCartItemQuantity({ productId: product.id, quantity: quantity - 1 }));
    } else {
      dispatch(updateCartItemQuantity({ productId: product.id, quantity: 0 }));
    }
  };

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '95%' : '600px',
    maxWidth: '1000px',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    overflow: 'auto',
  };

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="product-modal-title"
      aria-describedby="product-modal-description"
      closeAfterTransition
    >
      <Paper sx={modalStyle}>
        <Box sx={{ position: 'relative' }}>
          {isMobile ? (
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              height: '200px',
              overflow: 'hidden'
            }}>
              <Image
                src={product.image || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
            </Box>
          ) : (
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              paddingTop: '100%',
              overflow: 'hidden'
            }}>
              <Image
                src={product.image || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
            </Box>
          )}
          <IconButton 
            aria-label="close" 
            onClick={onClose} 
            sx={{ 
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ p: isMobile ? 3 : 2 }}>
          <Typography id="product-modal-title" variant={isMobile ? "h4" : "h5"} component="h2" gutterBottom>
            {product.name}
          </Typography>
          
          <Typography variant={isMobile ? "h5" : "h6"} color="primary" gutterBottom>
            R$ {product.price.toFixed(2)}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            {product.description}
          </Typography>
          
          {product.ingredients && product.ingredients.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ingredientes:
              </Typography>
              <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1
              }}>
                {product.ingredients.map((ingredient, index) => (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: 'grey.100',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem'
                    }}
                  >
                    {ingredient}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            {quantity === 0 ? (
              <Button 
                variant="contained" 
                color="primary" 
                size={isMobile ? "large" : "medium"}
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                fullWidth
              >
                Adicionar ao Carrinho
              </Button>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: isMobile ? 2 : 1,
                width: '100%',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: isMobile ? 2 : 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: isMobile ? 1 : 0.5,
                }}>
                  <IconButton 
                    size={isMobile ? "medium" : "small"}
                    onClick={handleDecreaseQuantity}
                    sx={{ p: isMobile ? 1 : 0.5 }}
                  >
                    <RemoveIcon fontSize={isMobile ? "medium" : "small"} />
                  </IconButton>
                  <Typography variant={isMobile ? "h6" : "body1"} sx={{ minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton 
                    size={isMobile ? "medium" : "small"}
                    onClick={handleIncreaseQuantity}
                    sx={{ p: isMobile ? 1 : 0.5 }}
                  >
                    <AddIcon fontSize={isMobile ? "medium" : "small"} />
                  </IconButton>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size={isMobile ? "large" : "medium"}
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                >
                  Atualizar
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
} 