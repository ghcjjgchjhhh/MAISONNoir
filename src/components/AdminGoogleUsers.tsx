import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerUser, CustomerSession } from '../types';
import { 
  Users, 
  Search, 
  Shield, 
  ShieldAlert, 
  Smartphone, 
  Laptop, 
  Tablet, 
  LogOut, 
  Ban, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Globe, 
  ChevronRight, 
  X,
  ExternalLink,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const AdminGoogleUsers: React.FC = () => {
  const { 
    customers, 
    revokeCustomerSession, 
    revokeAllCustomerSessions, 
    updateCustomerStatus,
    adminSearchQuery 
  } = useApp();

  const [providerFilter, setProviderFilter] = useState<'all' | 'google' | 'email'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'offline' | 'suspended' | 'session_revoked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Customer for Session Drawer
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  
  // Revoke Confirmation Dialog
  const [revokeActionModal, setRevokeActionModal] = useState<{
    type: 'single' | 'all';
    customerId: string;
    customerName: string;
    sessionId?: string;
    deviceLabel?: string;
  } | null>(null);

  const query = (adminSearchQuery || searchQuery).toLowerCase().trim();
  const filteredCustomers = customers.filter(c => {
    if (providerFilter !== 'all' && c.provider !== providerFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (query) {
      const matchName = c.name.toLowerCase().includes(query);
      const matchEmail = c.email.toLowerCase().includes(query);
      const matchPhone = (c.phone || '').toLowerCase().includes(query);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const googleCount = customers.filter(c => c.provider === 'google').length;
  const activeSessionCount = customers.reduce((sum, c) => sum + c.sessions.filter(s => s.status === 'active').length, 0);

  const handleConfirmRevoke = () => {
    if (!revokeActionModal) return;
    if (revokeActionModal.type === 'single' && revokeActionModal.sessionId) {
      revokeCustomerSession(revokeActionModal.customerId, revokeActionModal.sessionId);
    } else if (revokeActionModal.type === 'all') {
      revokeAllCustomerSessions(revokeActionModal.customerId);
    }

    // Refresh selected customer state
    if (selectedCustomer && selectedCustomer.id === revokeActionModal.customerId) {
      const updated = customers.find(c => c.id === revokeActionModal.customerId);
      if (updated) setSelectedCustomer(updated);
    }
    setRevokeActionModal(null);
  };

  const getDeviceIcon = (deviceType: 'mobile' | 'desktop' | 'tablet') => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-purple-500" />;
      case 'desktop':
      default:
        return <Laptop className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: CustomerUser['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'suspended':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'session_revoked':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'offline':
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <span>Google User Authentication & Session Security</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              OAuth 2.0 Compliance
            </span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Audit customer devices, manage live Google login sessions, and revoke tokens remotely.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold self-start sm:self-auto">
          <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300">
            Active Devices: <b className="text-emerald-600 dark:text-emerald-400">{activeSessionCount}</b>
          </div>
          <div className="px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-xl">
            Google Users: <b className="font-bold">{googleCount}</b>
          </div>
        </div>
      </div>

      {/* Security Compliance Banner (Section 28) */}
      <div className="p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl flex items-start gap-3">
        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-neutral-900 dark:text-neutral-100">
            Zero-Trust Privacy Standard: No Credentials Stored or Exposed
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
            In compliance with Google Security requirements, passwords and OAuth refresh tokens are cryptographically isolated. Admins can view device footprints, inspect order activity, or revoke active sessions without touching personal secrets.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, Gmail address, phone..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-100/80 dark:bg-neutral-900/80 border border-transparent focus:border-indigo-500 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value as any)}
            className="px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Providers</option>
            <option value="google">Google OAuth ({googleCount})</option>
            <option value="email">Email Sign-In</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">🟢 Active Online</option>
            <option value="offline">⚪ Offline</option>
            <option value="session_revoked">🟠 Session Revoked</option>
            <option value="suspended">🔴 Suspended</option>
          </select>
        </div>
      </div>

      {/* Customers & Sessions Table */}
      <div className="bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Customer / Google Profile</th>
                <th className="py-3.5 px-3 font-semibold">Sign-In Method</th>
                <th className="py-3.5 px-3 font-semibold">Account Status</th>
                <th className="py-3.5 px-3 font-semibold">Active Sessions</th>
                <th className="py-3.5 px-3 font-semibold">Orders / Spent</th>
                <th className="py-3.5 px-3 font-semibold">Registered</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No users found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const activeSessions = cust.sessions.filter(s => s.status === 'active');

                  return (
                    <tr key={cust.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40 transition-colors">
                      {/* Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}
                            alt={cust.name}
                            className="w-10 h-10 object-cover rounded-xl border border-neutral-200 dark:border-neutral-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-neutral-900 dark:text-neutral-100 block truncate max-w-[180px]">
                              {cust.name}
                            </span>
                            <span className="text-[11px] text-neutral-400 block truncate max-w-[180px]">
                              {cust.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Sign-in Method */}
                      <td className="py-3.5 px-3">
                        {cust.provider === 'google' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>Google Sign-In</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-semibold">
                            <span>Email / Password</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${getStatusBadge(cust.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span className="capitalize">{cust.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      {/* Sessions */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            {activeSessions.length} active
                          </span>
                          <span className="text-neutral-400 text-[10px]">
                            ({cust.sessions.length} total)
                          </span>
                        </div>
                      </td>

                      {/* Orders & Total Spent */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                          ${cust.totalSpent.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {cust.ordersCount} orders placed
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-3 text-neutral-500 font-mono text-[11px]">
                        {cust.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Manage Sessions</span>
                          </button>

                          <button
                            onClick={() => {
                              const newStatus = cust.status === 'suspended' ? 'active' : 'suspended';
                              updateCustomerStatus(cust.id, newStatus);
                            }}
                            title={cust.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                            className={`p-1.5 rounded-lg transition-colors ${cust.status === 'suspended' ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' : 'text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20'}`}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Sessions Management Drawer / Modal (Section 24 & 27) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" role="dialog">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100">
            
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}
                  alt={selectedCustomer.name}
                  className="w-10 h-10 object-cover rounded-xl border border-neutral-200 dark:border-neutral-700"
                />
                <div>
                  <h3 className="text-base font-bold tracking-tight">{selectedCustomer.name}</h3>
                  <p className="text-xs text-neutral-500">{selectedCustomer.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Account State Bar */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Account Status</span>
                  <span className={`font-bold capitalize mt-0.5 inline-block ${selectedCustomer.status === 'suspended' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {selectedCustomer.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = selectedCustomer.status === 'suspended' ? 'active' : 'suspended';
                      updateCustomerStatus(selectedCustomer.id, next);
                      setSelectedCustomer({ ...selectedCustomer, status: next });
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      selectedCustomer.status === 'suspended' 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                        : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {selectedCustomer.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
                  </button>
                </div>
              </div>

              {/* Active Sessions List (Section 24) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Active Devices & Logged-In Sessions ({selectedCustomer.sessions.length})
                  </h4>

                  {selectedCustomer.sessions.some(s => s.status === 'active') && (
                    <button
                      onClick={() => setRevokeActionModal({
                        type: 'all',
                        customerId: selectedCustomer.id,
                        customerName: selectedCustomer.name
                      })}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out All Devices</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {selectedCustomer.sessions.map((sess) => (
                    <div 
                      key={sess.id}
                      className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
                          {getDeviceIcon(sess.deviceType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                              {sess.device}
                            </span>
                            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${sess.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}`}>
                              {sess.status === 'active' ? 'Active' : 'Revoked'}
                            </span>
                          </div>
                          <p className="text-neutral-500 text-[11px] mt-0.5">
                            {sess.browser} · IP: <span className="font-mono">{sess.ip}</span>
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1.5">
                            <Clock className="w-3 h-3" />
                            <span>Last Active: {sess.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      {sess.status === 'active' && (
                        <button
                          onClick={() => setRevokeActionModal({
                            type: 'single',
                            customerId: selectedCustomer.id,
                            customerName: selectedCustomer.name,
                            sessionId: sess.id,
                            deviceLabel: sess.device
                          })}
                          className="px-2.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-bold transition-colors shrink-0"
                        >
                          Sign Out
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end bg-neutral-50/50 dark:bg-neutral-900/50">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl text-xs font-bold shadow-sm"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Revoke Confirmation Dialog (Section 25) */}
      {revokeActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" role="dialog">
          <div className="w-full max-w-md bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-900 dark:text-neutral-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold">
              {revokeActionModal.type === 'all' 
                ? `Sign Out All Devices for ${revokeActionModal.customerName}?` 
                : `Sign Out ${revokeActionModal.deviceLabel}?`}
            </h3>

            <p className="text-xs text-neutral-500 leading-relaxed">
              This will immediately terminate the authentication token on this device. The user will be required to sign in again with Google to place orders.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setRevokeActionModal(null)}
                className="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20"
              >
                Confirm Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
