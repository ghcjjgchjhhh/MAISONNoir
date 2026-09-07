import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { POLICY_METADATA, POLICY_SECTIONS } from '../data/policyData';
import { 
  X, 
  Search, 
  FileText, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Printer, 
  Check, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { isPolicyModalOpen, setIsPolicyModalOpen, policyInitialSection } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Set initial category or scroll when opened
  useEffect(() => {
    if (isPolicyModalOpen) {
      if (policyInitialSection) {
        if (policyInitialSection === 'cod' || policyInitialSection === '12') {
          setActiveCategory('delivery');
        } else if (policyInitialSection === 'returns' || policyInitialSection === '14') {
          setActiveCategory('returns');
        } else if (policyInitialSection === 'privacy' || policyInitialSection === '23') {
          setActiveCategory('account');
        } else {
          setActiveCategory('all');
        }

        setTimeout(() => {
          const targetEl = document.getElementById(`policy-sec-${policyInitialSection}`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  }, [isPolicyModalOpen, policyInitialSection]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPolicyModalOpen) {
        setIsPolicyModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPolicyModalOpen, setIsPolicyModalOpen]);

  // Filter sections
  const filteredSections = useMemo(() => {
    return POLICY_SECTIONS.filter((sec) => {
      // Category filter
      if (activeCategory !== 'all' && sec.category !== activeCategory) {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = sec.title.toLowerCase().includes(q);
      const matchNum = sec.sectionNumber.toString().includes(q);
      const matchParas = sec.paragraphs.some((p) => p.toLowerCase().includes(q));
      const matchBullets = sec.bullets?.some((b) => b.toLowerCase().includes(q));
      const matchHighlight = sec.highlight?.toLowerCase().includes(q);
      return matchTitle || matchNum || matchParas || matchBullets || matchHighlight;
    });
  }, [activeCategory, searchQuery]);

  if (!isPolicyModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-sm flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-neutral-500">
                Maison Noir Atelier Protocol
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                Official
              </span>
            </div>
            <h2 
              id="policy-modal-title"
              className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100"
            >
              Terms & Conditions & Store Policy
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Last Updated: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{POLICY_METADATA.lastUpdated}</span> · 30 Comprehensive Sections
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              title="Print policy documents"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setIsPolicyModalOpen(false)}
              id="close-policy-modal-btn"
              className="p-2 text-neutral-400 hover:text-black dark:hover:text-white rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search across 30 clauses (e.g., Google Sign-In, Cash on Delivery, Returns, Sizes, Cancel)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs rounded-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-sm whitespace-nowrap text-[11px] font-semibold tracking-wider uppercase transition-all ${
                activeCategory === 'all'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              All Clauses ({POLICY_SECTIONS.length})
            </button>

            <button
              onClick={() => setActiveCategory('account')}
              className={`px-3 py-1.5 rounded-sm whitespace-nowrap text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeCategory === 'account'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Google Sign-In & Privacy</span>
            </button>

            <button
              onClick={() => setActiveCategory('delivery')}
              className={`px-3 py-1.5 rounded-sm whitespace-nowrap text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeCategory === 'delivery'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Delivery & Pay on Delivery</span>
            </button>

            <button
              onClick={() => setActiveCategory('returns')}
              className={`px-3 py-1.5 rounded-sm whitespace-nowrap text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeCategory === 'returns'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Returns & 14-Day Exchanges</span>
            </button>

            <button
              onClick={() => setActiveCategory('orders')}
              className={`px-3 py-1.5 rounded-sm whitespace-nowrap text-[11px] font-semibold tracking-wider uppercase transition-all ${
                activeCategory === 'orders'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Orders & Sizing
            </button>

            <button
              onClick={() => setActiveCategory('legal')}
              className={`px-3 py-1.5 rounded-sm whitespace-nowrap text-[11px] font-semibold tracking-wider uppercase transition-all ${
                activeCategory === 'legal'
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Legal & IP
            </button>
          </div>
        </div>

        {/* Scrollable Policy Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 divide-y divide-neutral-100 dark:divide-neutral-800/60 leading-relaxed text-xs sm:text-sm">
          {/* Introductory Notice */}
          <div className="bg-neutral-50 dark:bg-neutral-900/60 p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 rounded-sm">
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
              Welcome to <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{POLICY_METADATA.storeName}</strong>. 
              These Terms &amp; Conditions and Store Policies govern your use of our website, mobile application, and online shopping services. 
              By accessing our store, creating an account, or placing an order, you agree to these terms.
            </p>
          </div>

          {filteredSections.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No policy clauses match your search &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-3 text-xs underline font-semibold text-neutral-800 dark:text-neutral-200"
              >
                View all clauses
              </button>
            </div>
          ) : (
            filteredSections.map((sec) => (
              <article 
                key={sec.id} 
                id={`policy-sec-${sec.sectionNumber}`}
                className="pt-6 first:pt-0 scroll-mt-6"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black text-[11px] font-bold flex items-center justify-center shrink-0">
                    {sec.sectionNumber}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    {sec.title}
                  </h3>
                </div>

                <div className="space-y-3 text-neutral-600 dark:text-neutral-300 pl-8">
                  {sec.paragraphs.map((p, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {sec.bullets && (
                    <ul className="space-y-2 mt-2 list-none pl-1">
                      {sec.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-neutral-600 dark:text-neutral-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-2 shrink-0"></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.highlight && (
                    <div className="mt-3 p-3 sm:p-4 bg-amber-500/10 border-l-2 border-amber-500 dark:border-amber-400 rounded-r-sm text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                      {sec.highlight}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}

          {/* Customer Agreement Callout Box */}
          <div className="pt-6">
            <div className="p-5 sm:p-6 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-sm space-y-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold">
                  Customer Agreement Confirmation
                </h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                By accessing our store, creating an account, using Google Sign-In, or placing an order, you confirm that you have read, understood, and agreed to these Terms &amp; Conditions and Store Policies.
              </p>
              <p className="text-xs tracking-wider opacity-75">
                Thank you for shopping with {POLICY_METADATA.storeName}.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-neutral-500 text-[11px] text-center sm:text-left">
            Need legal or order clarification? Contact <a href={`mailto:${POLICY_METADATA.email}`} className="font-semibold underline hover:text-black dark:hover:text-white">{POLICY_METADATA.email}</a>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex-1 sm:flex-none px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white rounded-sm transition-colors text-center"
            >
              {copiedLink ? 'Link Copied' : 'Copy Store Link'}
            </button>
            <button
              type="button"
              id="accept-policy-btn"
              onClick={() => setIsPolicyModalOpen(false)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 uppercase tracking-widest font-semibold text-xs rounded-sm transition-all"
            >
              I Understand &amp; Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
