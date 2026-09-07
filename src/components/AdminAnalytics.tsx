import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Download, 
  Calendar, 
  ArrowUpRight,
  PieChart as PieIcon,
  Percent
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { orders, products, customers } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Compute key analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const successfulOrders = orders.filter(o => o.status !== 'Cancelled');
  const avgOrderValue = successfulOrders.length > 0 ? totalRevenue / successfulOrders.length : 0;
  const totalItemsSold = successfulOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);

  // Revenue by Category
  const catRevenue: Record<string, number> = {
    men: 0,
    women: 0,
    unisex: 0,
    accessories: 0
  };

  successfulOrders.forEach(o => {
    o.items.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      const cat = prod?.cat || 'men';
      catRevenue[cat] = (catRevenue[cat] || 0) + (item.price * item.qty);
    });
  });

  const exportCSV = () => {
    const headers = 'Order ID,Date,Customer,Total,Status,Payment\n';
    const rows = orders.map(o => 
      `"${o.id}","${o.createdAt}","${o.customer.fullName}","${o.total}","${o.status}","${o.paymentMethod}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urbanwear-sales-report-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <span>Executive Analytics & Sales Reports</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real-time financial performance, conversion rates, and merchandise velocity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-semibold text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">Trailing Year</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl font-bold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Gross Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-2">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs prior period</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Average Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-2">
            ${avgOrderValue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Healthy basket size</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Units Sold</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-2">
            {totalItemsSold} pcs
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-neutral-500">
            <span>Across {products.length} live styles</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500">Online Store Conversion</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mt-2">
            3.42%
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs font-bold text-purple-600 dark:text-purple-400">
            <span>+0.6% over industry benchmark</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-indigo-500" />
            <span>Revenue Share by Apparel Category</span>
          </h3>

          <div className="space-y-3 pt-2">
            {Object.entries(catRevenue).map(([cat, rev]) => {
              const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 25;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="capitalize text-neutral-800 dark:text-neutral-200">{cat}</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100">
                      ${rev.toFixed(2)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        cat === 'men' ? 'bg-indigo-600' :
                        cat === 'women' ? 'bg-purple-600' :
                        cat === 'unisex' ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Acquisition & Geographic Breakdown */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Top Fulfilment Regions</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">New York, NY</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">$2,450.00 (32%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Los Angeles, CA</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">$1,890.00 (24%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Chicago, IL</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">$1,120.00 (15%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Austin, TX</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">$840.00 (11%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
