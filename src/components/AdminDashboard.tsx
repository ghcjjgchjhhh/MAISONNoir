import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus, Product } from '../types';
import { 
  ShoppingBag, 
  DollarSign, 
  Truck, 
  Package, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Plus, 
  Trash2, 
  Edit, 
  Store, 
  Download, 
  Users, 
  TrendingUp, 
  Copy, 
  Check, 
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    deleteOrder, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    setCurrentView,
    user,
    showToast
  } = useApp();

  // Navigation & Filters
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'customers' | 'analytics'>('orders');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('all');

  // Selected Order for Invoice modal
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // Add/Edit Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    price: 150,
    cat: 'men' as 'men' | 'women' | 'accessories',
    tag: 'New',
    img: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
    stock: 20,
    description: '',
    sizes: 'S, M, L, XL'
  });

  // Copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Copied to clipboard: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // KPI Calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  }, [orders]);

  const pendingDeliveries = useMemo(() => {
    return orders.filter(o => o.status === 'Pending' || o.status === 'Out for Delivery').length;
  }, [orders]);

  const codOrdersCount = useMemo(() => {
    return orders.filter(o => o.paymentMethod === 'cod').length;
  }, [orders]);

  const totalStockUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + p.stock, 0);
  }, [products]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = selectedStatusFilter === 'all' || o.status === selectedStatusFilter;
      const matchPayment = selectedPaymentFilter === 'all' || o.paymentMethod === selectedPaymentFilter;
      const q = orderSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q) ||
        o.customer.address.toLowerCase().includes(q);

      return matchStatus && matchPayment && matchSearch;
    });
  }, [orders, selectedStatusFilter, selectedPaymentFilter, orderSearch]);

  // Customers calculation
  const customersList = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; totalSpent: number; ordersCount: number; city: string }>();
    orders.forEach(o => {
      const key = o.customer.phone || o.customer.email;
      if (!map.has(key)) {
        map.set(key, {
          name: o.customer.fullName,
          email: o.customer.email,
          phone: o.customer.phone,
          totalSpent: o.total,
          ordersCount: 1,
          city: o.customer.city
        });
      } else {
        const curr = map.get(key)!;
        curr.totalSpent += o.total;
        curr.ordersCount += 1;
      }
    });
    return Array.from(map.values());
  }, [orders]);

  // Handle Product Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = newProductForm.sizes.split(',').map(s => s.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: newProductForm.name,
        price: Number(newProductForm.price),
        cat: newProductForm.cat,
        tag: newProductForm.tag,
        img: newProductForm.img,
        stock: Number(newProductForm.stock),
        description: newProductForm.description,
        sizes: sizesArray
      });
    } else {
      addProduct({
        name: newProductForm.name,
        price: Number(newProductForm.price),
        cat: newProductForm.cat,
        tag: newProductForm.tag,
        img: newProductForm.img,
        stock: Number(newProductForm.stock),
        description: newProductForm.description,
        sizes: sizesArray
      });
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setNewProductForm({
      name: '',
      price: 180,
      cat: 'men',
      tag: 'New',
      img: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
      stock: 15,
      description: 'Handcrafted luxury piece cut with timeless proportions in black & white.',
      sizes: 'S, M, L, XL'
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setNewProductForm({
      name: product.name,
      price: product.price,
      cat: product.cat,
      tag: product.tag || '',
      img: product.img,
      stock: product.stock,
      description: product.description || '',
      sizes: product.sizes?.join(', ') || 'Standard'
    });
    setIsProductModalOpen(true);
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'City', 'State', 'Payment Method', 'Status', 'Total ($)'];
    const rows = orders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.customer.fullName}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.address}"`,
      `"${o.customer.city}"`,
      `"${o.customer.state}"`,
      o.paymentMethod,
      o.status,
      o.total.toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maison_noir_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported as CSV.');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
      case 'Out for Delivery':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 animate-pulse';
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
      case 'Confirmed':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30';
      case 'Cancelled':
        return 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30';
      default:
        return 'bg-neutral-500/15 text-neutral-600 border border-neutral-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#070707] text-neutral-900 dark:text-neutral-100 pt-20 pb-24 transition-colors duration-300">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-neutral-900 text-white dark:bg-black border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold font-serif text-xl shadow-md">
              MN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-semibold tracking-wide">
                  Maison Noir Executive Monitor
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-amber-400 text-black">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Authorized Session: <strong>{user?.email || 'ifeanyianoma2@gmail.com'}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs uppercase tracking-wider font-semibold rounded-md flex items-center gap-1.5 transition-colors border border-neutral-700"
              title="Export order records"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => setCurrentView('store')}
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs uppercase tracking-[0.15em] font-bold rounded-md flex items-center gap-2 transition-colors shadow-sm"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        
        {/* KPI Stat Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          {/* Card 1: Revenue */}
          <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-50">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>Across all confirmed & delivered</span>
              </div>
            </div>
          </div>

          {/* Card 2: Orders Count */}
          <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-50">
                {orders.length}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                {codOrdersCount} Pay on Delivery orders ({((codOrdersCount / Math.max(1, orders.length)) * 100).toFixed(0)}%)
              </p>
            </div>
          </div>

          {/* Card 3: Pending Deliveries */}
          <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Active Deliveries</span>
              <Truck className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-50">
                {pendingDeliveries}
              </h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                Orders pending dispatch / arrival
              </p>
            </div>
          </div>

          {/* Card 4: Catalog & Inventory */}
          <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Catalog Inventory</span>
              <Package className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-neutral-900 dark:text-neutral-50">
                {products.length} <span className="text-sm font-normal text-neutral-500 font-sans">({totalStockUnits} units)</span>
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Across Men, Women & Accessories
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catalog & Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Client Base ({customersList.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: ORDERS MONITOR ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-[#121212] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by order #, customer name, phone, city, or address..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              {/* Status and Payment Filters */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending (Needs Action)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={selectedPaymentFilter}
                  onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                  className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="cod">💵 Pay on Delivery</option>
                  <option value="card">💳 Card</option>
                  <option value="bank">🏛️ Bank Wire</option>
                </select>
              </div>
            </div>

            {/* Orders Table (PC & Tablet) + Cards (Mobile) */}
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-[#121212] rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
                <ShoppingBag className="w-12 h-12 stroke-1 text-neutral-400 mx-auto mb-3" />
                <h4 className="font-serif text-xl font-medium text-neutral-800 dark:text-neutral-200">No orders match filter</h4>
                <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Try clearing search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Desktop View Table */}
                <div className="hidden lg:block bg-white dark:bg-[#121212] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
                        <tr>
                          <th className="py-4 px-4">Order ID & Date</th>
                          <th className="py-4 px-4">Customer & Phone</th>
                          <th className="py-4 px-4">Delivery Address & Window</th>
                          <th className="py-4 px-4">Items</th>
                          <th className="py-4 px-4">Payment</th>
                          <th className="py-4 px-4">Total</th>
                          <th className="py-4 px-4">Fulfillment Status</th>
                          <th className="py-4 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors">
                            
                            {/* Order ID & Time */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-bold font-mono text-neutral-900 dark:text-neutral-100">
                                {order.id}
                              </div>
                              <div className="text-[11px] text-neutral-400 mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>

                            {/* Customer & Phone */}
                            <td className="py-4 px-4">
                              <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                                {order.customer.fullName}
                              </div>
                              <div className="flex items-center gap-1.5 text-neutral-500 mt-0.5">
                                <a 
                                  href={`tel:${order.customer.phone}`}
                                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{order.customer.phone}</span>
                                </a>
                                <button
                                  onClick={() => copyToClipboard(order.customer.phone, order.id + '-phone')}
                                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                  title="Copy phone"
                                >
                                  {copiedId === order.id + '-phone' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </td>

                            {/* Address & Window */}
                            <td className="py-4 px-4 max-w-xs">
                              <div className="truncate text-neutral-800 dark:text-neutral-200" title={order.customer.address}>
                                {order.customer.address}
                              </div>
                              <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                <span>{order.customer.city}, {order.customer.state}</span>
                                <span>•</span>
                                <span className="font-medium text-neutral-600 dark:text-neutral-300">{order.customer.deliveryWindow}</span>
                              </div>
                            </td>

                            {/* Items count & thumbs */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                {order.items.slice(0, 3).map((item, idx) => (
                                  <img
                                    key={idx}
                                    src={item.img}
                                    alt={item.name}
                                    className="w-7 h-9 object-cover rounded bg-neutral-200 dark:bg-neutral-800"
                                    title={`${item.name} (${item.size}) x${item.qty}`}
                                  />
                                ))}
                                {order.items.length > 3 && (
                                  <span className="w-7 h-9 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold flex items-center justify-center text-neutral-500">
                                    +{order.items.length - 3}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-400 block mt-1">
                                {order.items.reduce((s, i) => s + i.qty, 0)} pieces
                              </span>
                            </td>

                            {/* Payment */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                                order.paymentMethod === 'cod'
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                              }`}>
                                {order.paymentMethod === 'cod' ? '💵 Pay on Delivery' : order.paymentMethod.toUpperCase()}
                              </span>
                              <span className="block text-[10px] text-neutral-400 mt-0.5">{order.paymentStatus}</span>
                            </td>

                            {/* Total */}
                            <td className="py-4 px-4 whitespace-nowrap font-bold text-sm text-neutral-900 dark:text-neutral-100">
                              ${order.total.toFixed(2)}
                            </td>

                            {/* Status Selector */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className={`text-[11px] font-bold uppercase tracking-wider py-1.5 px-2.5 rounded cursor-pointer focus:outline-none ${getStatusBadge(order.status)}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setInspectingOrder(order)}
                                  className="p-1.5 text-neutral-500 hover:text-black dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                  title="View Invoice & Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Archive order #${order.id}?`)) {
                                      deleteOrder(order.id);
                                    }
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                  title="Archive order"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Responsive Card List (< lg screens) */}
                <div className="lg:hidden space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-4"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-sm text-neutral-900 dark:text-neutral-100">
                              #{order.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                              order.paymentMethod === 'cod'
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            }`}>
                              {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400 block mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <span className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>

                      {/* Customer info & call */}
                      <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-lg text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-neutral-800 dark:text-neutral-200">{order.customer.fullName}</p>
                            <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">{order.customer.address}, {order.customer.city}</p>
                          </div>
                          <a
                            href={`tel:${order.customer.phone}`}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded flex items-center gap-1.5 shrink-0 shadow-sm"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                          <span>Window: <strong>{order.customer.deliveryWindow}</strong></span>
                          <span>{order.customer.phone}</span>
                        </div>
                      </div>

                      {/* Items thumbnails */}
                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 p-1.5 rounded border border-neutral-200 dark:border-neutral-800 text-xs shrink-0">
                            <img src={item.img} alt={item.name} className="w-8 h-10 object-cover rounded" />
                            <div>
                              <p className="font-serif font-medium text-[11px] truncate max-w-30">{item.name}</p>
                              <p className="text-[10px] text-neutral-400">{item.size} · x{item.qty} · ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Status Dropdown & Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 gap-2">
                        <div className="flex-1">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`w-full text-xs font-bold uppercase tracking-wider py-2 px-3 rounded cursor-pointer focus:outline-none ${getStatusBadge(order.status)}`}
                          >
                            <option value="Pending">Status: Pending</option>
                            <option value="Confirmed">Status: Confirmed</option>
                            <option value="Out for Delivery">Status: Out for Delivery</option>
                            <option value="Delivered">Status: Delivered</option>
                            <option value="Cancelled">Status: Cancelled</option>
                          </select>
                        </div>

                        <button
                          onClick={() => setInspectingOrder(order)}
                          className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium rounded hover:bg-neutral-200"
                        >
                          Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: INVENTORY & CATALOG ================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header / Add piece button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#121212] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <div>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Luxury Catalog Management
                </h3>
                <p className="text-xs text-neutral-500">
                  Manage prices, live stock units, categories, and add new studio drops.
                </p>
              </div>

              <button
                onClick={openAddProductModal}
                className="px-4 py-2.5 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs uppercase tracking-wider font-bold rounded-md flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Piece</span>
              </button>
            </div>

            {/* Products Grid / Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group"
                >
                  <div className="relative aspect-3/4 bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-black/80 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                      {p.cat}
                    </span>
                    {p.tag && (
                      <span className="absolute top-2 right-2 bg-white/90 text-black text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                        {p.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-1">
                        ${p.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Stock modifier */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-neutral-400">Stock:</span>
                        <button
                          onClick={() => updateProduct({ ...p, stock: Math.max(0, p.stock - 1) })}
                          className="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          -
                        </button>
                        <span className={`font-semibold px-1 ${p.stock < 5 ? 'text-amber-500 font-bold' : ''}`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => updateProduct({ ...p, stock: p.stock + 1 })}
                          className="w-6 h-6 rounded border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 text-neutral-500 hover:text-black dark:hover:text-white"
                          title="Edit piece"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${p.name}" from catalog?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-500"
                          title="Delete piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CUSTOMERS ================= */}
        {activeTab === 'customers' && (
          <div className="bg-white dark:bg-[#121212] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Customer Registry ({customersList.length})
              </h3>
              <p className="text-xs text-neutral-500">
                Direct contact details and total expenditure by valued client.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-900/80 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3.5 px-4">Client Name</th>
                    <th className="py-3.5 px-4">Phone Contact</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Orders Placed</th>
                    <th className="py-3.5 px-4 text-right">Lifetime Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {customersList.map((c, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40">
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-600 dark:text-amber-400">
                        <a href={`tel:${c.phone}`} className="hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{c.phone}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500">{c.email}</td>
                      <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">{c.city}</td>
                      <td className="py-3.5 px-4 font-semibold">{c.ordersCount} orders</td>
                      <td className="py-3.5 px-4 text-right font-bold text-sm">
                        ${c.totalSpent.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Full Order Invoice / Inspection Modal */}
      {inspectingOrder && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setInspectingOrder(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-sm p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInspectingOrder(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-between items-start border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
              <div>
                <span className="font-serif text-xl font-bold tracking-wider">MAISON NOIR</span>
                <p className="text-xs uppercase tracking-widest text-neutral-400 mt-0.5">Official Dispatch Bill</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-base text-neutral-900 dark:text-neutral-100">
                  #{inspectingOrder.id}
                </span>
                <p className="text-[11px] text-neutral-400">
                  {new Date(inspectingOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer information grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-sm text-xs mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">Customer / Recipient</span>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">{inspectingOrder.customer.fullName}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{inspectingOrder.customer.phone}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{inspectingOrder.customer.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">Delivery Destination</span>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">{inspectingOrder.customer.address}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{inspectingOrder.customer.city}, {inspectingOrder.customer.state}</p>
                <p className="text-amber-600 dark:text-amber-400 font-medium">Window: {inspectingOrder.customer.deliveryWindow}</p>
              </div>
            </div>

            {inspectingOrder.customer.notes && (
              <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 rounded">
                <strong>Courier Gate Instructions:</strong> &ldquo;{inspectingOrder.customer.notes}&rdquo;
              </div>
            )}

            {/* Ordered Items Table */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden mb-6 text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900/80 text-[10px] uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {inspectingOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-3 flex items-center gap-2">
                        <img src={item.img} alt={item.name} className="w-8 h-10 object-cover bg-neutral-200 rounded shrink-0" />
                        <span className="font-serif font-medium">{item.name}</span>
                      </td>
                      <td className="py-3 px-3">{item.size}</td>
                      <td className="py-3 px-3">{item.qty}</td>
                      <td className="py-3 px-3 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-bold">${(item.price * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Breakdown */}
            <div className="space-y-1.5 text-xs text-right max-w-xs ml-auto border-t border-neutral-200 dark:border-neutral-800 pt-3">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal:</span>
                <span>${inspectingOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping:</span>
                <span>{inspectingOrder.shipping === 0 ? 'Free' : `$${inspectingOrder.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span>Total Due:</span>
                <span>${inspectingOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Status changer buttons */}
            <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Update Status:</span>
                <select
                  value={inspectingOrder.status}
                  onChange={(e) => {
                    const next = e.target.value as OrderStatus;
                    updateOrderStatus(inspectingOrder.id, next);
                    setInspectingOrder({ ...inspectingOrder, status: next });
                  }}
                  className={`text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded cursor-pointer ${getStatusBadge(inspectingOrder.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black text-xs uppercase tracking-wider font-bold rounded"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-sm p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              {editingProduct ? 'Edit Atelier Piece' : 'Add New Atelier Piece'}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Update catalog metadata, price, stock, and photography.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-bold">
                  Piece Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Trench Overcoat"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-bold">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-bold">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-bold">
                    Category
                  </label>
                  <select
                    value={newProductForm.cat}
                    onChange={(e) => setNewProductForm({ ...newProductForm, cat: e.target.value as any })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-bold">
                    Badge Tag (e.g. New, Signature)
                  </label>
                  <input
                    type="text"
                    placeholder="New / Best Seller"
                    value={newProductForm.tag}
                    onChange={(e) => setNewProductForm({ ...newProductForm, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-bold">
                  Image URL (High-res fashion photograph)
                </label>
                <input
                  type="url"
                  required
                  value={newProductForm.img}
                  onChange={(e) => setNewProductForm({ ...newProductForm, img: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-bold">
                  Available Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, XL"
                  value={newProductForm.sizes}
                  onChange={(e) => setNewProductForm({ ...newProductForm, sizes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1 font-bold">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 text-xs uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-black text-white dark:bg-white dark:text-black text-xs uppercase tracking-wider font-bold"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Piece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
