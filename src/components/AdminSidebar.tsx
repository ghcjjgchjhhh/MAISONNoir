import React from 'react';
import { useApp, AdminTab } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Shirt, 
  PlusCircle,
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Users, 
  UserCheck,
  Globe, 
  BarChart3, 
  Percent, 
  Tag,
  Sparkles, 
  Bell, 
  Settings, 
  FileText, 
  ExternalLink, 
  X, 
  Sparkle
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen = false, setMobileOpen }) => {
  const { 
    adminActiveTab, 
    currentAdminTab,
    setAdminActiveTab, 
    products, 
    orders, 
    notifications,
    storeSettings,
    setCurrentView,
    openPolicyModal
  } = useApp();

  const activeTab = currentAdminTab || adminActiveTab || 'dashboard';

  // Compute live badges
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'New').length;
  
  // Low stock and out of stock count
  const threshold = storeSettings.lowStockThreshold || 5;
  const alertCount = products.filter(p => {
    if (p.stock <= threshold) return true;
    if (p.variants && p.variants.some(v => v.stock <= threshold)) return true;
    return false;
  }).length;

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const navItems: { id: AdminTab; label: string; icon: any; badge?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Shirt, badge: products.length },
    { id: 'add_product', label: 'Add Product', icon: PlusCircle },
    { id: 'orders', label: 'Manage Orders', icon: ShoppingBag, badge: pendingOrdersCount, badgeColor: 'bg-indigo-600 text-white' },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'alerts', label: 'Stock Alerts', icon: AlertTriangle, badge: alertCount > 0 ? alertCount : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'view_customer', label: 'View Customer', icon: UserCheck },
    { id: 'google_users', label: 'Customers / OAuth', icon: Globe, badge: 'OAuth', badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]' },
    { id: 'discounts', label: 'Discounts', icon: Percent },
    { id: 'add_discount', label: 'Add Discount', icon: Tag },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabClick = (tabId: AdminTab) => {
    setAdminActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen && setMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0c0c0c] border-r border-neutral-200 dark:border-neutral-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-serif font-black text-lg">
              U
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-neutral-900 dark:text-neutral-100 uppercase">
                {storeSettings.storeName || 'UrbanWear'}
              </div>
              <div className="text-[10px] text-neutral-500 font-medium tracking-wide">
                {storeSettings.tagline || 'Style. Wear. Repeat.'}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Storefront Quick View Link */}
        <div className="px-3 pt-3">
          <button
            onClick={() => setCurrentView('store')}
            className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors group"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1.5">
            Store Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'dashboard' && activeTab === 'overview') ||
              (item.id === 'google_users' && activeTab === 'customers');

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group
                  ${isActive 
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-sm' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-200'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white dark:text-neutral-900' : 'text-neutral-500 dark:text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`
                    px-2 py-0.5 text-[10px] font-bold rounded-full
                    ${item.badgeColor || (isActive ? 'bg-neutral-800 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300')}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3 py-1.5">
              Legal & Policies
            </div>
            <button
              onClick={() => {
                openPolicyModal('all');
                if (setMobileOpen) setMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <FileText className="w-4 h-4 text-neutral-500" />
              <span>Store Policies</span>
            </button>
          </div>
        </div>

        {/* Brand footer indicator */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 text-center">
          UrbanWear Admin Suite v2.4
        </div>
      </aside>
    </>
  );
};
