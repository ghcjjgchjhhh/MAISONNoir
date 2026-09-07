import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Product, 
  ProductVariant, 
  CartItem, 
  Order, 
  DeliveryDetails, 
  OrderStatus, 
  PaymentMethod,
  InventoryLog,
  CustomerUser,
  CustomerSession,
  DiscountCode,
  MarketingBanner,
  AdminNotification,
  StoreSettings
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS,
  INITIAL_INVENTORY_LOGS,
  INITIAL_CUSTOMERS,
  INITIAL_DISCOUNTS,
  INITIAL_MARKETING_BANNERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STORE_SETTINGS
} from '../data/mockData';

export type AdminTab = 
  | 'dashboard' 
  | 'overview'
  | 'products' 
  | 'add_product'
  | 'orders' 
  | 'inventory' 
  | 'alerts' 
  | 'customers' 
  | 'view_customer'
  | 'google_users' 
  | 'analytics' 
  | 'discounts' 
  | 'add_discount'
  | 'marketing' 
  | 'notifications' 
  | 'settings';

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
  duplicateProduct: (productId: number) => void;
  togglePublishProduct: (productId: number) => void;
  toggleFeaturedProduct: (productId: number) => void;
  selectedProductForQuickView: Product | null;
  setSelectedProductForQuickView: (product: Product | null) => void;

  // Restock & Inventory Management
  inventoryLogs: InventoryLog[];
  restockVariant: (productId: number, variantId: string, qtyToAdd: number, reason?: string) => void;
  adjustStock: (productId: number, variantId: string, newStock: number, reason: string) => void;
  restockTarget: { product: Product; variant?: ProductVariant } | null;
  openRestockModal: (product: Product, variant?: ProductVariant) => void;
  closeRestockModal: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, qty?: number, color?: string) => void;
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

  // Customer & Google Sign-In Users Management
  customers: CustomerUser[];
  revokeCustomerSession: (customerId: string, sessionId: string) => void;
  revokeAllCustomerSessions: (customerId: string) => void;
  updateCustomerStatus: (customerId: string, status: CustomerUser['status']) => void;

  // Discounts & Marketing
  discounts: DiscountCode[];
  addDiscount: (discount: Omit<DiscountCode, 'id' | 'usedCount'>) => void;
  toggleDiscount: (id: string) => void;
  deleteDiscount: (id: string) => void;
  marketingBanners: MarketingBanner[];
  addMarketingBanner: (banner: Omit<MarketingBanner, 'id'>) => void;
  toggleMarketingBanner: (id: string) => void;
  deleteMarketingBanner: (id: string) => void;

  // Notifications
  notifications: AdminNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  addNotification: (notif: { title: string; message: string; type?: any; targetId?: string }) => void;

  // Marketing & Subscribers
  subscribers: { email: string; date: string }[];
  marketingCampaigns: any[];

  // Store Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  resetToDefaults: () => void;

  // Views & UI
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  currentAdminTab: AdminTab;
  setCurrentAdminTab: (tab: AdminTab) => void;
  selectedCustomerIdForView: string | null;
  setSelectedCustomerIdForView: (id: string | null) => void;
  selectedOrderIdForView: string | null;
  setSelectedOrderIdForView: (id: string | null) => void;
  adminSearchQuery: string;
  setAdminSearchQuery: (query: string) => void;
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

  const email = user.email.toLowerCase();
  const name = user.name.toLowerCase().replace(/\s+/g, '');
  const emailMatch = email.includes('ifeanyianoma2') || email.includes('admin');
  const nameMatch = name.includes('ifeanyianoma2') || name.includes('admin');

  return emailMatch || nameMatch || user.role === 'admin';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('mn_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('mn_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
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

  const loginWithGoogle = async (customEmail?: string, customName?: string): Promise<User> => {
    const email = customEmail || 'ifeanyianoma2@gmail.com';
    const name = customName || 'Ifeanyi Anoma';
    const isUserAdmin = checkIsAdmin({ id: 'temp', name, email, role: 'customer', provider: 'google' });
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      role: isUserAdmin ? 'admin' : 'customer',
      provider: 'google'
    };
    setUser(newUser);
    localStorage.setItem('mn_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    showToast(`Signed in with Google as ${newUser.name}`);
    return newUser;
  };

  const loginWithEmail = async (email: string, name: string): Promise<User> => {
    const isUserAdmin = email.toLowerCase().includes('ifeanyianoma2') || name.toLowerCase().includes('ifeanyianoma2') || email.toLowerCase().includes('admin');
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
    showToast(`Signed in as ${newUser.name}`);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mn_user');
    setCurrentView('store');
    showToast('Signed out successfully.');
  };

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('mn_settings');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Store settings updated successfully.');
  };

  // Products & Variants
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

  // Inventory Audit Logs
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    try {
      const saved = localStorage.getItem('mn_inventory_logs');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY_LOGS;
    } catch {
      return INITIAL_INVENTORY_LOGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_inventory_logs', JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  const logInventoryChange = (log: Omit<InventoryLog, 'id' | 'date'>) => {
    const newLog: InventoryLog = {
      ...log,
      id: 'log-' + Date.now(),
      date: new Date().toISOString()
    };
    setInventoryLogs(prev => [newLog, ...prev]);
  };

  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('mn_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notif: Omit<AdminNotification, 'id' | 'date' | 'read'>) => {
    const newNotif: AdminNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      date: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = Date.now();
    const variants = productData.variants || [
      { id: `var-${newId}-1`, size: 'M', color: 'Standard', sku: `UW-${newId}-M`, stock: productData.stock || 10, price: productData.price }
    ];
    const calculatedStock = variants.reduce((sum, v) => sum + v.stock, 0);

    const newProduct: Product = {
      ...productData,
      id: newId,
      stock: calculatedStock,
      variants,
      status: productData.status || 'published',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [newProduct, ...prev]);
    logInventoryChange({
      productId: newProduct.id,
      productName: newProduct.name,
      variantStr: 'All Variants Initial Creation',
      changeQty: calculatedStock,
      previousStock: 0,
      newStock: calculatedStock,
      reason: 'Initial Inventory',
      adminName: user?.name || 'Store Admin'
    });
    showToast(`"${newProduct.name}" added to catalog.`);
  };

  const updateProduct = (updated: Product) => {
    // Recalculate total stock from variants if available
    const totalStock = updated.variants && updated.variants.length > 0
      ? updated.variants.reduce((sum, v) => sum + v.stock, 0)
      : updated.stock;

    const normalized = { ...updated, stock: totalStock };
    setProducts(prev => prev.map(p => p.id === updated.id ? normalized : p));
    showToast(`Updated "${updated.name}" successfully.`);
  };

  const deleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product removed from catalog.');
  };

  const duplicateProduct = (productId: number) => {
    const existing = products.find(p => p.id === productId);
    if (!existing) return;
    const newId = Date.now();
    const duplicated: Product = {
      ...existing,
      id: newId,
      name: `${existing.name} (Copy)`,
      sku: `${existing.sku || 'UW'}-COPY`,
      status: 'draft',
      variants: existing.variants?.map(v => ({
        ...v,
        id: `var-${newId}-${Math.random().toString(36).substring(2, 6)}`,
        sku: `${v.sku}-COPY`
      }))
    };
    setProducts(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${existing.name}" as draft.`);
  };

  const togglePublishProduct = (productId: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const nextStatus = p.status === 'published' ? 'draft' : 'published';
      showToast(`"${p.name}" is now ${nextStatus}.`);
      return { ...p, status: nextStatus };
    }));
  };

  const toggleFeaturedProduct = (productId: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const nextVal = !p.isFeatured;
      showToast(`"${p.name}" ${nextVal ? 'marked as Featured' : 'removed from Featured'}.`);
      return { ...p, isFeatured: nextVal };
    }));
  };

  // Restock System (Specs 4 & 20)
  const [restockTarget, setRestockTarget] = useState<{ product: Product; variant?: ProductVariant } | null>(null);

  const openRestockModal = (product: Product, variant?: ProductVariant) => {
    setRestockTarget({ product, variant });
  };

  const closeRestockModal = () => {
    setRestockTarget(null);
  };

  const restockVariant = (productId: number, variantId: string, qtyToAdd: number, reason = 'Restock by Admin') => {
    if (qtyToAdd <= 0) return;

    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      let targetVariantName = 'Standard';
      let prevStock = 0;
      let newStock = 0;

      let updatedVariants = p.variants;
      if (updatedVariants && updatedVariants.length > 0) {
        updatedVariants = updatedVariants.map(v => {
          if (v.id === variantId || (!variantId && updatedVariants && updatedVariants.length === 1)) {
            prevStock = v.stock;
            newStock = v.stock + qtyToAdd;
            targetVariantName = `${v.size} / ${v.color} (${v.sku})`;
            return { ...v, stock: newStock };
          }
          return v;
        });
      } else {
        prevStock = p.stock;
        newStock = p.stock + qtyToAdd;
      }

      const totalNewStock = updatedVariants ? updatedVariants.reduce((s, v) => s + v.stock, 0) : newStock;

      // Log to inventory history
      logInventoryChange({
        productId: p.id,
        productName: p.name,
        variantStr: targetVariantName,
        changeQty: qtyToAdd,
        previousStock: prevStock,
        newStock: newStock,
        reason: 'Restock by Admin',
        adminName: user?.name || 'Ifeanyi Anoma (Admin)'
      });

      showToast(`✓ ${qtyToAdd} units successfully added to ${p.name} — ${targetVariantName}.`, 'success');
      return { ...p, variants: updatedVariants, stock: totalNewStock };
    }));

    closeRestockModal();
  };

  const adjustStock = (productId: number, variantId: string, newStockVal: number, reason: string) => {
    if (newStockVal < 0) return;

    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      let targetVariantName = 'Standard';
      let prevStock = 0;

      let updatedVariants = p.variants;
      if (updatedVariants && updatedVariants.length > 0) {
        updatedVariants = updatedVariants.map(v => {
          if (v.id === variantId) {
            prevStock = v.stock;
            targetVariantName = `${v.size} / ${v.color} (${v.sku})`;
            return { ...v, stock: newStockVal };
          }
          return v;
        });
      } else {
        prevStock = p.stock;
      }

      const totalNewStock = updatedVariants ? updatedVariants.reduce((s, v) => s + v.stock, 0) : newStockVal;
      const diff = newStockVal - prevStock;

      logInventoryChange({
        productId: p.id,
        productName: p.name,
        variantStr: targetVariantName,
        changeQty: diff,
        previousStock: prevStock,
        newStock: newStockVal,
        reason: 'Manual stock adjustment',
        adminName: user?.name || 'Store Admin'
      });

      showToast(`Adjusted ${p.name} stock to ${newStockVal} units.`);
      return { ...p, variants: updatedVariants, stock: totalNewStock };
    }));
  };

  // Quick View Product
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

  const addToCart = (product: Product, size?: string, qty = 1, color?: string) => {
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const chosenColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    
    // Check stock availability
    if (product.stock <= 0) {
      showToast(`Sorry, ${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart(prev => {
      const index = prev.findIndex(item => item.product.id === product.id && item.size === chosenSize);
      if (index > -1) {
        const next = [...prev];
        next[index] = { ...next[index], qty: next[index].qty + qty };
        return next;
      } else {
        return [...prev, { product, qty, size: chosenSize, color: chosenColor }];
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
        item.product.id === productId && item.size === size
          ? { ...item, qty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shippingFee = cartSubtotal > storeSettings.freeShippingThreshold || cartSubtotal === 0 ? 0 : storeSettings.defaultShippingFee;
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

  // Place Order with automatic stock decrement (Specs 20 & 21)
  const placeOrder = async (details: DeliveryDetails, paymentMethod: PaymentMethod): Promise<Order> => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${orderNumber}`;

    // Decrement stock in products and log to audit trail
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p => {
        const cartItemForProduct = cart.filter(c => c.product.id === p.id);
        if (cartItemForProduct.length === 0) return p;

        let productStock = p.stock;
        let updatedVariants = p.variants ? [...p.variants] : undefined;

        for (const item of cartItemForProduct) {
          productStock = Math.max(0, productStock - item.qty);

          if (updatedVariants) {
            updatedVariants = updatedVariants.map(v => {
              if (v.size === item.size) {
                const prev = v.stock;
                const next = Math.max(0, v.stock - item.qty);
                // Log inventory reduction
                logInventoryChange({
                  productId: p.id,
                  productName: p.name,
                  variantStr: `${v.size} / ${v.color} (${v.sku})`,
                  changeQty: -item.qty,
                  previousStock: prev,
                  newStock: next,
                  reason: 'Sold through Order',
                  orderId: orderId,
                  adminName: 'Automated Checkout'
                });

                // Check Low Stock or Out of Stock Threshold
                const threshold = p.minStockThreshold || storeSettings.lowStockThreshold;
                if (next === 0) {
                  addNotification({
                    type: 'out_of_stock',
                    title: '🔴 Out of Stock',
                    message: `${p.name} — ${v.size} is now out of stock (0 units).`,
                    targetId: String(p.id)
                  });
                } else if (next <= threshold) {
                  addNotification({
                    type: 'low_stock',
                    title: '⚠️ Low Stock Alert',
                    message: `${p.name} — ${v.size} has only ${next} units remaining.`,
                    targetId: String(p.id)
                  });
                }

                return { ...v, stock: next };
              }
              return v;
            });
          } else {
            logInventoryChange({
              productId: p.id,
              productName: p.name,
              variantStr: item.size,
              changeQty: -item.qty,
              previousStock: p.stock,
              newStock: productStock,
              reason: 'Sold through Order',
              orderId: orderId,
              adminName: 'Automated Checkout'
            });
          }
        }

        const totalStock = updatedVariants ? updatedVariants.reduce((sum, v) => sum + v.stock, 0) : productStock;
        return { ...p, variants: updatedVariants, stock: totalStock };
      });
      return updatedProducts;
    });

    const newOrder: Order = {
      id: orderId,
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
        color: item.color,
        img: item.product.img,
        sku: item.product.sku
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

    // Notify admin
    addNotification({
      type: 'new_order',
      title: '📦 New Order Received',
      message: `Order #${newOrder.id} placed by ${newOrder.customer.fullName} ($${newOrder.total.toFixed(2)}).`,
      targetId: newOrder.id
    });

    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    showToast(`Order #${newOrder.id} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    let orderToRestock: Order | null = null;

    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        
        // Check if we need to restock inventory on Cancelled or Returned
        const wasCancelledOrReturned = o.status === 'Cancelled' || o.status === 'Returned';
        const isNowCancelledOrReturned = status === 'Cancelled' || status === 'Returned';
        if (!wasCancelledOrReturned && isNowCancelledOrReturned) {
          orderToRestock = o;
        }

        let pStatus = o.paymentStatus;
        if (status === 'Delivered' && o.paymentMethod === 'cod') {
          pStatus = 'Paid on Delivery (Collected)';
        }

        const now = new Date();
        const timeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
          ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const updatedTimeline = [
          ...(o.timeline || [
            { status: 'New' as OrderStatus, timestamp: 'Order Created', note: 'Customer placed order via checkout' }
          ]),
          { 
            status, 
            timestamp: timeStr, 
            note: status === 'Delivered' 
              ? 'Order handed over and confirmed delivered'
              : status === 'Cancelled'
              ? 'Order cancelled by administrator - inventory restocked'
              : status === 'Returned'
              ? 'Return processed - inventory restocked to warehouse'
              : `Order status shifted to ${status}`
          }
        ];

        return { ...o, status, paymentStatus: pStatus, timeline: updatedTimeline };
      })
    );

    // If order was cancelled or returned, return stock to products
    if (orderToRestock) {
      const order: Order = orderToRestock;
      setProducts(prevProducts => {
        return prevProducts.map(p => {
          const matchingItems = order.items.filter(item => item.id === p.id);
          if (matchingItems.length === 0) return p;

          let newStock = p.stock;
          let newVariants = p.variants ? [...p.variants] : undefined;

          matchingItems.forEach(item => {
            newStock += item.qty;
            if (newVariants) {
              newVariants = newVariants.map(v => {
                if (v.size === item.size && (!item.color || v.color.toLowerCase() === item.color.toLowerCase())) {
                  return { ...v, stock: v.stock + item.qty };
                }
                return v;
              });
            }

            logInventoryChange({
              productId: p.id,
              productName: p.name,
              variantStr: `${item.size}${item.color ? ` / ${item.color}` : ''}`,
              changeQty: +item.qty,
              previousStock: p.stock,
              newStock: newStock,
              reason: 'Return Restock',
              orderId: order.id,
              adminName: 'Inventory Restock System'
            });
          });

          return {
            ...p,
            stock: newVariants ? newVariants.reduce((sum, v) => sum + v.stock, 0) : newStock,
            variants: newVariants
          };
        });
      });
      showToast(`Order #${orderId} marked as ${status}. Restocked items to inventory.`, 'info');
    } else {
      showToast(`Order #${orderId} marked as ${status}.`);
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} deleted.`);
  };

  // Customers & Google Users Management
  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem('mn_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_customers', JSON.stringify(customers));
  }, [customers]);

  const revokeCustomerSession = (customerId: string, sessionId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      const updatedSessions = c.sessions.map(s => s.id === sessionId ? { ...s, status: 'revoked' as const } : s);
      const allRevoked = updatedSessions.every(s => s.status === 'revoked');
      return {
        ...c,
        status: allRevoked ? 'session_revoked' : c.status,
        sessions: updatedSessions
      };
    }));
    showToast('✓ Customer session has been revoked.');
  };

  const revokeAllCustomerSessions = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      return {
        ...c,
        status: 'session_revoked',
        sessions: c.sessions.map(s => ({ ...s, status: 'revoked' as const }))
      };
    }));
    showToast('✓ All active customer sessions signed out.');
  };

  const updateCustomerStatus = (customerId: string, status: CustomerUser['status']) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, status } : c));
    showToast(`Customer status updated to ${status}.`);
  };

  // Discounts
  const [discounts, setDiscounts] = useState<DiscountCode[]>(() => {
    try {
      const saved = localStorage.getItem('mn_discounts');
      return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
    } catch {
      return INITIAL_DISCOUNTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_discounts', JSON.stringify(discounts));
  }, [discounts]);

  const addDiscount = (disc: Omit<DiscountCode, 'id' | 'usedCount'>) => {
    const newDisc: DiscountCode = {
      ...disc,
      id: 'disc-' + Date.now(),
      usedCount: 0
    };
    setDiscounts(prev => [newDisc, ...prev]);
    showToast(`Discount "${newDisc.code}" created.`);
  };

  const toggleDiscount = (id: string) => {
    setDiscounts(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const deleteDiscount = (id: string) => {
    setDiscounts(prev => prev.filter(d => d.id !== id));
    showToast('Discount code removed.');
  };

  // Marketing Banners
  const [marketingBanners, setMarketingBanners] = useState<MarketingBanner[]>(() => {
    try {
      const saved = localStorage.getItem('mn_marketing');
      return saved ? JSON.parse(saved) : INITIAL_MARKETING_BANNERS;
    } catch {
      return INITIAL_MARKETING_BANNERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('mn_marketing', JSON.stringify(marketingBanners));
  }, [marketingBanners]);

  const addMarketingBanner = (banner: Omit<MarketingBanner, 'id'>) => {
    const newBanner: MarketingBanner = {
      ...banner,
      id: 'mkt-' + Date.now()
    };
    setMarketingBanners(prev => [newBanner, ...prev]);
    showToast('Marketing campaign created.');
  };

  const toggleMarketingBanner = (id: string) => {
    setMarketingBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const deleteMarketingBanner = (id: string) => {
    setMarketingBanners(prev => prev.filter(b => b.id !== id));
    showToast('Marketing campaign removed.');
  };

  // Navigation & Views
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('dashboard');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [selectedCustomerIdForView, setSelectedCustomerIdForView] = useState<string | null>(null);
  const [selectedOrderIdForView, setSelectedOrderIdForView] = useState<string | null>(null);

  // Policy Modal
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [policyInitialSection, setPolicyInitialSection] = useState<string>('all');
  const openPolicyModal = (section: string = 'all') => {
    setPolicyInitialSection(section);
    setIsPolicyModalOpen(true);
  };

  const resetToDefaults = () => {
    localStorage.removeItem('mn_products');
    localStorage.removeItem('mn_orders');
    localStorage.removeItem('mn_customers');
    localStorage.removeItem('mn_inventory_logs');
    localStorage.removeItem('mn_discounts');
    localStorage.removeItem('mn_marketing');
    localStorage.removeItem('mn_store_settings');
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setInventoryLogs(INITIAL_INVENTORY_LOGS);
    setDiscounts(INITIAL_DISCOUNTS);
    setMarketingBanners(INITIAL_MARKETING_BANNERS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    showToast('Factory demo data restored successfully.', 'success');
  };

  const subscribers = [
    { email: 'sarah.jenkins@fashiondaily.com', date: '2026-09-02' },
    { email: 'alex.rivera@designstudio.io', date: '2026-09-03' },
    { email: 'elena.rostova@couture.fr', date: '2026-09-05' },
    { email: 'marcus.vance@streetstyle.com', date: '2026-09-06' }
  ];

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
        duplicateProduct,
        togglePublishProduct,
        toggleFeaturedProduct,
        selectedProductForQuickView,
        setSelectedProductForQuickView,
        inventoryLogs,
        restockVariant,
        adjustStock,
        restockTarget,
        openRestockModal,
        closeRestockModal,
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
        customers,
        revokeCustomerSession,
        revokeAllCustomerSessions,
        updateCustomerStatus,
        discounts,
        addDiscount,
        toggleDiscount,
        deleteDiscount,
        marketingBanners,
        addMarketingBanner,
        toggleMarketingBanner,
        deleteMarketingBanner,
        marketingCampaigns: marketingBanners,
        subscribers,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        addNotification,
        storeSettings,
        updateStoreSettings,
        resetToDefaults,
        currentView,
        setCurrentView,
        adminActiveTab,
        setAdminActiveTab,
        currentAdminTab: adminActiveTab,
        setCurrentAdminTab: setAdminActiveTab,
        selectedCustomerIdForView,
        setSelectedCustomerIdForView,
        selectedOrderIdForView,
        setSelectedOrderIdForView,
        adminSearchQuery,
        setAdminSearchQuery,
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
