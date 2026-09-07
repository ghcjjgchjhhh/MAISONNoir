import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { Eye, ShoppingBag, Check, Sparkles, Filter } from 'lucide-react';

interface ProductCatalogProps {
  searchQuery: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ searchQuery }) => {
  const { products, addToCart, setSelectedProductForQuickView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [addedItemEffect, setAddedItemEffect] = useState<number | null>(null);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Pieces' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'accessories', label: 'Accessories' }
  ];

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.cat === selectedCategory;
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0; // featured / natural
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    addToCart(product, defaultSize);
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 1400);
  };

  return (
    <section id="shop" className="py-20 sm:py-28 bg-white dark:bg-[#0c0c0c] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-neutral-500 dark:text-neutral-400 block mb-2">
              Curated Wardrobe
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-900 dark:text-neutral-50">
              The Collection
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-md font-light">
              Every garment patterned, tested, and tailored in black, ivory, or slate — built to be worn for years, not seasons.
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-medium">
              <Filter className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs uppercase tracking-wider font-semibold py-2 px-3 rounded-none text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Pieces</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Layout with Side Rail on Desktop & Filter Pills */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
          
          {/* Category Rail (Desktop) */}
          <div className="hidden lg:flex flex-col w-48 shrink-0 space-y-6 pt-2">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 block">
              Categories
            </span>
            <div className="flex flex-col space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-left text-xs uppercase tracking-[0.2em] font-medium py-2 px-3 border-l-2 transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'border-black dark:border-white text-black dark:text-white font-bold bg-neutral-100 dark:bg-neutral-900'
                      : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-neutral-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Delivery Note */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 mt-8 rounded-sm text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
              <p className="font-semibold text-neutral-900 dark:text-neutral-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Pay on Delivery
              </p>
              <p className="text-[11px] leading-relaxed">
                Order freely with zero upfront charge. Inspect your garments and pay courier by Cash or Card POS at your door.
              </p>
            </div>
          </div>

          {/* Main Product Area */}
          <div className="flex-1">
            
            {/* Mobile / Tablet Horizontal Category Pills */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap rounded-full border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm'
                      : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-800 hover:border-neutral-500'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Result Count */}
            <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-6">
              <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'} available</span>
              {searchQuery && <span>Searching for &quot;{searchQuery}&quot;</span>}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg p-8">
                <p className="font-serif text-2xl text-neutral-700 dark:text-neutral-300 mb-2">No matching pieces found</p>
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-6">Try searching a different keyword or category</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Reset Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProductForQuickView(product)}
                    className="group flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    {/* Image Container with 3:4 Aspect Ratio */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                      <img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          // Fallback high quality placeholder if broken link
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
                        }}
                      />

                      {/* Tag Badge */}
                      {product.tag && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 dark:bg-black/95 backdrop-blur-sm text-neutral-900 dark:text-neutral-100 text-[8px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase px-1.5 py-0.5 sm:px-2.5 sm:py-1 shadow-sm">
                          {product.tag}
                        </span>
                      )}

                      {/* Stock Warning */}
                      {product.stock < 10 && (
                        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-amber-500/90 text-black text-[8px] sm:text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5">
                          Only {product.stock} left
                        </span>
                      )}

                      {/* Quick Action Overlay (Slide-up on desktop hover) */}
                      <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 items-center gap-2">
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          id={`quick-add-${product.id}`}
                          className={`flex-1 py-3 text-xs uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-2 transition-all ${
                            addedItemEffect === product.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-black hover:bg-neutral-100'
                          }`}
                        >
                          {addedItemEffect === product.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductForQuickView(product);
                          }}
                          className="p-3 bg-black/60 text-white hover:bg-black text-xs transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Product Metadata Details */}
                    <div className="p-2.5 sm:p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest text-neutral-400 mb-1">
                          <span className="truncate">{product.cat}</span>
                          {product.sizes && product.sizes.length > 0 && (
                            <span className="text-[9px] sm:text-[10px] text-neutral-400 hidden sm:inline">
                              {product.sizes.join(' · ')}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-xs sm:text-base md:text-lg font-medium text-neutral-900 dark:text-neutral-100 group-hover:underline line-clamp-1 leading-snug">
                          {product.name}
                        </h3>
                      </div>

                      <div className="mt-2 sm:mt-4 flex items-center justify-between pt-2 sm:pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                        <span className="font-sans text-xs sm:text-base font-semibold text-neutral-900 dark:text-neutral-100">
                          ${product.price.toFixed(2)}
                        </span>

                        {/* Touch-Friendly Add Button on Mobile */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          id={`mobile-quick-add-${product.id}`}
                          className={`sm:hidden px-2 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 transition-all ${
                            addedItemEffect === product.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-black text-white dark:bg-white dark:text-black'
                          }`}
                          aria-label={`Add ${product.name} to bag`}
                        >
                          {addedItemEffect === product.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>

                        <span className="hidden sm:inline text-[10px] tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
                          Pay on Delivery
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
