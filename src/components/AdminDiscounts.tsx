import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DiscountCoupon } from '../types';
import { 
  Percent, 
  Plus, 
  Trash2, 
  Tag, 
  Calendar, 
  Check, 
  X, 
  Search, 
  Copy,
  DollarSign
} from 'lucide-react';

export const AdminDiscounts: React.FC = () => {
  const { discounts, addDiscount, toggleDiscount, deleteDiscount, setAdminActiveTab } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<'percentage' | 'fixed'>('percentage');
  const [formValue, setFormValue] = useState<number>(15);
  const [formMinOrder, setFormMinOrder] = useState<number>(50);
  const [formExpiry, setFormExpiry] = useState<string>('2026-12-31');
  const [formUsageLimit, setFormUsageLimit] = useState<number>(100);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addDiscount({
      code: formCode.toUpperCase().trim(),
      type: formType,
      value: Number(formValue),
      minOrderAmount: Number(formMinOrder),
      expiryDate: formExpiry,
      usageLimit: Number(formUsageLimit),
      isActive: true
    });
    setIsModalOpen(false);
    setFormCode('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <span>Discount Codes & Promotions</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Create promotional coupons, set minimum spends, usage caps, and expiration limits.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setAdminActiveTab('add_discount')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discount (Studio)</span>
          </button>
          <button
            onClick={() => {
              setFormCode(`SALE${Math.floor(10 + Math.random() * 90)}`);
              setFormValue(20);
              setIsModalOpen(true);
            }}
            className="px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Quick Coupon
          </button>
        </div>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((coupon) => {
          const isExpired = new Date(coupon.expiryDate) < new Date();
          return (
            <div 
              key={coupon.id} 
              className={`p-5 bg-white dark:bg-[#121212] border rounded-2xl shadow-sm space-y-4 transition-all ${
                coupon.isActive && !isExpired
                  ? 'border-neutral-200/90 dark:border-neutral-800'
                  : 'border-neutral-200/50 dark:border-neutral-800/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    {coupon.type === 'percentage' ? <Percent className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-base text-neutral-900 dark:text-neutral-100 tracking-wider">
                        {coupon.code}
                      </span>
                      <button 
                        onClick={() => handleCopy(coupon.code)}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                        title="Copy code"
                      >
                        {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleDiscount(coupon.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                    coupon.isActive 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {coupon.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex justify-between">
                  <span>Minimum Cart Value:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">${coupon.minOrderAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Usage Redemptions:</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200 font-semibold">{coupon.usedCount} / {coupon.usageLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expires On:</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">{coupon.expiryDate}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isExpired ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {isExpired ? 'Expired' : 'Valid Campaign'}
                </span>

                <button
                  onClick={() => {
                    if (confirm(`Delete coupon "${coupon.code}"?`)) {
                      deleteDiscount(coupon.id);
                    }
                  }}
                  className="p-1 text-neutral-400 hover:text-rose-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" role="dialog">
          <div className="w-full max-w-md bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold">Generate Discount Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH25"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Cash ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                    Discount Value {formType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                    Min Order Spend ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formUsageLimit}
                    onChange={(e) => setFormUsageLimit(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  required
                  value={formExpiry}
                  onChange={(e) => setFormExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
