import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    showToast('Your message has been delivered to our studio team. We will reply within 24 hours.');
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSent(false);
    }, 2000);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-white dark:bg-[#0c0c0c] transition-colors duration-300 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Direct Inquiries */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-neutral-400 dark:text-neutral-500 block mb-2">
                Atelier Concierge
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-900 dark:text-neutral-50 leading-[1.1]">
                Connect with our <br />
                <span className="italic font-light">Lagos Studio.</span>
              </h2>
              <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                Whether requesting bespoke alterations, inquiring about an active Pay on Delivery order, or discussing an editorial commission, our concierge responds with deliberate care.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Email Inquiries</span>
                  <a href="mailto:hello@maisonnoir.com" className="font-medium hover:underline text-neutral-900 dark:text-neutral-100">
                    hello@maisonnoir.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Studio Phone & WhatsApp</span>
                  <a href="tel:+2348000000000" className="font-medium hover:underline text-neutral-900 dark:text-neutral-100">
                    +234 800 000 0000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Physical Atelier</span>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    14 Adeola Odeku St, Victoria Island, Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-neutral-50/70 dark:bg-neutral-900/30 p-6 sm:p-10 border border-neutral-200 dark:border-neutral-800 rounded-sm">
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 dark:text-neutral-400 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Order inquiry, sizing consultation, or collaboration"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-3 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSent}
                className="w-full sm:w-auto px-8 py-4 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSent ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Inquiry Transmitted</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Atelier</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
