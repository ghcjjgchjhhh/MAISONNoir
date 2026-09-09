import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { isAdmin, setCurrentView, setIsAuthModalOpen, user, openPolicyModal, addSubscriber, showToast } = useApp();
  const [subscriberEmail, setSubscriberEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] text-neutral-300 pt-20 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-serif text-2xl tracking-wider text-white font-semibold">
              MAISON <span className="italic font-normal">Noir</span>
            </span>
            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm">
              Architectural monochromatic garments cut for eternity. Handcrafted with reverence for purity, restraint, and intentional dressing.
            </p>
            <form onSubmit={(event) => {
              event.preventDefault();
              if (!subscriberEmail.trim()) return;
              addSubscriber(subscriberEmail);
              setSubscriberEmail('');
              showToast('You are subscribed to Maison Noir updates.');
            }} className="flex max-w-sm gap-2">
              <input
                type="email"
                required
                value={subscriberEmail}
                onChange={event => setSubscriberEmail(event.target.value)}
                placeholder="Email for atelier updates"
                className="min-w-0 flex-1 border border-neutral-700 bg-transparent px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
              />
              <button type="submit" className="shrink-0 border border-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors">Subscribe</button>
            </form>
            <div className="text-[11px] text-neutral-400 space-y-1">
              <p>Atelier: 14 Adeola Odeku St, Victoria Island, Lagos</p>
              <p>Complimentary Express Shipping over $200</p>
            </div>
          </div>

          {/* Links Cols */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h5 className="text-[10px] uppercase tracking-[0.25em] font-bold text-white mb-4">
              Collection
            </h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li><a href="#shop" className="hover:text-white transition-colors">Men&apos;s Tailoring</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Women&apos;s Atelier</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Leather Accessories</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Fall / Winter 2026</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3 text-xs">
            <h5 className="text-[10px] uppercase tracking-[0.25em] font-bold text-white mb-4">
              The Atelier
            </h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li><a href="#about" className="hover:text-white transition-colors">Our Philosophy</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Concierge</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Lagos Workshop</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Material Standards</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3 text-xs">
            <h5 className="text-[10px] uppercase tracking-[0.25em] font-bold text-white mb-4">
              Client Service
            </h5>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <button 
                  onClick={() => openPolicyModal('12')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Payment on Delivery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openPolicyModal('9')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Courier &amp; Delivery Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openPolicyModal('14')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Returns &amp; 14-Day Exchanges
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openPolicyModal('5')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sizing &amp; Fit Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Account / Portal Col */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            {isAdmin ? (
              <>
                <h5 className="text-[10px] uppercase tracking-[0.25em] font-bold text-amber-400 mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Executive HQ
                </h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Restricted management console for inventory & order dispatch.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    scrollToTop();
                  }}
                  className="inline-block mt-2 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded text-[11px] font-semibold tracking-wider uppercase transition-colors"
                >
                  Access Admin Portal
                </button>
              </>
            ) : (
              <>
                <h5 className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-300 mb-4">
                  Client Portal
                </h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Access your delivery updates, order receipts, and atelier service.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-block mt-2 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-[11px] font-medium tracking-wider transition-colors"
                >
                  Sign In / Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-500">
          <p>© 2026 MAISON NOIR ATELIER. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => openPolicyModal('23')} 
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy Protocol
            </button>
            <button 
              onClick={() => openPolicyModal('all')} 
              className="hover:text-neutral-300 transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <button 
              onClick={() => openPolicyModal('12')} 
              className="hover:text-neutral-300 transition-colors"
            >
              Store Policy
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors p-1"
              aria-label="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
