import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopHeader } from './AdminTopHeader';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminAddProduct } from './AdminAddProduct';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminGoogleUsers } from './AdminGoogleUsers';
import { AdminDiscounts } from './AdminDiscounts';
import { AdminAddDiscount } from './AdminAddDiscount';
import { AdminMarketing } from './AdminMarketing';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSettings } from './AdminSettings';
import { AdminRestockModal } from './AdminRestockModal';

export const AdminDashboard: React.FC = () => {
  const { currentAdminTab, adminActiveTab } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeTab = currentAdminTab || adminActiveTab || 'dashboard';

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'overview':
        return <AdminOverview />;
      case 'products':
        return <AdminProducts />;
      case 'add_product':
        return <AdminAddProduct />;
      case 'inventory':
      case 'alerts':
        return <AdminInventory />;
      case 'orders':
        return <AdminOrders />;
      case 'google_users':
      case 'customers':
        return <AdminGoogleUsers />;
      case 'view_customer':
        return <AdminGoogleUsers />;
      case 'discounts':
        return <AdminDiscounts />;
      case 'add_discount':
        return <AdminAddDiscount />;
      case 'marketing':
        return <AdminMarketing />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0c0c0c] text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200 antialiased">
      {/* Top Application Header */}
      <AdminTopHeader onOpenMobileMenu={() => setMobileOpen(true)} />

      {/* Main Container with Sticky Sidebar and Responsive Content Area */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto flex">
        {/* Sidebar */}
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Dynamic Main Workspace with offset for fixed sidebar on lg screens */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:ml-64">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global 1-Click Restock System Modal */}
      <AdminRestockModal />
    </div>
  );
};
