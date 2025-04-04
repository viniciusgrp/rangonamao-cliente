import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreState, Store, User, CartItem, Product } from '@/types/store';

const initialState: StoreState = {
  store: null,
  user: null,
  cart: [],
  isLoading: false,
  error: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setStore: (state, action: PayloadAction<Store>) => {
      state.store = action.payload;
      state.error = null;
    },
    updateStore: (state, action: PayloadAction<Partial<Store>>) => {
      if (state.store) {
        state.store = { ...state.store, ...action.payload };
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.cart = [];
    },
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.product.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter(item => item.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStore,
  updateStore,
  setUser,
  logout,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setLoading,
  setError,
} = storeSlice.actions;

export default storeSlice.reducer; 