import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { User, Product, CartItem, Order, DeliveryDetails, OrderStatus, PaymentMethod } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/mockData';
import { auth, googleProvider } from '../firebase';

interface AppContextType {
  // Auth
  user: User | null;
  isAdmin: boolean;
  loginWithGoogle: (customEmail?: string, customName?: string) => Promise<User>;
  loginWithEmail: (email: string, name: string) => Promise<User>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Products & Inventory
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
  selectedProductForQuickView: Product | null;
  setSelectedProductForQuickView: (product: Product | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, qty?: number) => void;
  removeFromCart: (productId: number, size: string) => void;
  updateQty: (productId: number, size: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;

  // Checkout & Orders
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedPaymentMethod: PaymentMethod;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  orders: Order[];
  placeOrder: (details: DeliveryDetails, paymentMethod: PaymentMethod) => Promise<Order>;
  latestPlacedOrder: Order | null;
  setLatestPlacedOrder: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Views & UI
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Policy Modal
  isPolicyModalOpen: boolean;
  setIsPolicyModalOpen: (open: boolean) => void;
  policyInitialSection: string;
  openPolicyModal: (section?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function checkIsAdmin(user: User | null): boolean {
  if (!user) return false;
  const emailMatch = user.email.toLowerCase().includes('ifeanyianoma2');
  const nameMatch = user.name.toLowerCase().includes('ifeanyianoma2');
  return emailMatch || nameMatch || user.role === 'admin';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mn_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('mn_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Policy Modal
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [policyInitialSection, setPolicyInitialSection] = useState<string>('all');
  const openPolicyModal = (section: string = 'all') => {
    setPolicyInitialSection(section);
    setIsPolicyModalOpen(true);
  };

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3600);
  };

  // User Auth
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('mn_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = checkIsAdmin(user);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;

      const signedInUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || undefined,
        role: 'customer',
        provider: 'google'
      };

      setUser(signedInUser);
      localStorage.setItem('mn_user', JSON.stringify(signedInUser));
    });
  }, []);

  const loginWithGoogle = async (): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    const signedInName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer';
    const isUserAdmin = firebaseUser.email?.toLowerCase().includes('ifeanyianoma2') || signedInName.toLowerCase().includes('ifeanyianoma2');
    const newUser: User = {
      id: firebaseUser.uid,
      name: signedInName,
      email: firebaseUser.email || '',
      avatar: isUserAdmin 
        ? firebaseUser.photoURL || undefined
        : firebaseUser.photoURL || undefined,
      role: isUserAdmin ? 'admin' : 'customer',
      provider: 'google'
    };
    setUser(newUser);
    localStorage.setItem('mn_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    
    showToast(isUserAdmin ? 'Welcome Super Admin Ifeanyi! Admin Dashboard unlocked.' : `Welcome back, ${signedInName}! Signed in with Google.`, 'success');
    return newUser;
  };

  const loginWithEmail = async (email: string, name: string): Promise<User> => {
    const isUserAdmin = email.toLowerCase().includes('ifeanyianoma2') || name.toLowerCase().includes('ifeanyianoma2');
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name || email.split('@')[0],
      email: email,
      role: isUserAdmin ? 'admin' : 'customer',
      provider: 'email'
    };
    setUser(newUser);
    localStorage.setItem('mn_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    
    if (isUserAdmin) {
      showToast(`Signed in as Super Admin (${email})`, 'success');
    } else {
      showToast(`Welcome, ${newUser.name}!`, 'success');
    }
    return newUser;
  };

  const logout = () => {
    void firebaseSignOut(auth);
    setUser(null);
    localStorage.removeItem('mn_user');
    setCurrentView('store');
    showToast('You have been signed out.');
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mn_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now()
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" added to luxury catalog.`);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(`Updated "${updated.name}" successfully.`);
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product removed from catalog.');
  };

  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mn_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_cart', JSON.stringify(cart));
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, size?: string, qty = 1) => {
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    setCart(prev => {
      const index = prev.findIndex(item => item.product.id === product.id && item.size === chosenSize);
      if (index > -1) {
        const next = [...prev];
        next[index] = { ...next[index], qty: next[index].qty + qty };
        return next;
      } else {
        return [...prev, { product, qty, size: chosenSize }];
      }
    });
    showToast(`Added ${product.name} (${chosenSize}) to your bag`);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const updateQty = (productId: number, size: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.size === size ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shippingFee = cartSubtotal > 200 || cartSubtotal === 0 ? 0 : 15;
  const cartTotal = cartSubtotal + shippingFee;

  // Checkout & Orders
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cod');
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mn_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = async (details: DeliveryDetails, paymentMethod: PaymentMethod): Promise<Order> => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `MN-${orderNumber}`,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: details.fullName,
        email: user?.email || `${details.fullName.toLowerCase().replace(/\s+/g, '.')}@client.com`,
        phone: details.phone,
        altPhone: details.altPhone,
        address: details.address,
        city: details.city,
        state: details.state,
        deliveryWindow: details.deliveryWindow,
        notes: details.notes
      },
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
        size: item.size,
        img: item.product.img
      })),
      subtotal: cartSubtotal,
      shipping: shippingFee,
      total: cartTotal,
      paymentMethod: paymentMethod,
      status: 'Pending',
      paymentStatus: paymentMethod === 'cod' 
        ? 'Pending (Pay on Delivery)' 
        : paymentMethod === 'card' 
        ? 'Paid (Card)' 
        : 'Awaiting Bank Confirmation'
    };

    setOrders(prev => [newOrder, ...prev]);
    setLatestPlacedOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    showToast(`Order #${newOrder.id} placed successfully! We'll contact you for delivery.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        let pStatus = o.paymentStatus;
        if (status === 'Delivered' && o.paymentMethod === 'cod') {
          pStatus = 'Paid on Delivery (Collected)';
        }
        return { ...o, status, paymentStatus: pStatus };
      })
    );
    showToast(`Order #${orderId} marked as ${status}.`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} archived.`);
  };

  // View Mode
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');

  // Guard admin view
  useEffect(() => {
    if (currentView === 'admin' && !isAdmin) {
      setCurrentView('store');
      showToast('Access restricted: Administrator credentials required.', 'error');
    }
  }, [currentView, isAdmin]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        loginWithGoogle,
        loginWithEmail,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        selectedProductForQuickView,
        setSelectedProductForQuickView,
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        orders,
        placeOrder,
        latestPlacedOrder,
        setLatestPlacedOrder,
        updateOrderStatus,
        deleteOrder,
        currentView,
        setCurrentView,
        theme,
        toggleTheme,
        toast,
        showToast,
        isPolicyModalOpen,
        setIsPolicyModalOpen,
        policyInitialSection,
        openPolicyModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
