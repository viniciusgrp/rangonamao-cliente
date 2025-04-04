export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  Product: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Store {
  id: string;
  name: string;
  url: string;
  email: string;
  description: string;
  logo: string;
  phone: string;
  color: string;
  background: string | null;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
}

export interface StoreState {
  store: Store | null;
  user: User | null;
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
}

export interface StoreContextData {
  store: Store | null;
  user: User | null;
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Store actions
  setStore: (store: Store) => void;
  updateStore: (data: Partial<Store>) => void;
  
  // User actions
  setUser: (user: User) => void;
  logout: () => void;
  
  // Product actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
} 