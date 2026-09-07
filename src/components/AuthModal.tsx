import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, User as UserIcon, ArrowRight, ArrowLeft } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithEmail, openPolicyModal } = useApp();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isGoogleOAuthView, setIsGoogleOAuthView] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const email = customEmail.trim();
    const name = customName.trim() || email.split('@')[0];
    loginWithEmail(email, name);
  };

  const handleGoogleOAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput.trim()) return;
    const email = googleEmailInput.trim();
    const name = googleNameInput.trim() || email.split('@')[0];
    loginWithGoogle(email, name);
    setIsGoogleOAuthView(false);
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setIsGoogleOAuthView(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-sm p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* GOOGLE OAUTH PROMPT VIEW */}
        {isGoogleOAuthView ? (
          <div className="animate-fade-in">
            {/* Back button */}
            <button
              onClick={() => setIsGoogleOAuthView(false)}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black dark:hover:text-white mb-5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {/* Google Header */}
            <div className="text-center mb-6">
              <svg className="w-8 h-8 mx-auto mb-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Sign in with Google
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                to continue to <strong className="font-serif">MAISON NOIR</strong>
              </p>
            </div>

            <form onSubmit={handleGoogleOAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 font-medium">
                  Email or phone
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="name@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 font-medium">
                  Name <span className="text-neutral-400 text-[10px] font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsGoogleOAuthView(false)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-semibold tracking-wider transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STANDARD CLEAN AUTH MODAL */
          <div>
            {/* Brand Header */}
            <div className="text-center mb-6">
              <span className="font-serif text-2xl font-semibold tracking-wider text-neutral-900 dark:text-neutral-50 block">
                MAISON <span className="italic font-normal">Noir</span>
              </span>
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 mt-1 font-medium">
                Client Authentication
              </p>
            </div>

            {/* Standard Google Sign-In Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setIsGoogleOAuthView(true)}
                id="google-signin-btn"
                className="w-full py-3 px-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-sm text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-3 font-medium text-xs tracking-wider transition-all shadow-sm"
              >
                {/* Official Google Multicolored SVG Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>

                <span>Sign in with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
              <span className="flex-shrink mx-4 text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                Or Continue with Email
              </span>
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-800"></div>
            </div>

            {/* Passwordless Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-3.5 h-3.5 absolute left-3 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 rounded-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
                  Full Name <span className="text-neutral-400 text-[10px] lowercase">(optional)</span>
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="w-3.5 h-3.5 absolute left-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 rounded-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="email-continue-btn"
                className="w-full py-3 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-sm rounded-sm"
              >
                <span>Continue with Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[11px] text-center text-neutral-400 dark:text-neutral-500 mt-6 leading-relaxed">
              By continuing, you agree to Maison Noir&apos;s{' '}
              <button 
                type="button" 
                onClick={() => openPolicyModal('all')}
                className="underline text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button 
                type="button" 
                onClick={() => openPolicyModal('23')}
                className="underline text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              >
                Privacy Protocol
              </button>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
