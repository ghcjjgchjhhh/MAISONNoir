import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Megaphone, 
  Send, 
  Bell, 
  Mail, 
  Check, 
  Calendar, 
  Trash2, 
  Sparkles,
  Layers,
  MessageSquare
} from 'lucide-react';

export const AdminMarketing: React.FC = () => {
  const { 
    marketingCampaigns, 
    subscribers, 
    storeSettings, 
    updateStoreSettings, 
    addNotification 
  } = useApp();

  const [announcementText, setAnnouncementText] = useState(storeSettings.tagline);
  const [announcementEnabled, setAnnouncementEnabled] = useState(storeSettings.enablePushNotifications);
  const [promoBanner, setPromoBanner] = useState(storeSettings.storeDescription);
  const [bannerSaved, setBannerSaved] = useState(false);

  // Push broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'promo' | 'order'>('promo');
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    setAnnouncementText(storeSettings.tagline);
    setAnnouncementEnabled(storeSettings.enablePushNotifications);
    setPromoBanner(storeSettings.storeDescription);
  }, [storeSettings.tagline, storeSettings.enablePushNotifications, storeSettings.storeDescription]);

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      ...storeSettings,
      tagline: announcementText,
      enablePushNotifications: announcementEnabled,
      storeDescription: promoBanner
    });
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 2500);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    addNotification({
      title: broadcastTitle,
      message: broadcastMsg,
      type: broadcastType
    });

    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          <span>Marketing & Customer Communications</span>
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Control header announcement bars, push broadcasts to all active shoppers, and manage newsletter audiences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcement Bar & Promotional Banner Editor */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Top Announcement & Store Banner
              </h3>
              <p className="text-[11px] text-neutral-500">
                Live banner visible at the top of the storefront for all visitors.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Announcement Bar Text
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Complimentary Worldwide Express Shipping on all orders over $150"
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Promotional Subtitle / Coupon Prompt
              </label>
              <input
                type="text"
                value={promoBanner}
                onChange={(e) => setPromoBanner(e.target.value)}
                placeholder="e.g. Use code ATELIER10 at checkout for 10% off your initial order"
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Enable Announcement Bar on Storefront</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {bannerSaved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : null}
                <span>{bannerSaved ? 'Saved to Storefront!' : 'Save Banners'}</span>
              </button>
            </div>
          </form>

          {/* Live Preview Box */}
          <div className="mt-4 p-3 bg-neutral-900 text-white dark:bg-black dark:text-white rounded-xl text-center">
            <span className="text-[10px] text-neutral-400 block uppercase font-mono tracking-widest mb-1">Live Storefront Preview</span>
            <p className="text-xs font-semibold tracking-wide">{announcementText || 'Banner text will appear here'}</p>
          </div>
        </div>

        {/* Instant Customer Push Broadcast (Section 16) */}
        <div className="p-5 bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Send Real-Time Notification / Push Broadcast
              </h3>
              <p className="text-[11px] text-neutral-500">
                Dispatches an instant toast & notification to customer top navigation bell.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. FLASH SALE: 25% Off All Outerwear for 24 Hours!"
                className="w-full px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Detailed Notification Message
              </label>
              <textarea
                rows={2}
                required
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="e.g. Use code FLASH25 at checkout before midnight. Limited stocks remaining."
                className="w-full px-3.5 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-500">Type:</span>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-semibold"
                >
                  <option value="promo">Promo Alert</option>
                  <option value="info">General Info</option>
                  <option value="order">Order Update</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{broadcastSent ? 'Broadcast Sent!' : 'Send Broadcast'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Newsletter Subscribers Table */}
      <div className="bg-white dark:bg-[#121212] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Newsletter Audience & Subscribers ({subscribers.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Double Opt-in Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Subscriber Email</th>
                <th className="py-3 px-3 font-semibold">Joined Date</th>
                <th className="py-3 px-3 font-semibold">Opt-In Status</th>
                <th className="py-3 px-4 font-semibold text-right">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              {subscribers.map((sub, i) => (
                <tr key={i} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40">
                  <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                    {sub.email}
                  </td>
                  <td className="py-3 px-3 text-neutral-500 font-mono text-[11px]">
                    {sub.date}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      Subscribed
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-400 text-[11px]">
                    Storefront Footer
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
