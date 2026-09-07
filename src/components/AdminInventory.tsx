import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  AlertTriangle, 
  History, 
  Search, 
  Filter, 
  ArrowUpDown, 
  PackagePlus, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { 
    products, 
    inventoryLogs, 
    openRestockModal, 
    adjustStock, 
    storeSettings,
    adminSearchQuery
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'logs'>('matrix');
  const [stockFilter, setStockFilter] = useState<'all' | 'normal' | 'low' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Adjust Modal State
  const [adjustTarget, setAdjustTarget] = useState<{
    productId: number;
    productName: string;
    variantId: string;
    variantLabel: string;
    currentStock: number;
  } | null>(null);
  const [newStockInput, setNewStockInput] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Manual stock adjustment');

  const threshold = storeSettings.lowStockThreshold || 5;

  // Flatten products into variant rows for precise inventory accounting
  interface InventoryRow {
    productId: number;
    productName: string;
    productImg: string;
    category: string;
    variantId: string;
    sku: string;
    size: string;
    color: string;
    stock: number;
    status: 'normal' | 'low' | 'out';
    rawProduct: any;
    rawVariant: any;
  }

  const rows: InventoryRow[] = [];
  products.forEach(p => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach(v => {
        const isOut = v.stock === 0;
        const isLow = v.stock > 0 && v.stock <= threshold;
        rows.push({
          productId: p.id,
          productName: p.name,
          productImg: p.img,
          category: p.cat,
          variantId: v.id,
          sku: v.sku || `${p.sku}-${v.size}`,
          size: v.size,
          color: v.color,
          stock: v.stock,
          status: isOut ? 'out' : isLow ? 'low' : 'normal',
          rawProduct: p,
          rawVariant: v
        });
      });
    } else {
      const isOut = p.stock === 0;
      const isLow = p.stock > 0 && p.stock <= threshold;
      rows.push({
        productId: p.id,
        productName: p.name,
        productImg: p.img,
        category: p.cat,
        variantId: '',
        sku: p.sku || `UW-${p.id}`,
        size: 'Standard',
        color: 'Default',
        stock: p.stock,
        status: isOut ? 'out' : isLow ? 'low' : 'normal',
        rawProduct: p,
        rawVariant: undefined
      });
    }
  });

  // Filter rows
  const query = (adminSearchQuery || searchQuery).toLowerCase().trim();
  const filteredRows = rows.filter(r => {
    if (stockFilter === 'out' && r.status !== 'out') return false;
    if (stockFilter === 'low' && r.status !== 'low') return false;
    if (stockFilter === 'normal' && r.status !== 'normal') return false;

    if (query) {
      const matchProduct = r.productName.toLowerCase().includes(query);
      const matchSku = r.sku.toLowerCase().includes(query);
      const matchSize = r.size.toLowerCase().includes(query);
      const matchColor = r.color.toLowerCase().includes(query);
      if (!matchProduct && !matchSku && !matchSize && !matchColor) return false;
    }
    return true;
  });

  const totalNormalCount = rows.filter(r => r.status === 'normal').length;
  const totalLowCount = rows.filter(r => r.status === 'low').length;
  const totalOutCount = rows.filter(r => r.status === 'out').length;

  const handleOpenAdjustModal = (row: InventoryRow) => {
    setAdjustTarget({
      productId: row.productId,
      productName: row.productName,
      variantId: row.variantId,
      variantLabel: `${row.size} / ${row.color} (${row.sku})`,
      currentStock: row.stock
    });
    setNewStockInput(row.stock);
    setAdjustReason('Physical stock count reconciliation');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;
    adjustStock(adjustTarget.productId, adjustTarget.variantId, Number(newStockInput), adjustReason);
    setAdjustTarget(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <span>Inventory Control & Audit Hub</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono">
              Threshold: {threshold}
            </span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real-time Size x Color stock levels, automatic restock actions, and change audit trails.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'matrix' 
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory Matrix ({rows.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeSubTab === 'logs' 
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History ({inventoryLogs.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'matrix' ? (
        <>
          {/* Summary Pills Filter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setStockFilter('all')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                stockFilter === 'all'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-sm'
                  : 'bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Total Variants</div>
              <div className="text-xl font-black mt-1">{rows.length}</div>
            </button>

            <button
              onClick={() => setStockFilter('normal')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                stockFilter === 'normal'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Normal Stock</span>
              </div>
              <div className="text-xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{totalNormalCount}</div>
            </button>

            <button
              onClick={() => setStockFilter('low')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                stockFilter === 'low'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-amber-50/50'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Low Stock</span>
              </div>
              <div className="text-xl font-black mt-1 text-amber-600 dark:text-amber-400">{totalLowCount}</div>
            </button>

            <button
              onClick={() => setStockFilter('out')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                stockFilter === 'out'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white dark:bg-[#121212] border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-rose-50/50'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>Out of Stock</span>
              </div>
              <div className="text-xl font-black mt-1 text-rose-600 dark:text-rose-400">{totalOutCount}</div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-xl shadow-sm flex items-center gap-2">
            <Search className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by product name, SKU, size (e.g. XL), or color (e.g. Black)..."
              className="w-full text-xs bg-transparent focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Matrix Table */}
          <div className="bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-semibold">Product & Thumbnail</th>
                    <th className="py-3 px-3 font-semibold">SKU</th>
                    <th className="py-3 px-3 font-semibold">Variant (Size / Color)</th>
                    <th className="py-3 px-3 font-semibold">Current Stock</th>
                    <th className="py-3 px-3 font-semibold">Status Indicator</th>
                    <th className="py-3 px-3 font-semibold">Min Stock Threshold</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-400">
                        No inventory items match current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((r, i) => (
                      <tr key={i} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={r.productImg}
                              alt={r.productName}
                              className="w-10 h-10 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-neutral-900 dark:text-neutral-100 block truncate max-w-[200px]">
                                {r.productName}
                              </span>
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                                {r.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                          {r.sku}
                        </td>

                        <td className="py-3 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                          {r.size} / {r.color}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`text-sm font-black ${
                            r.status === 'out' ? 'text-rose-600 dark:text-rose-400' :
                            r.status === 'low' ? 'text-amber-600 dark:text-amber-400' :
                            'text-neutral-900 dark:text-neutral-100'
                          }`}>
                            {r.stock} units
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`
                            px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5
                            ${r.status === 'out' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                              r.status === 'low' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                              'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}
                          `}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            <span>
                              {r.status === 'out' ? 'Out of Stock' : r.status === 'low' ? 'Low Stock Warning' : 'Normal Stock'}
                            </span>
                          </span>
                        </td>

                        <td className="py-3 px-3 text-neutral-500 font-mono text-xs">
                          {threshold} units
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openRestockModal(r.rawProduct, r.rawVariant)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                              title="Instant 1-Click Restock"
                            >
                              <PackagePlus className="w-3.5 h-3.5" />
                              <span>Restock</span>
                            </button>

                            <button
                              onClick={() => handleOpenAdjustModal(r)}
                              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition-colors"
                              title="Manual Adjustment"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Inventory Audit History Tab (Section 6) */
        <div className="bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Inventory Activity & Audit Trail
              </h3>
              <p className="text-xs text-neutral-500">
                Every sale, admin replenishment, and manual count logged with time and reason.
              </p>
            </div>
            <span className="text-xs font-semibold text-neutral-400">
              {inventoryLogs.length} events logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-3 font-semibold">Product & Variant</th>
                  <th className="py-3 px-3 font-semibold">Quantity Change</th>
                  <th className="py-3 px-3 font-semibold">Previous → New Stock</th>
                  <th className="py-3 px-3 font-semibold">Reason</th>
                  <th className="py-3 px-4 font-semibold text-right">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                {inventoryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-neutral-400">
                      No inventory changes logged yet.
                    </td>
                  </tr>
                ) : (
                  inventoryLogs.map((log) => {
                    const isPositive = log.changeQty > 0;
                    return (
                      <tr key={log.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40 transition-colors">
                        <td className="py-3 px-4 text-neutral-500 font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>

                        <td className="py-3 px-3">
                          <p className="font-bold text-neutral-900 dark:text-neutral-100">{log.productName}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{log.variantStr}</p>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 font-bold text-xs ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{isPositive ? `+${log.changeQty}` : log.changeQty} units</span>
                          </span>
                        </td>

                        <td className="py-3 px-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                          {log.previousStock} → <span className="font-bold text-neutral-900 dark:text-neutral-100">{log.newStock}</span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-semibold">
                            {log.reason} {log.orderId ? `(#${log.orderId})` : ''}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right text-neutral-500 text-xs">
                          {log.adminName}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Stock Adjust Modal */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" role="dialog">
          <div className="w-full max-w-md bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold">Manual Stock Count Adjustment</h3>
              <button onClick={() => setAdjustTarget(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="p-5 space-y-4">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl text-xs">
                <p className="font-bold text-neutral-900 dark:text-neutral-100">{adjustTarget.productName}</p>
                <p className="text-neutral-500 font-mono mt-0.5">{adjustTarget.variantLabel}</p>
                <p className="text-[11px] text-neutral-400 mt-1">Current Stock: <b>{adjustTarget.currentStock} units</b></p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                  New Exact Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStockInput}
                  onChange={(e) => setNewStockInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                  Reason for Adjustment
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustTarget(null)}
                  className="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
                >
                  Save Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
