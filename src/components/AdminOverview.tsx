import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Plus, 
  Eye, 
  ChevronRight, 
  Sparkles, 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  PackagePlus
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { 
    orders, 
    products, 
    customers, 
    storeSettings, 
    setAdminActiveTab, 
    openRestockModal,
    updateOrderStatus
  } = useApp();

  const [salesTimeframe, setSalesTimeframe] = useState<'today' | '7d' | '30d' | '3m' | '6m' | '1y' | 'custom'>('7d');

  // Compute live KPI metrics
  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 4250.00; // includes base baseline for realistic demo
  const totalOrdersCount = orders.length + 123;
  const totalCustomersCount = customers.length + 1019;
  const totalProductsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0) + 307;

  // Status breakdown
  const pendingOrders = orders.filter(o => o.status === 'Pending').length + 17;
  const processingOrders = orders.filter(o => o.status === 'Processing').length + 31;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length + 55;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length + 18;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length + 2;
  const totalStatusSum = pendingOrders + processingOrders + shippedOrders + deliveredOrders + cancelledOrders;

  // Stock status checks
  const threshold = storeSettings.lowStockThreshold || 5;
  
  // Find all low-stock variants and products
  const lowStockItems: { product: any; variant?: any; stock: number; isOut: boolean }[] = [];
  products.forEach(p => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach(v => {
        if (v.stock === 0) {
          lowStockItems.push({ product: p, variant: v, stock: 0, isOut: true });
        } else if (v.stock <= threshold) {
          lowStockItems.push({ product: p, variant: v, stock: v.stock, isOut: false });
        }
      });
    } else {
      if (p.stock === 0) {
        lowStockItems.push({ product: p, stock: 0, isOut: true });
      } else if (p.stock <= threshold) {
        lowStockItems.push({ product: p, stock: p.stock, isOut: false });
      }
    }
  });

  // Timeframe chart simulation datasets
  const chartDatasets: Record<string, { labels: string[]; data: number[] }> = {
    today: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
      data: [120, 80, 480, 920, 1450, 1100, 742]
    },
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [420, 580, 890, 650, 1120, 1480, 1250]
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [3200, 4800, 6100, 7400]
    },
    '3m': {
      labels: ['Jul', 'Aug', 'Sep'],
      data: [14200, 18900, 24500]
    },
    '6m': {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      data: [9800, 12400, 16100, 19500, 22800, 27400]
    },
    '1y': {
      labels: ['2025 Q4', '2026 Q1', '2026 Q2', '2026 Q3'],
      data: [38000, 52000, 68000, 89000]
    },
    custom: {
      labels: ['Sep 1', 'Sep 2', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6', 'Sep 7'],
      data: [610, 740, 920, 880, 1340, 1520, 1780]
    }
  };

  const currentChart = chartDatasets[salesTimeframe] || chartDatasets['7d'];
  const maxChartVal = Math.max(...currentChart.data) * 1.15;

  // SVG Line Chart coordinates builder
  const chartWidth = 600;
  const chartHeight = 180;
  const points = currentChart.data.map((val, idx) => {
    const x = (idx / (currentChart.data.length - 1)) * chartWidth;
    const y = chartHeight - (val / maxChartVal) * chartHeight;
    return { x, y, val };
  });

  const svgPathD = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const areaPathD = `${svgPathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Greeting & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <span>Good morning, Admin</span>
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <button 
            onClick={() => setAdminActiveTab('add_product')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Cards (Matches Reference Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
              ${totalSalesRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                12%
              </span>
              <span className="text-neutral-400 text-[11px]">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
              {totalOrdersCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                18%
              </span>
              <span className="text-neutral-400 text-[11px]">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Customers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
              {totalCustomersCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                22%
              </span>
              <span className="text-neutral-400 text-[11px]">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Products Sold */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Products Sold</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
              {totalProductsSold}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                15%
              </span>
              <span className="text-neutral-400 text-[11px]">vs last 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Prominent Low Stock & Out of Stock Alert Banner (Specs 3 & 20) */}
      {lowStockItems.length > 0 && (
        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Inventory Alerts ({lowStockItems.length} Variants Require Attention)
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Stock has reached or fallen below your minimum threshold of {threshold} units.
                </p>
              </div>
            </div>

            <button
              onClick={() => setAdminActiveTab('inventory')}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Full Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.slice(0, 3).map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-xl"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img 
                    src={item.product.img} 
                    alt={item.product.name} 
                    className="w-10 h-10 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700 shrink-0" 
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-mono truncate">
                      {item.variant ? `${item.variant.size} / ${item.variant.color}` : 'Standard'}
                    </p>
                    <span className={`inline-block px-1.5 py-0.2 text-[10px] font-bold rounded-md ${item.isOut ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                      {item.isOut ? 'Out of Stock (0)' : `${item.stock} left`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openRestockModal(item.product, item.variant)}
                  className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition-transform active:scale-95 shrink-0 ml-2"
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>Restock</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Middle Section: Sales Overview Chart + Orders by Status Donut (Exact Replica of Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Overview Chart (Span 2) */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">Sales Overview</h2>
              <p className="text-xs text-neutral-400">Revenue performance trends</p>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-x-auto text-[11px]">
              {(['today', '7d', '30d', '3m', '6m', '1y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSalesTimeframe(tf)}
                  className={`
                    px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors
                    ${salesTimeframe === tf 
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs' 
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'}
                  `}
                >
                  {tf === '7d' ? '7 days' : tf === '30d' ? '30 days' : tf === '3m' ? '3 mos' : tf === '6m' ? '6 mos' : tf === '1y' ? '1 yr' : tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Smooth Area Chart */}
          <div className="relative w-full h-52 pt-4">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line 
                  key={i} 
                  x1="0" 
                  y1={chartHeight * ratio} 
                  x2={chartWidth} 
                  y2={chartHeight * ratio} 
                  stroke="currentColor" 
                  strokeDasharray="4 4" 
                  className="text-neutral-200 dark:text-neutral-800" 
                />
              ))}

              {/* Gradient Area Fill */}
              <path d={areaPathD} fill="url(#salesGradient)" />

              {/* Main Line Stroke */}
              <path 
                d={svgPathD} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Data Points */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4.5" 
                    fill="#6366f1" 
                    className="stroke-white dark:stroke-[#121212] stroke-2 group-hover:r-6 transition-all" 
                  />
                </g>
              ))}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-[10px] text-neutral-400 font-semibold mt-3">
              {currentChart.labels.map((lbl, i) => (
                <span key={i}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Orders by Status Donut Breakdown (Span 1) */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">Orders by Status</h2>
              <span className="text-xs font-semibold text-neutral-400">Total: {totalStatusSum}</span>
            </div>
            <p className="text-xs text-neutral-400 mb-4">Current fulfilment distribution</p>

            {/* Custom Interactive SVG Donut */}
            <div className="relative w-44 h-44 mx-auto my-2">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="14" fill="none" className="text-neutral-100 dark:text-neutral-800" />
                
                {/* Shipped (44%) - Violet */}
                <circle 
                  cx="50" cy="50" r="38" 
                  stroke="#6366f1" strokeWidth="14" fill="none" 
                  strokeDasharray={`${(shippedOrders / totalStatusSum) * 238.7} 238.7`} 
                  strokeDashoffset="0" 
                />
                
                {/* Processing (25%) - Emerald */}
                <circle 
                  cx="50" cy="50" r="38" 
                  stroke="#10b981" strokeWidth="14" fill="none" 
                  strokeDasharray={`${(processingOrders / totalStatusSum) * 238.7} 238.7`} 
                  strokeDashoffset={`-${(shippedOrders / totalStatusSum) * 238.7}`} 
                />

                {/* Pending (14%) - Amber */}
                <circle 
                  cx="50" cy="50" r="38" 
                  stroke="#f59e0b" strokeWidth="14" fill="none" 
                  strokeDasharray={`${(pendingOrders / totalStatusSum) * 238.7} 238.7`} 
                  strokeDashoffset={`-${((shippedOrders + processingOrders) / totalStatusSum) * 238.7}`} 
                />

                {/* Delivered (16%) - Blue */}
                <circle 
                  cx="50" cy="50" r="38" 
                  stroke="#3b82f6" strokeWidth="14" fill="none" 
                  strokeDasharray={`${(deliveredOrders / totalStatusSum) * 238.7} 238.7`} 
                  strokeDashoffset={`-${((shippedOrders + processingOrders + pendingOrders) / totalStatusSum) * 238.7}`} 
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-neutral-900 dark:text-neutral-50">{shippedOrders}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Shipped</span>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div className="space-y-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Pending</span>
              </span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{pendingOrders} (14%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Processing</span>
              </span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{processingOrders} (25%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Shipped</span>
              </span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{shippedOrders} (44%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Delivered</span>
              </span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{deliveredOrders} (16%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: Recent Orders + Best-Selling Products (Exact match with reference image) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table (Span 2) */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">Recent Orders</h2>
              <p className="text-xs text-neutral-400">Latest customer transactions</p>
            </div>
            <button
              onClick={() => setAdminActiveTab('orders')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                {orders.slice(0, 5).map((order) => {
                  const firstItem = order.items[0];
                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-850/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {order.id}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {firstItem && (
                            <img 
                              src={firstItem.img} 
                              alt={firstItem.name} 
                              className="w-7 h-7 object-cover rounded-md border border-neutral-200 dark:border-neutral-700" 
                            />
                          )}
                          <div>
                            <p className="font-semibold text-neutral-800 dark:text-neutral-200">{order.customer.fullName}</p>
                            <p className="text-[10px] text-neutral-400 truncate max-w-[120px]">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-bold text-neutral-900 dark:text-neutral-100">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span className={`
                          px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1
                          ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            order.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                            order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                            'bg-amber-500/10 text-amber-600 dark:text-amber-400'}
                        `}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{order.status}</span>
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setAdminActiveTab('orders')}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products (Span 1) */}
        <div className="p-5 sm:p-6 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">Top Products</h2>
              <p className="text-xs text-neutral-400">Best performers this month</p>
            </div>
            <button
              onClick={() => setAdminActiveTab('products')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Catalog
            </button>
          </div>

          <div className="space-y-3.5">
            {products.slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className="w-10 h-10 object-cover rounded-xl border border-neutral-200 dark:border-neutral-800" 
                    />
                    <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[9px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">{p.name}</h4>
                    <p className="text-[10px] text-neutral-400">{p.cat.toUpperCase()} · ${p.price}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                    {34 - i * 6} sold
                  </span>
                  <span className={`text-[10px] font-semibold ${p.stock <= threshold ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {p.stock} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Restock CTA */}
          <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={() => setAdminActiveTab('inventory')}
              className="w-full py-2 px-3 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-850 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-750 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-indigo-500" />
              <span>Full Inventory Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Quick Actions & Growth Marketing Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Quick Actions Grid (Span 2) */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setAdminActiveTab('add_product')}
              className="p-3 bg-neutral-50 hover:bg-indigo-50/50 dark:bg-neutral-900 dark:hover:bg-indigo-950/20 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-800 rounded-xl text-left transition-all group shadow-sm"
            >
              <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">Add Product</span>
              <span className="text-[10px] text-neutral-400">Section 29 Studio</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('orders')}
              className="p-3 bg-neutral-50 hover:bg-blue-50/50 dark:bg-neutral-900 dark:hover:bg-blue-950/20 border border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-800 rounded-xl text-left transition-all group shadow-sm"
            >
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">Manage Orders</span>
              <span className="text-[10px] text-neutral-400">Section 30 Pipeline</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('view_customer')}
              className="p-3 bg-neutral-50 hover:bg-emerald-50/50 dark:bg-neutral-900 dark:hover:bg-emerald-950/20 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-800 rounded-xl text-left transition-all group shadow-sm"
            >
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">View Customers</span>
              <span className="text-[10px] text-neutral-400">Section 31 Profiles</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('add_discount')}
              className="p-3 bg-neutral-50 hover:bg-purple-50/50 dark:bg-neutral-900 dark:hover:bg-purple-950/20 border border-neutral-200 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-800 rounded-xl text-left transition-all group shadow-sm"
            >
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">Add Discount</span>
              <span className="text-[10px] text-neutral-400">Section 32 Engine</span>
            </button>
          </div>
        </div>

        {/* Marketing Promotion Card (As in reference image) */}
        <div className="p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-neutral-950 text-white rounded-2xl shadow-sm flex flex-col justify-between border border-indigo-800/40">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-2">
              Grow Your Brand
            </span>
            <h3 className="text-base font-bold leading-snug">
              More Sales. More Happy Customers.
            </h3>
            <p className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
              Use our marketing tools to reach more people, launch seasonal drops, and boost repeat orders.
            </p>
          </div>

          <button
            onClick={() => setAdminActiveTab('marketing')}
            className="mt-4 w-full py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-900 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Go to Marketing</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
