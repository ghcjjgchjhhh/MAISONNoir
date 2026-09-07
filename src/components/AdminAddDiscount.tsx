import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DiscountCode } from '../types';
import { 
  Percent, 
  DollarSign, 
  Tag, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Copy, 
  Layers, 
  AlertCircle, 
  Flame, 
  ShoppingBag, 
  CheckCircle2,
  Trash2,
  TrendingUp,
  BarChart3,
  Users,
  Eye,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export const AdminAddDiscount: React.FC = () => {
  const { 
    discounts, 
    addDiscount, 
    toggleDiscount, 
    deleteDiscount, 
    products, 
    setAdminActiveTab, 
    storeSettings, 
    showToast 
  } = useApp();

  const currency = storeSettings.currencySymbol || '$';

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountCode['type']>('percentage');
  const [value, setValue] = useState<number | ''>(20);
  
  // Date and Time
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState(nextMonth);
  const [endTime, setEndTime] = useState('23:59');

  // Restrictions
  const [minOrderAmount, setMinOrderAmount] = useState<number | ''>(50);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>('');
  const [usageLimit, setUsageLimit] = useState<number | ''>(200);
  const [usageLimitPerCustomer, setUsageLimitPerCustomer] = useState<number | ''>(1);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Flash Sale configuration
  const [isFlashSale, setIsFlashSale] = useState(false);

  // Copied code feedback
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate code
  const handleAutoGenerateCode = () => {
    const prefixes = ['PROMO', 'SAVE', 'VIP', 'FLASH', 'URBAN', 'ATELIER', 'DROP'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 89);
    const generated = `${prefix}${num}`;
    setCode(generated);
    if (!name) setName(`${prefix} ${num}% Exclusive Promotion`);
    showToast(`Generated promotional code: ${generated}`);
  };

  // Toggle category
  const toggleCategory = (catName: string) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(prev => prev.filter(c => c !== catName));
    } else {
      setSelectedCategories(prev => [...prev, catName]);
    }
  };

  // Toggle product
  const toggleProduct = (pId: number) => {
    if (selectedProductIds.includes(pId)) {
      setSelectedProductIds(prev => prev.filter(id => id !== pId));
    } else {
      setSelectedProductIds(prev => [...prev, pId]);
    }
  };

  // Validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Promotion name is required';
    if (!code.trim()) errs.code = 'Coupon code is required';
    if (typeof value !== 'number' || value <= 0) errs.value = 'Valid discount value is required';
    if (discountType === 'percentage' && typeof value === 'number' && (value <= 0 || value > 100)) {
      errs.value = 'Percentage must be between 1% and 100%';
    }
    if (!endDate) errs.endDate = 'Expiration date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Save
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix required fields', 'error');
      return;
    }

    const startDateTime = `${startDate}T${startTime}:00`;
    const endDateTime = `${endDate}T${endTime}:00`;

    const newDiscount: Omit<DiscountCode, 'id'> = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      type: isFlashSale ? 'flash_sale' : discountType,
      value: Number(value),
      startDate: startDateTime,
      endDate: endDateTime,
      expiryDate: endDate, // backwards compatibility
      minOrderAmount: typeof minOrderAmount === 'number' ? minOrderAmount : 0,
      maxDiscountAmount: typeof maxDiscountAmount === 'number' ? maxDiscountAmount : undefined,
      usageLimit: typeof usageLimit === 'number' ? usageLimit : undefined,
      usageLimitPerCustomer: typeof usageLimitPerCustomer === 'number' ? usageLimitPerCustomer : 1,
      selectedProductIds: selectedProductIds.length > 0 ? selectedProductIds : undefined,
      selectedCategories: selectedCategories.length > 0 ? selectedCategories : undefined,
      status: 'active',
      isActive: true,
      usedCount: 0,
      totalDiscountGiven: 0,
      revenueGenerated: 0
    };

    addDiscount(newDiscount);
    showToast(`✓ Promotion ${code.toUpperCase()} created successfully!`, 'success');
    setAdminActiveTab('discounts');
  };

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Overall Discount Analytics across store
  const analyticsSummary = useMemo(() => {
    const totalDiscounts = discounts.length;
    const totalRedemptions = discounts.reduce((sum, d) => sum + (d.usedCount || 0), 0);
    const totalDiscountAmount = discounts.reduce((sum, d) => sum + (d.totalDiscountGiven || (d.usedCount || 0) * 15), 0);
    const revenueGen = discounts.reduce((sum, d) => sum + (d.revenueGenerated || (d.usedCount || 0) * 85), 0);
    const aov = totalRedemptions > 0 ? revenueGen / totalRedemptions : 0;

    return {
      totalDiscounts,
      totalRedemptions,
      totalDiscountAmount,
      revenueGen,
      aov
    };
  }, [discounts]);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdminActiveTab('discounts')}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-850 transition-colors"
            title="Back to Discounts Roster"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Create Promotion & Discount
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Marketing Engine
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Configure coupons, seasonal discounts, category price drops, flash sales, and cart redemption thresholds.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAdminActiveTab('discounts')}
          className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          View All Promotions
        </button>
      </div>

      {/* Analytics Highlights Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Total Redemptions
          </span>
          <span className="text-2xl font-black text-neutral-900 dark:text-white">
            {analyticsSummary.totalRedemptions}
          </span>
          <span className="text-[10px] text-emerald-600 block font-semibold">Across all campaigns</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Discount Value Given
          </span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {currency}{analyticsSummary.totalDiscountAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-neutral-400 block">Customer savings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Attributed Revenue
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {currency}{analyticsSummary.revenueGen.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-neutral-400 block">Generated via coupons</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            Promo AOV
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {currency}{analyticsSummary.aov.toFixed(2)}
          </span>
          <span className="text-[10px] text-neutral-400 block">Avg order with discount</span>
        </div>
      </div>

      {/* Main Grid: Form (2 cols) & Live Preview + Coupon Summary (1 col) */}
      <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Discount Type & Information */}
          <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span>1. Discount Type & Core Information</span>
              </h2>
              <span className="text-[11px] text-neutral-400">Section 32 Specifications</span>
            </div>

            {/* 5 Discount Types Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Select Promotion Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'percentage', label: 'Percentage (%)', desc: 'e.g. 20% OFF order', icon: Percent },
                  { id: 'fixed', label: 'Fixed Cash ($)', desc: 'e.g. $25.00 OFF order', icon: DollarSign },
                  { id: 'product', label: 'Product Discount', desc: 'Applies to specific pieces', icon: ShoppingBag },
                  { id: 'category', label: 'Category Discount', desc: 'Applies to entire category', icon: Layers },
                  { id: 'flash_sale', label: 'Flash Sale Event', desc: 'Limited timer & countdown', icon: Flame }
                ].map(item => {
                  const Icon = item.icon;
                  const isCurrent = isFlashSale ? item.id === 'flash_sale' : discountType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.id === 'flash_sale') {
                          setIsFlashSale(true);
                          setDiscountType('flash_sale');
                        } else {
                          setIsFlashSale(false);
                          setDiscountType(item.id as any);
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-400'}`} />
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block leading-tight">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Promotion Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. End of Summer Flash Sale"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    errors.name ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-750'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      Coupon Code <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateCode}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto Generate</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER20"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border font-mono font-bold text-sm tracking-wider uppercase bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                      errors.code ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-750'
                    }`}
                  />
                  {errors.code && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.code}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Discount Value {discountType === 'percentage' || isFlashSale ? '(%)' : `(${currency})`} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-neutral-400 text-xs font-bold">
                      {discountType === 'percentage' || isFlashSale ? '%' : currency}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={discountType === 'percentage' || isFlashSale ? 100 : undefined}
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value === '' ? '' : Number(e.target.value));
                        if (errors.value) setErrors(prev => ({ ...prev, value: '' }));
                      }}
                      placeholder={discountType === 'percentage' ? '20' : '25'}
                      className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        errors.value ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-750'
                      }`}
                    />
                  </div>
                  {errors.value && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.value}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Internal Description & Customer Notice
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Valid on all streetwear apparel and accessories above minimum cart spend."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Start and End Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" /> Start Date & Time
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-500" /> Expiration Date & Time (Auto-Expires)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Restrictions & Eligibility */}
          <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>2. Discount Restrictions & Eligibility</span>
              </h2>
              <span className="text-[11px] text-neutral-400">Control usage & boundaries</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Minimum Order Amount ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="50"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
                <span className="text-[10px] text-neutral-400 block mt-1">Cart total required before coupon applies</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Max Discount Amount Cap ({currency}) <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxDiscountAmount}
                  onChange={(e) => setMaxDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
                <span className="text-[10px] text-neutral-400 block mt-1">Caps max savings on large percentage orders</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Maximum Total Uses (Global Limit)
                </label>
                <input
                  type="number"
                  min="1"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="200"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
                <span className="text-[10px] text-neutral-400 block mt-1">Campaign will expire once redemptions are exhausted</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Maximum Uses Per Customer
                </label>
                <input
                  type="number"
                  min="1"
                  value={usageLimitPerCustomer}
                  onChange={(e) => setUsageLimitPerCustomer(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-750 text-xs font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
                <span className="text-[10px] text-neutral-400 block mt-1">Prevents repeated abuse by a single user</span>
              </div>
            </div>

            {/* Category Restrictions (if Category discount or specific) */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Apply to Specific Categories ({selectedCategories.length === 0 ? 'All Categories' : selectedCategories.join(', ')})
              </label>
              <div className="flex flex-wrap gap-2">
                {['men', 'women', 'unisex', 'accessories'].map(cat => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border capitalize transition-all ${
                        active
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Restrictions (if Product discount or specific) */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Apply to Specific Products ({selectedProductIds.length === 0 ? 'All Products' : `${selectedProductIds.length} Selected`})
                </label>
                {selectedProductIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    className="text-[11px] font-bold text-rose-500 hover:underline"
                  >
                    Clear Product Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {products.map(p => {
                  const selected = selectedProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProduct(p.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover border border-black/10 shrink-0"
                      />
                      <span className="text-[11px] font-bold truncate flex-1">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Coupon Ticket Preview Card & Creation Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-5 sticky top-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Live Ticket Preview</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                🟢 Ready
              </span>
            </div>

            {/* Visual Voucher / Coupon Ticket Card */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-indigo-900 via-neutral-900 to-black text-white p-5 shadow-xl space-y-4">
              {/* Ticket Notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                  {storeSettings.storeName || 'UrbanWear Atelier'}
                </span>
                {isFlashSale && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Flash Sale
                  </span>
                )}
              </div>

              <div>
                <span className="text-3xl font-black tracking-tight text-white block">
                  {discountType === 'percentage' || isFlashSale
                    ? `${value || 0}% OFF`
                    : `${currency}${value || 0} OFF`}
                </span>
                <p className="text-xs font-semibold text-neutral-300 mt-1">
                  {name || 'Promotional Discount'}
                </p>
              </div>

              {/* Coupon Code Pill */}
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 block">
                    Use Code At Checkout
                  </span>
                  <span className="font-mono font-black text-base tracking-widest text-white">
                    {code || 'COUPONCODE'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Restrictions Summary */}
              <div className="space-y-1 text-[11px] text-neutral-400 border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span>Minimum Spend:</span>
                  <span className="text-white font-bold">{currency}{minOrderAmount || 0}</span>
                </div>
                {maxDiscountAmount && (
                  <div className="flex justify-between">
                    <span>Max Savings Cap:</span>
                    <span className="text-white font-bold">{currency}{maxDiscountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <span className="text-white font-bold">{endDate}</span>
                </div>
              </div>
            </div>

            {/* Auto-Expiration Guarantee Note */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-[11px] space-y-1 text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated Expiry & Verification</span>
              </div>
              <p className="leading-relaxed">
                Our checkout system automatically verifies coupon expiration date, usage limits, and category restrictions before authorizing payment.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save & Activate Promotion</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminActiveTab('discounts')}
                className="w-full py-2.5 bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel & Return
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};
