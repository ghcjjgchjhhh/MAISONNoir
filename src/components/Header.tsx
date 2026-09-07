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
  FileText
} from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery = '' }) => {
  const { 
    cartCount, 
    setIsCartOpen, 
    theme, 
    toggleTheme, 
    user, 
    isAdmin, 
    setIsAuthModalOpen, 
    logout,
    currentView,
    setCurrentView,
    openPolicyModal
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { setCurrentView('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-left group"
            id="brand-logo-btn"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-neutral-900 dark:text-neutral-50 group-hover:opacity-80 transition-opacity">
              MAISON <span className="italic font-normal">Noir</span>
            </span>
          </button>

          {/* Admin Indicator Badge */}
          {isAdmin && (
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin ({user?.email.split('@')[0]})</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-neutral-600 dark:text-neutral-400">
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

        {/* Right Icon Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Admin HQ Switch Button (Only visible if signed in as ifeanyianoma2) */}
          {isAdmin && (
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
              id="admin-switch-btn"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs uppercase tracking-wider font-semibold transition-all shadow-sm ${
                currentView === 'admin'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border border-neutral-900 dark:border-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-black font-bold border border-amber-400 animate-pulse'
              }`}
              title="Access Executive Admin Portal"
            >
              {currentView === 'admin' ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View Store</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin HQ</span>
                </>
              )}
            </button>
          )}

          {/* Search Bar */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 w-44 sm:w-60 transition-all">
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search pieces..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  autoFocus
                  className="bg-transparent border-none text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none w-full"
                />
                <button 
                  onClick={() => { setIsSearchOpen(false); onSearchChange?.(''); }}
                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
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

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* User Account / Google Sign-In */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  id="user-profile-menu-btn"
                  className="flex items-center gap-2 p-1 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white transition-colors"
                  aria-label="User profile"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-semibold">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-200 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>

          {/* Cart Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            id="header-cart-btn"
            className="relative p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-scale">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-4 text-sm uppercase tracking-widest font-medium text-neutral-700 dark:text-neutral-300">
            <button 
              onClick={() => handleNavClick('#home')} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('#shop')} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800"
            >
              The Collection
            </button>
            <button 
              onClick={() => handleNavClick('#about')} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800"
            >
              Our Atelier Story
            </button>
            <button 
              onClick={() => handleNavClick('#contact')} 
              className="text-left py-2 border-b border-neutral-100 dark:border-neutral-800"
            >
              Contact Studio
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
                className="text-left py-3 px-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-600 dark:text-amber-400 font-bold flex items-center justify-between"
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

            {!user && (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-neutral-900 text-white dark:bg-white dark:text-black text-center font-semibold rounded-lg mt-2"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
