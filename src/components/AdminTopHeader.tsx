import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ExternalLink, 
  CheckCheck, 
  AlertTriangle, 
  Package, 
  ShoppingBag, 
  ChevronDown, 
  LogOut,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface AdminTopHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AdminTopHeader: React.FC<AdminTopHeaderProps> = ({ onOpenMobileMenu }) => {
  const { 
    adminSearchQuery, 
    setAdminSearchQuery, 
    notifications, 
    unreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setAdminActiveTab,
    theme, 
    toggleTheme, 
    user, 
    logout,
    setCurrentView
  } = useApp();

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notifId: string, type: string) => {
    markNotificationAsRead(notifId);
    setIsNotifDropdownOpen(false);
    if (type === 'low_stock' || type === 'out_of_stock') {
      setAdminActiveTab('alerts');
    } else if (type === 'new_order') {
      setAdminActiveTab('orders');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800/80 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left side: Hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={adminSearchQuery}
            onChange={(e) => setAdminSearchQuery(e.target.value)}
            placeholder="Search products, orders, customers, SKUs..."
            className="w-full pl-10 pr-9 py-2 bg-neutral-100/80 dark:bg-neutral-900/90 border border-transparent focus:border-indigo-500/50 dark:focus:border-indigo-500/50 rounded-xl text-xs font-medium text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {adminSearchQuery && (
            <button
              onClick={() => setAdminSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Quick Return to Storefront */}
        <button
          onClick={() => setCurrentView('store')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-750 transition-colors"
          title="Open live customer store"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-850 rounded-xl transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
        </button>

        {/* Notifications Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-850 rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50">
              <div className="p-3.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                    Notifications
                  </span>
                  {unreadNotificationCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      {unreadNotificationCount} unread
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-neutral-400 text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id, notif.type)}
                      className={`p-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-850 cursor-pointer transition-colors flex items-start gap-3 ${!notif.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'out_of_stock' ? (
                          <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        ) : notif.type === 'low_stock' ? (
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <Package className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-neutral-400 shrink-0">{notif.date}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-neutral-100 dark:border-neutral-800 text-center bg-neutral-50/50 dark:bg-neutral-900/50">
                <button
                  onClick={() => {
                    setAdminActiveTab('notifications');
                    setIsNotifDropdownOpen(false);
                  }}
                  className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile & Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-850 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neutral-800 to-neutral-950 dark:from-neutral-700 dark:to-neutral-900 text-white font-bold text-xs flex items-center justify-center shadow-inner">
              AD
            </div>
            <div className="hidden md:block text-left pr-1">
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[110px]">
                {user?.name || 'Store Owner'}
              </div>
              <div className="text-[10px] text-neutral-400 font-medium">Admin</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden py-1.5 animate-fade-in z-50 text-xs">
              <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <p className="font-bold text-neutral-900 dark:text-neutral-100 truncate">{user?.name || 'Store Owner'}</p>
                <p className="text-neutral-400 text-[11px] truncate">{user?.email || 'admin@urbanwear.com'}</p>
              </div>

              <button
                onClick={() => {
                  setAdminActiveTab('settings');
                  setIsProfileDropdownOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                <span>Store Settings</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('store');
                  setIsProfileDropdownOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-2.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                <span>Open Storefront</span>
              </button>

              <div className="border-t border-neutral-100 dark:border-neutral-800 my-1"></div>

              <button
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  logout();
                }}
                className="w-full px-3.5 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2.5 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
