import React from 'react';
import { ArrowDown, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-between pt-24 pb-0 overflow-hidden bg-[#070707] text-white">
      {/* Background Graphic & Editorial Texture */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop"
          alt="Maison Noir Campaign"
          className="w-full h-full object-cover object-center opacity-35 filter grayscale contrast-125 scale-105 transform hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#070707]/40 to-[#070707]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-24 pb-12 flex flex-col items-start justify-center">
        
        {/* Eyebrow & Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-neutral-300 border-b border-neutral-600 pb-1">
            Fall / Winter 2026 Collection
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-neutral-200 text-[11px] tracking-wider uppercase backdrop-blur-sm border border-white/15">
            <Truck className="w-3 h-3 text-amber-400" />
            Payment on Delivery Available
          </span>
        </div>

        {/* Massive Editorial Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.02] max-w-4xl font-medium mb-6">
          Timeless Fashion <br />
          <span className="italic font-normal text-neutral-300">in Black & White.</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="text-neutral-300 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed mb-10">
          Considered architectural silhouettes, honest fabrics, and no colour but the two that matter. Masterfully tailored pieces designed to outlast trend cycles.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onShopClick}
            id="hero-shop-btn"
            className="group px-8 py-4 bg-white text-black hover:bg-neutral-200 font-sans text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#about"
            className="px-8 py-4 bg-transparent hover:bg-white/10 text-white border border-white/30 font-sans text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Atelier Philosophy</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-neutral-400 text-xs tracking-wider uppercase font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>100% Authentic Silk & Wool</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-white" />
            <span>Pay on Delivery at Doorstep</span>
          </div>
          <div>48 Countries Shipped</div>
          <div>Complimentary Express Over $200</div>
        </div>
      </div>

      {/* Marquee Banner */}
      <div className="relative z-10 w-full bg-neutral-950 border-y border-neutral-800 text-neutral-300 py-3 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] text-xs uppercase tracking-[0.25em] font-medium">
          <span className="mx-6">✦ NEW DROP FW26</span>
          <span className="mx-6">✦ CASH & CARD ON DELIVERY ACCEPTED</span>
          <span className="mx-6">✦ RESTFUL MONOCHROME PALETTE</span>
          <span className="mx-6">✦ COMPLIMENTARY COURIER OVER $200</span>
          <span className="mx-6">✦ ARCHITECTURAL SILHOUETTES</span>
          <span className="mx-6">✦ NEW DROP FW26</span>
          <span className="mx-6">✦ CASH & CARD ON DELIVERY ACCEPTED</span>
          <span className="mx-6">✦ RESTFUL MONOCHROME PALETTE</span>
          <span className="mx-6">✦ COMPLIMENTARY COURIER OVER $200</span>
          <span className="mx-6">✦ ARCHITECTURAL SILHOUETTES</span>
        </div>
      </div>
    </section>
  );
};
