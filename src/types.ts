export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'customer';
  provider: 'google' | 'email';
}

export type ProductCategory = 'all' | 'men' | 'women' | 'accessories';

export interface Product {
  id: number;
  name: string;
  price: number;
  cat: 'men' | 'women' | 'accessories';
  tag?: string;
  img: string;
  stock: number;
  description?: string;
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  qty: number;
  size: string;
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

export type OrderStatus = 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'cod' | 'card' | 'bank';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  size: string;
  img: string;
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
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentStatus: string;
}
