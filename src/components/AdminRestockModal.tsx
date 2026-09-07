import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, PackagePlus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AdminRestockModal: React.FC = () => {
  const { restockTarget, closeRestockModal, restockVariant } = useApp();
  const [qtyToAdd, setQtyToAdd] = useState<number>(20);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [reason, setReason] = useState<string>('Restock by Admin');

  useEffect(() => {
    if (restockTarget) {
      if (restockTarget.variant) {
        setSelectedVariantId(restockTarget.variant.id);
      } else if (restockTarget.product.variants && restockTarget.product.variants.length > 0) {
        // Default to the first low-stock or out-of-stock variant
        const lowVar = restockTarget.product.variants.find(v => v.stock <= 5) || restockTarget.product.variants[0];
        setSelectedVariantId(lowVar.id);
      }
      setQtyToAdd(20);
    }
  }, [restockTarget]);

  if (!restockTarget) return null;

  const { product } = restockTarget;
  const currentVariant = product.variants?.find(v => v.id === selectedVariantId) || restockTarget.variant;
  const currentStock = currentVariant ? currentVariant.stock : product.stock;
  const newStock = Math.max(0, currentStock + Number(qtyToAdd || 0));

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qtyToAdd <= 0) return;
    restockVariant(product.id, selectedVariantId, Number(qtyToAdd), reason);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Restock Inventory</h3>
              <p className="text-xs text-neutral-500">Instant variant replenishment & audit logging</p>
            </div>
          </div>
          <button
            onClick={closeRestockModal}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleRestockSubmit} className="p-6 space-y-5">
          
          {/* Product Summary Card */}
          <div className="flex items-center gap-4 p-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <img 
              src={product.img} 
              alt={product.name} 
              className="w-16 h-16 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700 shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {product.brand || 'UrbanWear'}
              </span>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {product.name}
              </h4>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                SKU: {currentVariant?.sku || product.sku || 'UW-SKU'}
              </p>
            </div>
          </div>

          {/* Variant Selector (if product has multiple variants) */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Select Variant / Size / Color
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-indigo-500"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    Size {v.size} — {v.color} ({v.sku}) · Current Stock: {v.stock}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Current vs New Stock Calculator */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-neutral-100/70 dark:bg-neutral-900/80 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Current Stock</span>
              <span className={`text-xl font-bold mt-1 block ${currentStock === 0 ? 'text-red-600 dark:text-red-400' : currentStock <= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                {currentStock}
              </span>
            </div>

            <div className="flex items-center justify-center text-neutral-400">
              <span className="text-base font-bold">+</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">New Total</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {newStock}
              </span>
            </div>
          </div>

          {/* Quantity to Add Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Quantity to Add
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="5000"
                value={qtyToAdd}
                onChange={(e) => setQtyToAdd(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-xl text-base font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="20"
                required
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {[10, 20, 50, 100].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQtyToAdd(num)}
                    className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded text-neutral-700 dark:text-neutral-300 transition-colors"
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Restock Reason */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              Restock Reason / Supplier Notes
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Factory Batch #489, Restock by Admin, Supplier delivery"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={closeRestockModal}
              className="flex-1 py-3 px-4 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>Add Stock ({qtyToAdd} Units)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
