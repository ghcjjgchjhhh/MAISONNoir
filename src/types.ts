export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'customer';
  provider: 'google' | 'email';
}

export type ProductCategory = 'all' | 'men' | 'women' | 'accessories' | 'unisex';

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
  price?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  cat: 'men' | 'women' | 'accessories' | 'unisex';
  brand?: string;
  subcategory?: string;
  gender?: 'men' | 'women' | 'unisex';
  costPrice?: number;
  sku?: string;
  tag?: string;
  img: string;
  additionalImages?: string[];
  stock: number; // total units across variants
  description?: string;
  sizes?: string[];
  colors?: string[];
  material?: string;
  weight?: string;
  variants?: ProductVariant[];
  status?: 'published' | 'draft' | 'archived';
  isFeatured?: boolean;
  minStockThreshold?: number;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
  size: string;
  color?: string;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  altPhone?: string;
  address: string;
  city: string;
  state: string;
  deliveryWindow: string;
  notes?: string;
}

export type OrderStatus = 
  | 'New' 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned';

export type PaymentMethod = 'cod' | 'card' | 'bank';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  size: string;
  color?: string;
  img: string;
  sku?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    altPhone?: string;
    address: string;
    city: string;
    state: string;
    deliveryWindow: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentStatus: string;
  timeline?: { status: OrderStatus; timestamp: string; note?: string }[];
}

// Inventory History Log (Section 6)
export interface InventoryLog {
  id: string;
  date: string;
  productId: number;
  productName: string;
  variantStr: string; // e.g. "Large / Black (HD-BLK-L)"
  changeQty: number; // e.g. +20 or -2
  previousStock: number;
  newStock: number;
  reason: 
    | 'Restock by Admin' 
    | 'Sold through Order' 
    | 'Manual stock adjustment' 
    | 'Initial Inventory' 
    | 'Return Restock'
    | 'Damaged Goods Write-off';
  orderId?: string;
  adminName: string;
}

// Customer Session Management (Sections 23 - 28)
export interface CustomerSession {
  id: string;
  device: string; // e.g. "iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Pro / Chrome"
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  ip: string;
  lastActive: string;
  loginDate: string;
  status: 'active' | 'revoked';
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  provider: 'google' | 'email';
  status: 'active' | 'offline' | 'suspended' | 'session_revoked';
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  lastActive: string;
  sessions: CustomerSession[];
  address?: string;
  addresses?: {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode?: string;
    isDefault: boolean;
  }[];
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  state: string;
  city: string;
  area: string;
  street: string;
  houseNumber?: string;
  instructions?: string;
  isDefault: boolean;
}

export interface CustomerReview {
  id: string;
  productId: number;
  orderId: string;
  rating: number;
  text: string;
  createdAt: string;
}

// Admin Notifications (Section 8)
export interface AdminNotification {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'new_order' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  targetId?: string; // productId or orderId
}

// Discounts & Promo Codes (Section 12 & 32)
export type DiscountType = 'percentage' | 'fixed' | 'product' | 'category' | 'flash_sale';
export type DiscountStatus = 'active' | 'scheduled' | 'expired' | 'disabled';

export interface DiscountCode {
  id: string;
  name?: string;
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  minOrder?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  maxUses?: number;
  usageLimit?: number;
  maxUsesPerCustomer?: number;
  usageLimitPerCustomer?: number;
  usedCount: number;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  expiryDate?: string;
  isActive: boolean;
  status?: DiscountStatus;
  category?: string;
  selectedProducts?: number[];
  selectedProductIds?: number[];
  selectedCategories?: string[];
  totalDiscountGiven?: number;
  revenueGenerated?: number;
}
export type DiscountCoupon = DiscountCode;

// Marketing Campaigns & Banners (Section 13)
export interface MarketingBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  bgImage?: string;
  badge?: string;
}

// Store Settings (Section 14)
export interface StoreSettings {
  storeName: string;
  tagline: string;
  storeDescription: string;
  logo: string;
  email: string;
  phone: string;
  currency: string;
  currencySymbol: string;
  lowStockThreshold: number; // default 5
  outOfStockAction: 'show_badge' | 'disable_order' | 'hide_from_store';
  defaultShippingFee: number;
  freeShippingThreshold: number;
  supportedLocations: string[];
  enablePushNotifications: boolean;
  taxRate: number;
  socials: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
}
