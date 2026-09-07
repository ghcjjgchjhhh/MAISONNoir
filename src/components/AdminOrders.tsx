import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Phone, 
  MapPin, 
  Mail, 
  FileText, 
  ChevronRight, 
  X,
  CreditCard,
  Banknote,
  Package,
  User,
  ExternalLink,
  Download,
  AlertTriangle,
  RotateCcw,
  Calendar,
  DollarSign
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { 
    orders, 
    products,
    updateOrderStatus, 
    deleteOrder, 
    adminSearchQuery,
    setAdminActiveTab,
    setSelectedCustomerIdForView,
    selectedOrderIdForView,
    setSelectedOrderIdForView,
    storeSettings,
    showToast
  } = useApp();

  const currency = storeSettings.currencySymbol || '$';

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [minVal, setMinVal] = useState<number | ''>('');
  const [maxVal, setMaxVal] = useState<number | ''>('');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  // If AppContext has selectedOrderIdForView, auto-open that order
  useEffect(() => {
    if (selectedOrderIdForView) {
      const match = orders.find(o => o.id === selectedOrderIdForView);
      if (match) {
        setSelectedOrder(match);
      }
      setSelectedOrderIdForView(null);
    }
  }, [selectedOrderIdForView, orders]);

  const allStatuses: { id: string; label: string }[] = [
    { id: 'all', label: 'All Orders' },
    { id: 'New', label: 'New' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Confirmed', label: 'Confirmed' },
    { id: 'Processing', label: 'Processing' },
    { id: 'Shipped', label: 'Shipped' },
    { id: 'Out for Delivery', label: 'Out for Delivery' },
    { id: 'Delivered', label: 'Delivered' },
    { id: 'Cancelled', label: 'Cancelled' },
    { id: 'Returned', label: 'Returned' }
  ];

  // Unique customers for dropdown filter
  const uniqueCustomerEmails = useMemo(() => {
    const map = new Map<string, string>();
    orders.forEach(o => {
      map.set(o.customer.email, o.customer.fullName);
    });
    return Array.from(map.entries());
  }, [orders]);

  // Unique products for dropdown filter
  const uniqueProductsInOrders = useMemo(() => {
    const set = new Set<string>();
    orders.forEach(o => o.items.forEach(i => set.add(i.name)));
    return Array.from(set);
  }, [orders]);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    const query = (adminSearchQuery || localSearch).toLowerCase().trim();
    const now = new Date();

    return orders.filter(o => {
      // Status filter
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;

      // Customer filter
      if (customerFilter !== 'all' && o.customer.email !== customerFilter) return false;

      // Product filter
      if (productFilter !== 'all' && !o.items.some(item => item.name === productFilter)) return false;

      // Date filter
      const orderDate = new Date(o.createdAt);
      if (dateFilter === 'today') {
        if (orderDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === '7days') {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 7) return false;
      } else if (dateFilter === '30days') {
        const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays > 30) return false;
      }

      // Order value range
      if (typeof minVal === 'number' && o.total < minVal) return false;
      if (typeof maxVal === 'number' && o.total > maxVal) return false;

      // Multi-term Search: Order ID, Customer name, Email, Phone, Location
      if (query) {
        const matchId = o.id.toLowerCase().includes(query);
        const matchName = o.customer.fullName.toLowerCase().includes(query);
        const matchEmail = o.customer.email.toLowerCase().includes(query);
        const matchPhone = (o.customer.phone || '').toLowerCase().includes(query);
        const matchCity = (o.customer.city || '').toLowerCase().includes(query);
        const matchState = (o.customer.state || '').toLowerCase().includes(query);
        if (!matchId && !matchName && !matchEmail && !matchPhone && !matchCity && !matchState) return false;
      }

      return true;
    });
  }, [orders, statusFilter, customerFilter, productFilter, dateFilter, minVal, maxVal, adminSearchQuery, localSearch]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Processing':
      case 'Confirmed':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Cancelled':
      case 'Returned':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'New':
      case 'Pending':
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  const handleNavigateToCustomer = (email: string) => {
    setSelectedCustomerIdForView(email);
    setSelectedOrder(null);
    setAdminActiveTab('view_customer');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus);
    setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, 'Cancelled');
    setSelectedOrder(prev => prev ? { ...prev, status: 'Cancelled' } : null);
    setIsCancelConfirmOpen(false);
  };

  // Standard Lifecycle Stages for Progress Timeline
  const LIFECYCLE_STAGES: OrderStatus[] = [
    'New',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const getTimelineStepStatus = (stage: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'Cancelled' || currentStatus === 'Returned') {
      return 'inactive';
    }
    const stageIndex = LIFECYCLE_STAGES.indexOf(stage);
    const currentIndex = LIFECYCLE_STAGES.indexOf(currentStatus);
    if (currentIndex >= stageIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
              Manage Orders
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Fulfilment Control
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Monitor real-time customer orders, dispatch timelines, invoice generation, and automated restock logic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold px-3 py-1.5 bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300">
            Total Orders: <span className="font-bold text-neutral-900 dark:text-white">{orders.length}</span>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300">
            Delivered: <span className="font-bold">{orders.filter(o => o.status === 'Delivered').length}</span>
          </div>
        </div>
      </div>

      {/* 9 Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {allStatuses.map((st) => {
          const count = st.id === 'all' ? orders.length : orders.filter(o => o.status === st.id).length;
          const active = statusFilter === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`
                px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 text-xs
                ${active 
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm scale-102' 
                  : 'bg-white dark:bg-[#111111] text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-850'}
              `}
            >
              <span>{st.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                active 
                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-neutral-900 font-black' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Filters & Search Bar */}
      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search orders by Order ID (#ORD-1048), Customer Name, Email, Phone, or City..."
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          {localSearch && (
            <button 
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row: Date Range, Customer, Product, Price Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Date Filter */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
            </select>
          </div>

          {/* Customer Filter */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Customer</label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Customers</option>
              {uniqueCustomerEmails.map(([email, name]) => (
                <option key={email} value={email}>{name} ({email})</option>
              ))}
            </select>
          </div>

          {/* Product Filter */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Product</label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
            >
              <option value="all">All Products</option>
              {uniqueProductsInOrders.map(pName => (
                <option key={pName} value={pName}>{pName}</option>
              ))}
            </select>
          </div>

          {/* Min - Max Total Range */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-500 mb-1">Order Value ({currency})</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="Min"
                value={minVal}
                onChange={(e) => setMinVal(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
              />
              <span className="text-neutral-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxVal}
                onChange={(e) => setMaxVal(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Product(s) Purchased</th>
                <th className="py-3.5 px-3">Qty</th>
                <th className="py-3.5 px-3">Total</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Location</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-neutral-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);
                  const firstItem = order.items[0];

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40 transition-colors">
                      {/* Order ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                        #{order.id}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleNavigateToCustomer(order.customer.email)}
                          className="text-left group"
                          title="Click to view full customer profile"
                        >
                          <p className="font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {order.customer.fullName}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                            {order.customer.email}
                          </p>
                        </button>
                      </td>

                      {/* Product(s) purchased */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          {firstItem && (
                            <img
                              src={firstItem.img}
                              alt={firstItem.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 object-cover rounded-lg border border-neutral-200 dark:border-neutral-750 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200 block truncate max-w-[130px]">
                              {firstItem?.name}
                            </span>
                            {order.items.length > 1 && (
                              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                                +{order.items.length - 1} other item{order.items.length > 2 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-3 font-bold text-neutral-700 dark:text-neutral-300">
                        {totalQty}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-3 font-black text-neutral-900 dark:text-white">
                        {currency}{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-neutral-500 font-mono text-[11px] whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                          {order.paymentMethod === 'cod' ? (
                            <Banknote className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                          <span className="capitalize">{order.paymentMethod === 'cod' ? 'COD' : 'Card'}</span>
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-3">
                        <span className="text-[11px] text-neutral-600 dark:text-neutral-400 block truncate max-w-[120px]">
                          {order.customer.city}, {order.customer.state}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${getStatusBadge(order.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{order.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Inspect Order Details & Timeline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete record for Order #${order.id}?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-neutral-400 hover:text-rose-500 rounded-lg transition-colors"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Inspector & Invoice Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
          role="dialog"
        >
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-8 text-neutral-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/60 dark:bg-neutral-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                  ORD
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black tracking-tight">Order #{selectedOrder.id}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(!isInvoiceOpen)}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-750 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isInvoiceOpen ? 'Show Details' : 'Print Invoice'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrder(null);
                    setIsInvoiceOpen(false);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isInvoiceOpen ? (
              /* Printable Invoice View */
              <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto bg-white text-neutral-900 font-sans print:p-0">
                <div className="flex items-start justify-between border-b border-neutral-200 pb-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-wider uppercase">UrbanWear Atelier</h2>
                    <p className="text-xs text-neutral-500 mt-1">Official Purchase Invoice & Order Receipt</p>
                    <p className="text-[11px] text-neutral-400">Store Support: support@urbanwear.com</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-black text-indigo-600 block">
                      INVOICE #{selectedOrder.id}
                    </span>
                    <span className="text-xs text-neutral-500 block">
                      Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Payment Status: <b>{selectedOrder.paymentStatus}</b>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Billed To</span>
                    <p className="font-bold text-sm">{selectedOrder.customer.fullName}</p>
                    <p className="text-neutral-600">{selectedOrder.customer.email}</p>
                    <p className="text-neutral-600">{selectedOrder.customer.phone}</p>
                    <p className="text-neutral-600">{selectedOrder.customer.address}</p>
                    <p className="text-neutral-600">{selectedOrder.customer.city}, {selectedOrder.customer.state}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">Dispatch Details</span>
                    <p className="font-semibold">Method: {selectedOrder.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Card Payment'}</p>
                    <p className="text-neutral-600">Window: {selectedOrder.customer.deliveryWindow || 'Standard'}</p>
                    {selectedOrder.customer.notes && (
                      <p className="text-neutral-600 italic">Notes: {selectedOrder.customer.notes}</p>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left text-xs border-t border-b border-neutral-200 py-3">
                  <thead>
                    <tr className="text-neutral-400 uppercase text-[10px]">
                      <th className="py-2.5">Item Description</th>
                      <th className="py-2.5">Size / Color</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price</th>
                      <th className="py-2.5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 font-bold">{item.name}</td>
                        <td className="py-3 text-neutral-500">{item.size} {item.color ? `· ${item.color}` : ''}</td>
                        <td className="py-3 text-center">{item.qty}</td>
                        <td className="py-3 text-right">{currency}{item.price.toFixed(2)}</td>
                        <td className="py-3 text-right font-black">{currency}{(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="space-y-1.5 text-xs text-right max-w-xs ml-auto">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Subtotal:</span>
                    <span className="font-bold">{currency}{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping:</span>
                    <span className="font-bold">{currency}{selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Discount:</span>
                      <span>-{currency}{selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black pt-2 border-t border-neutral-200 text-neutral-900">
                    <span>Grand Total:</span>
                    <span>{currency}{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                  <span className="text-[10px] text-neutral-400">
                    UrbanWear Official Document · Thank you for shopping with us.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
                    >
                      Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Detailed Inspector */
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                
                {/* Visual Order Timeline Tracker */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Order Fulfilment Timeline</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Step by step progression
                    </span>
                  </div>

                  {/* Horizontal visual progress tracker */}
                  <div className="grid grid-cols-6 gap-2 pt-2">
                    {LIFECYCLE_STAGES.map((stage, idx) => {
                      const state = getTimelineStepStatus(stage, selectedOrder.status);
                      const isLast = idx === LIFECYCLE_STAGES.length - 1;

                      return (
                        <div key={stage} className="flex flex-col items-center text-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            state === 'completed'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                          }`}>
                            {state === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] font-bold mt-1.5 leading-tight ${
                            state === 'completed'
                              ? 'text-neutral-900 dark:text-white'
                              : 'text-neutral-400'
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recorded timeline notes */}
                  {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                    <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 space-y-1 text-[11px]">
                      {selectedOrder.timeline.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between text-neutral-500">
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            • {entry.note || entry.status}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-400">
                            {entry.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Updater Card & Quick Order Actions */}
                <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 block">
                      Change Status Stage
                    </span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium mt-0.5">
                      Updating to Cancelled or Returned will automatically restock inventory.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                      className="px-3.5 py-2 bg-white dark:bg-neutral-800 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {allStatuses.filter(s => s.id !== 'all').map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>

                    {selectedOrder.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => setIsCancelConfirmOpen(true)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-bold transition-colors shrink-0"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Cancel Confirmation Prompt */}
                {isCancelConfirmOpen && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Confirm cancellation? Items will be immediately returned to warehouse stock.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancelOrder}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
                      >
                        Yes, Cancel & Restock
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCancelConfirmOpen(false)}
                        className="px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-bold rounded-lg"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer Information Grid with View Customer Action */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                        Customer Information
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNavigateToCustomer(selectedOrder.customer.email)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>View Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-neutral-900 dark:text-white">
                      {selectedOrder.customer.fullName}
                    </p>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <a 
                        href={`mailto:${selectedOrder.customer.email}?subject=Regarding Order #${selectedOrder.id}`} 
                        className="hover:underline text-indigo-600 dark:text-indigo-400"
                      >
                        {selectedOrder.customer.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <a 
                        href={`tel:${selectedOrder.customer.phone}`} 
                        className="hover:underline text-neutral-700 dark:text-neutral-300"
                      >
                        {selectedOrder.customer.phone}
                      </a>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                      Delivery Location & Instructions
                    </span>
                    <div className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedOrder.customer.address}</p>
                        <p className="text-neutral-500">{selectedOrder.customer.city}, {selectedOrder.customer.state}</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-500 pt-1">
                      Delivery Window: <b className="text-neutral-700 dark:text-neutral-300">{selectedOrder.customer.deliveryWindow || 'Standard Delivery'}</b>
                    </p>
                    {selectedOrder.customer.notes && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-xl">
                        Note: {selectedOrder.customer.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items Ordered List */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5 block">
                    Order Items ({selectedOrder.items.length})
                  </span>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={item.img} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-lg border border-neutral-200 dark:border-neutral-750 shrink-0" 
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-neutral-500">
                              Size: <b className="text-neutral-700 dark:text-neutral-300">{item.size}</b> {item.color ? `· Color: ${item.color}` : ''}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-mono">
                              SKU: {item.sku || 'UW-SKU'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-neutral-900 dark:text-white block">
                            {currency}{(item.price * item.qty).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {item.qty} × {currency}{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 bg-neutral-100/70 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-bold">{currency}{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Shipping Fee</span>
                    <span className="font-bold">{currency}{selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount && (
                    <div className="flex justify-between text-rose-500 font-bold">
                      <span>Discount</span>
                      <span>-{currency}{selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black pt-2 border-t border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white">
                    <span>Order Total</span>
                    <span>{currency}{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            )}

            {/* Modal Bottom Footer Actions */}
            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(!isInvoiceOpen)}
                  className="px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isInvoiceOpen ? 'Return to Details' : 'Printable Invoice'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setIsInvoiceOpen(false);
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl text-xs font-bold shadow-sm"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
