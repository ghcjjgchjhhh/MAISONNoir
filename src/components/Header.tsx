import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  Sun, 
  Moon, 
  User as UserIcon, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Store,
  FileText,
  ChevronRight
} from 'lucide-react';
import { InstallAppButton } from './InstallAppButton';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery = '' }) => {
  const { 
    cartCount, 
    cartTotal,
    setIsCartOpen, 
    theme, 
    toggleTheme, 
    user, 
    isAdmin, 
    setIsAuthModalOpen, 
    logout,
    currentView,
    setCurrentView,
    openPolicyModal,
    setAccountOpen
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleNavClick = (anchor: string) => {
    setIsMobileMenuOpen(false);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <button 
            onClick={() => { setCurrentView('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left group flex items-center"
            id="brand-logo-btn"
            aria-label="Maison Noir Home"
          >
            <span className="font-serif text-xl sm:text-3xl font-semibold tracking-wider text-neutral-900 dark:text-neutral-50 group-hover:opacity-80 transition-opacity">
              MAISON <span className="italic font-normal">Noir</span>
            </span>
          </button>

          {/* Admin Indicator Badge (Desktop) */}
          {isAdmin && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-3 h-3" />
              <span>Super Admin ({user?.email.split('@')[0]})</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs uppercase tracking-[0.2em] font-medium text-neutral-600 dark:text-neutral-400">
          <button 
            onClick={() => handleNavClick('#home')} 
            className="hover:text-black dark:hover:text-white transition-colors relative py-1"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick('#shop')} 
            className="hover:text-black dark:hover:text-white transition-colors relative py-1"
          >
            Collection
          </button>
          <button 
            onClick={() => handleNavClick('#about')} 
            className="hover:text-black dark:hover:text-white transition-colors relative py-1"
          >
            Atelier
          </button>
          <button 
            onClick={() => handleNavClick('#contact')} 
            className="hover:text-black dark:hover:text-white transition-colors relative py-1"
          >
            Contact
          </button>
        </nav>

        {/* Right Action Icons: Strictly ordered and preserved on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Admin HQ Switch Button (Desktop & Tablet) */}
          {isAdmin && (
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
              id="admin-switch-btn"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs uppercase tracking-wider font-semibold transition-all shadow-sm ${
                currentView === 'admin'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border border-neutral-900 dark:border-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-black font-bold border border-amber-400 animate-pulse'
              }`}
              title="Access Executive Admin Portal"
            >
              {currentView === 'admin' ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">View Store</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Admin HQ</span>
                </>
              )}
            </button>
          )}

          {/* Search Bar / Trigger */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full px-2.5 py-1 border border-neutral-300 dark:border-neutral-700 w-36 sm:w-56 transition-all">
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none w-full"
                />
                <button 
                  onClick={() => { setIsSearchOpen(false); onSearchChange?.(''); }}
                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 ml-1 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSearchOpen(true);
                  if (currentView === 'admin') setCurrentView('store');
                }}
                id="open-search-btn"
                className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Search Collection"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Theme Toggle Button (Desktop & Tablet) */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="hidden sm:flex p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* User Account Profile Button (ALWAYS visible on mobile & desktop) */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setAccountOpen(true); setIsUserMenuOpen(false); }}
                  id="user-profile-menu-btn"
                  className="flex items-center gap-1.5 p-1 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-all active:scale-95"
                  aria-label="User profile"
                  title={user.name}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl py-3 px-3 z-50 text-neutral-800 dark:text-neutral-200 animate-in fade-in slide-in-from-top-2">
                    <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-2 px-2">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      {isAdmin ? (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-700 dark:text-amber-400">
                          Super Administrator
                        </span>
                      ) : (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          Valued Client
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-amber-600 dark:text-amber-400"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Executive Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => { setAccountOpen(true); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                    >
                      <UserIcon className="w-4 h-4 text-neutral-500" />
                      My Account
                    </button>

                    <button
                      onClick={() => {
                        openPolicyModal('all');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                    >
                      <FileText className="w-4 h-4 text-neutral-500" />
                      Store Policies &amp; Terms
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-2 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                id="signin-modal-btn"
                className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200 transition-all active:scale-95"
                title="Sign In / Account"
                aria-label="Sign In or Open Account"
              >
                <UserIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline sm:ml-1.5">Sign In</span>
              </button>
            )}
          </div>

          {/* Shopping Bag Button (ALWAYS visible on mobile & desktop) */}
          <button
            onClick={() => user ? setAccountOpen(true) : setIsAuthModalOpen(true)}
            id="header-account-btn"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
            aria-label={user ? 'Open Account' : 'Sign in to open Account'}
            title={user ? 'Open Account' : 'Sign in to open Account'}
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden lg:inline">Account</span>
          </button>

          <InstallAppButton />

          {/* Shopping Bag Button (ALWAYS visible on mobile & desktop) */}
          <button
            onClick={() => setIsCartOpen(true)}
            id="header-cart-btn"
            className="relative p-2 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors active:scale-95"
            aria-label={`Shopping Bag (${cartCount} items)`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black rounded-full flex items-center justify-center animate-scale shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white active:scale-95"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800 px-5 py-5 space-y-4 animate-in fade-in slide-in-from-top-2">
          
          {/* Mobile Quick Account & Bag Header Card */}
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            {/* Account Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {user ? (
                  <>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-bold">
                      {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 leading-tight">{user.name}</p>
                      <p className="text-[10px] text-neutral-500 truncate max-w-[170px]">{user.email}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Welcome, Guest</p>
                      <p className="text-[10px] text-neutral-500">Sign in to save your wishlist &amp; orders</p>
                    </div>
                  </>
                )}
              </div>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-xs"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black text-xs font-bold rounded-lg"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Shopping Bag Row */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full pt-2.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <span>Your Shopping Bag</span>
                <span className="px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-[10px] font-bold">
                  {cartCount}
                </span>
              </div>
              <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                <span>${cartTotal.toFixed(2)}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-3 text-sm uppercase tracking-widest font-medium text-neutral-700 dark:text-neutral-300">
            <button 
              onClick={() => handleNavClick('#home')} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
            >
              <span>Home Storefront</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button 
              onClick={() => handleNavClick('#shop')} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
            >
              <span>The Collection</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button 
              onClick={() => handleNavClick('#about')} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
            >
              <span>Our Atelier Story</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button 
              onClick={() => handleNavClick('#contact')} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
            >
              <span>Contact Studio</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button 
              onClick={() => {
                openPolicyModal('all');
                setIsMobileMenuOpen(false);
              }} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-neutral-700 dark:text-neutral-300"
            >
              <span>Store Policies &amp; Terms</span>
              <FileText className="w-4 h-4 text-neutral-400" />
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setCurrentView(currentView === 'admin' ? 'store' : 'admin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-3 px-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 font-bold flex items-center justify-between"
              >
                <span>{currentView === 'admin' ? 'Exit to Storefront' : 'Open Super Admin HQ'}</span>
                <LayoutDashboard className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Theme Toggle Row */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-600" />}
                <span className="capitalize">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

