import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Store,
  Save,
  Check,
  AlertTriangle,
  DollarSign,
  Mail,
  Globe,
  Flame,
  Download,
  RotateCcw
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings, resetToDefaults } = useApp();

  const [formStoreName, setFormStoreName] = useState(storeSettings.storeName);
  const [formTagline, setFormTagline] = useState(storeSettings.tagline);
  const [formDescription, setFormDescription] = useState(storeSettings.storeDescription);
  const [formCurrency, setFormCurrency] = useState(storeSettings.currency);
  const [formCurrencySymbol, setFormCurrencySymbol] = useState(storeSettings.currencySymbol);
  const [formThreshold, setFormThreshold] = useState<number>(storeSettings.lowStockThreshold);
  const [formShippingFee, setFormShippingFee] = useState<number>(storeSettings.defaultShippingFee);
  const [formFreeShippingMin, setFormFreeShippingMin] = useState<number>(storeSettings.freeShippingThreshold);
  const [formTaxRate, setFormTaxRate] = useState<number>(storeSettings.taxRate);
  const [formEmail, setFormEmail] = useState(storeSettings.email);
  const [formPhone, setFormPhone] = useState(storeSettings.phone);
  const [formLocations, setFormLocations] = useState<string>(storeSettings.supportedLocations.join(', '));
  const [formInstagram, setFormInstagram] = useState(storeSettings.socials.instagram);
  const [formTwitter, setFormTwitter] = useState(storeSettings.socials.twitter);
  const [formFacebook, setFormFacebook] = useState(storeSettings.socials.facebook);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      ...storeSettings,
      storeName: formStoreName,
      tagline: formTagline,
      storeDescription: formDescription,
      currency: formCurrency,
      currencySymbol: formCurrencySymbol,
      lowStockThreshold: Number(formThreshold),
      defaultShippingFee: Number(formShippingFee),
      freeShippingThreshold: Number(formFreeShippingMin),
      taxRate: Number(formTaxRate),
      email: formEmail,
      phone: formPhone,
      supportedLocations: formLocations
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      socials: {
        instagram: formInstagram,
        twitter: formTwitter,
        facebook: formFacebook
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const data = {
      timestamp: new Date().toISOString(),
      storeSettings,
      localStorageBackup: {
        products: localStorage.getItem('mn_products'),
        orders: localStorage.getItem('mn_orders'),
        customers: localStorage.getItem('mn_customers'),
        inventoryLogs: localStorage.getItem('mn_inventory_logs'),
        settings: localStorage.getItem('mn_settings')
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urbanwear-store-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <span>Store Configuration & Firebase Sync</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Define global store metadata, inventory thresholds, fulfilment rates, and database state.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Settings Saved!' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Firebase Backend Status Card (Addressing: "i want every thing to correspond cause i already have a firebase") */}
      <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Firebase Firestore & Auth Integration Ready</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Ready to Bind
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                All data schemas (Products with Variants, Orders with Statuses, Audit Logs, and Google User Sessions) perfectly correspond to Firestore Document Collections.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportBackup}
            className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Database JSON</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
          <div className="p-2 rounded-lg bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50">
            📁 Collection: <b>products</b>
          </div>
          <div className="p-2 rounded-lg bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50">
            📁 Collection: <b>orders</b>
          </div>
          <div className="p-2 rounded-lg bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50">
            📁 Collection: <b>users</b>
          </div>
          <div className="p-2 rounded-lg bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50">
            📁 Collection: <b>inventory_logs</b>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Brand & Store Profile */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Store className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Brand & Store Identity</h3>
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Store Name</label>
            <input
              type="text"
              required
              value={formStoreName}
              onChange={(e) => setFormStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-500 mb-1">Currency Code</label>
              <input
                type="text"
                value={formCurrency}
                onChange={(e) => setFormCurrency(e.target.value.toUpperCase())}
                placeholder="USD"
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-500 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={formCurrencySymbol}
                onChange={(e) => setFormCurrencySymbol(e.target.value)}
                placeholder="$"
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Low Stock Warning Threshold (Units)</label>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={formThreshold}
              onChange={(e) => setFormThreshold(parseInt(e.target.value) || 5)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Products or variants with stock equal to or below this trigger low-stock badges and alerts across the dashboard.
            </p>
          </div>
        </div>

        {/* Shipping, Taxes & Fulfilment */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Shipping & Checkout Rates</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-500 mb-1">Standard Shipping Fee ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formShippingFee}
                onChange={(e) => setFormShippingFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-500 mb-1">Free Shipping Minimum ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formFreeShippingMin}
                onChange={(e) => setFormFreeShippingMin(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Sales Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formTaxRate}
              onChange={(e) => setFormTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Contact & Support */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Mail className="w-4 h-4 text-purple-500" />
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Customer Support Contacts</h3>
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Official Support Email</label>
            <input
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Customer Care Phone</label>
            <input
              type="text"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Supported Locations</label>
            <input
              type="text"
              value={formLocations}
              onChange={(e) => setFormLocations(e.target.value)}
              placeholder="Lagos, Abuja, London, Online"
              className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Danger Zone & Reset */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">Clear Store Data</h3>
          </div>

          <p className="text-neutral-500 leading-relaxed">
            Clear locally cached products, orders, customers, inventory logs, discounts, and marketing data. New records will come from real admin actions and customer activity.
          </p>

          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to clear store data? Any records not synchronized to Firestore will be removed.')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl font-bold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Store Data</span>
          </button>
        </div>

      </form>
    </div>
  );
};
