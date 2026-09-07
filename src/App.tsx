import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductQuickView } from './components/ProductQuickView';
import { AuthModal } from './components/AuthModal';
import { PolicyModal } from './components/PolicyModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AccountPage } from './components/AccountPage';
import { SplashScreen } from './components/SplashScreen';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, accountOpen, toast, isAdmin, cartCount, cartTotal, isCartOpen, setIsCartOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleScrollToShop = () => {
    const el = document.getElementById('shop');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 selection:bg-black selection:text-white transition-colors duration-300">
      
      {/* Fixed Luxury Navigation Header */}
      <Header 
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Main View Router */}
      <main>
        {accountOpen ? <AccountPage /> : currentView === 'admin' && isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero onShopClick={handleScrollToShop} />
            <ProductCatalog searchQuery={searchQuery} />
            <AboutSection />
            <ContactSection />
            <Footer />
          </>
        )}
      </main>

      {/* Floating Manual Bag Access on Mobile (when picking items) */}
      {cartCount > 0 && !isCartOpen && currentView !== 'admin' && (
        <aside 
          aria-label="Shopping bag summary"
          className="fixed inset-x-4 z-40 sm:hidden animate-fade-in"
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <button
            onClick={() => setIsCartOpen(true)}
            id="mobile-floating-bag-btn"
            className="w-full py-3 px-4 bg-black/95 dark:bg-white/95 text-white dark:text-black backdrop-blur-md rounded-full shadow-2xl flex items-center justify-between border border-neutral-700/50 dark:border-neutral-200/50 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white dark:bg-black text-black dark:text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold">
                {cartCount === 1 ? '1 item in bag' : `${cartCount} items in bag`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <span>${cartTotal.toFixed(2)}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-80">· Open Bag &rarr;</span>
            </div>
          </button>
        </aside>
      )}

      {/* Overlays & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ProductQuickView />
      <AuthModal />
      <PolicyModal />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed right-4 sm:right-6 z-50 max-w-sm w-auto bg-neutral-900 text-white dark:bg-white dark:text-black px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-neutral-700 dark:border-neutral-200 animate-slide-left" style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div className="text-xs leading-relaxed font-medium">
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <AppProvider>
      {isSplashVisible ? <SplashScreen onComplete={() => setIsSplashVisible(false)} /> : <MainLayout />}
    </AppProvider>
  );
}
