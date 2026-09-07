import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Compass, 
  ShoppingBag, 
  User, 
  Search,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

interface MobileBottomNavProps {
  onSearchClick?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onSearchClick }) => {
  const { 
    currentView, 
    setCurrentView, 
    cartCount, 
    setIsCartOpen, 
    user, 
    isAdmin, 
    setIsAuthModalOpen,
    isCartOpen,
    isCheckoutOpen
  } = useApp();

  // Hide bottom bar during full-screen modal or checkout to ensure maximum space & focus
  if (isCheckoutOpen) return null;

  const handleNav = (anchor: string) => {
    if (currentView === 'admin') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.querySelector(anchor);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(anchor);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-neutral-200/80 dark:border-neutral-800/80 transition-colors duration-200"
      style={{
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 12px))',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        touchAction: 'manipulation'
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        
        {/* 1. Home / Storefront */}
        <button
          onClick={() => {
            if (currentView !== 'store') setCurrentView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all active:scale-95 ${
            currentView === 'store' ? 'text-neutral-950 dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400'
          }`}
          aria-label="Home Storefront"
        >
          <Home className={`w-5 h-5 ${currentView === 'store' ? 'stroke-[2.2]' : 'stroke-[1.6]'}`} />
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </button>

        {/* 2. Collection / Atelier */}
        <button
          onClick={() => handleNav('#shop')}
          className="flex flex-col items-center justify-center min-w-[56px] py-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-95"
          aria-label="Shop Collection"
        >
          <Compass className="w-5 h-5 stroke-[1.6]" />
          <span className="text-[10px] tracking-tight mt-1">Catalog</span>
        </button>

        {/* 3. Search */}
        <button
          onClick={() => {
            if (currentView !== 'store') setCurrentView('store');
            if (onSearchClick) onSearchClick();
            else {
              const el = document.getElementById('brand-search-input') || document.querySelector('input[type="text"]');
              el?.scrollIntoView({ behavior: 'smooth' });
              (el as HTMLInputElement)?.focus();
            }
          }}
          className="flex flex-col items-center justify-center min-w-[56px] py-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all active:scale-95"
          aria-label="Search items"
        >
          <Search className="w-5 h-5 stroke-[1.6]" />
          <span className="text-[10px] tracking-tight mt-1">Search</span>
        </button>

        {/* 4. Shopping Bag (Guaranteed visible with live badge) */}
        <button
          onClick={() => setIsCartOpen(true)}
          id="mobile-bottom-bag-btn"
          className="relative flex flex-col items-center justify-center min-w-[56px] py-1 text-neutral-900 dark:text-white transition-all active:scale-95"
          aria-label={`Shopping Bag (${cartCount} items)`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-scale">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1">Bag</span>
        </button>

        {/* 5. Account Profile (Guaranteed visible on phone) */}
        <button
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              // Open mobile drawer or profile
              const profileBtn = document.getElementById('user-profile-menu-btn');
              if (profileBtn) profileBtn.click();
              else setIsAuthModalOpen(true);
            }
          }}
          id="mobile-bottom-account-btn"
          className="flex flex-col items-center justify-center min-w-[56px] py-1 text-neutral-900 dark:text-white transition-all active:scale-95"
          aria-label="Account Profile"
        >
          {user ? (
            <div className="w-5 h-5 rounded-full overflow-hidden border border-neutral-400 dark:border-neutral-600 flex items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-black text-[9px] font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
          ) : (
            <User className="w-5 h-5 stroke-[1.6] text-neutral-500 dark:text-neutral-400" />
          )}
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-[52px]">
            {user ? user.name.split(' ')[0] : 'Account'}
          </span>
        </button>

        {/* 6. If Super Admin: Quick Switch pill */}
        {isAdmin && (
          <button
            onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
            className={`flex flex-col items-center justify-center min-w-[52px] py-1 transition-all active:scale-95 ${
              currentView === 'admin' 
                ? 'text-amber-500 font-bold' 
                : 'text-amber-600 dark:text-amber-400'
            }`}
            aria-label="Admin HQ Switch"
            title="Super Admin Portal"
          >
            <LayoutDashboard className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[9px] font-semibold tracking-tighter mt-1">Admin</span>
          </button>
        )}

      </div>
    </nav>
  );
};
