import React from 'react';
import { Award, Globe, Scissors } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 sm:py-32 bg-neutral-50 dark:bg-[#0a0a0a] transition-colors duration-300 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Visual Block */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-800 group">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
                alt="Maison Noir Atelier Tailoring"
                className="w-full h-full object-cover object-center filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="font-serif italic text-4xl text-neutral-400">&ldquo;</span>
                <p className="font-serif text-xl sm:text-2xl font-normal leading-snug max-w-sm mt-1">
                  Restraint is the ultimate form of luxury.
                </p>
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 mt-4 block">
                  Founding Philosophy — Maison Noir Atelier
                </span>
              </div>
            </div>

            {/* Corner Decorative Accent */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28 border border-neutral-400/40 dark:border-neutral-700 -z-10 hidden sm:block"></div>
          </div>

          {/* Narrative Block */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-neutral-400 dark:text-neutral-500 block mb-2">
                Our Provenance
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-900 dark:text-neutral-50 leading-[1.1]">
                Cut from conviction, <br />
                <span className="italic font-light">never trend cycles.</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
              MAISON NOIR was founded on a simple conviction: that true elegance does not compete for attention. While the modern industry chased ephemeral palettes and planned obsolescence, we committed ourselves entirely to the depth of black and the purity of white.
            </p>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
              Every garment is developed in our Victoria Island atelier, pattern-tested meticulously by hand, and produced in small, disciplined batches. We do not design for seasons; we build heirloom silhouettes that become foundational to how you present yourself to the world.
            </p>

            {/* Stat Counters */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <strong className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 block">
                  12
                </strong>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block mt-1">
                  Years of Tailoring
                </span>
              </div>
              <div>
                <strong className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 block">
                  48
                </strong>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block mt-1">
                  Countries Shipped
                </span>
              </div>
              <div>
                <strong className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 block">
                  100%
                </strong>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block mt-1">
                  Monochrome Code
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
