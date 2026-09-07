import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';

export const ProductQuickView: React.FC = () => {
  const { selectedProductForQuickView, setSelectedProductForQuickView, addToCart } = useApp();
  const product = selectedProductForQuickView;

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
  });
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setSelectedProductForQuickView(null);
    }, 900);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setSelectedProductForQuickView(null)}
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForQuickView(null)}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black dark:hover:text-white bg-white/80 dark:bg-black/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto relative bg-neutral-100 dark:bg-neutral-900 shrink-0">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          {product.tag && (
            <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1">
              {product.tag}
            </span>
          )}
        </div>

        {/* Product Details Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-neutral-400 mb-2">
              <span>{product.cat} collection</span>
              <span>Stock: {product.stock} units</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-neutral-900 dark:text-neutral-50 mb-3">
              {product.name}
            </h2>

            <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed mb-6">
              {product.description ||
                "Exquisitely tailored in our studio. Crafted with premium sustainable yarns, offering structural elegance that transitions effortlessly through all occasions."}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                  <span>Select Size</span>
                  <span className="text-[11px] text-neutral-400">True to Fit</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-10 px-3 text-xs uppercase tracking-wider font-semibold border transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <span className="block text-xs uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                Quantity
              </span>
              <div className="flex items-center border border-neutral-300 dark:border-neutral-700 w-32">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  −
                </button>
                <span className="flex-1 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            {/* Add to Bag Button */}
            <button
              onClick={handleAdd}
              disabled={isAdded}
              className={`w-full py-4 text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 mb-4 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag — ${(product.price * quantity).toFixed(2)}</span>
                </>
              )}
            </button>

            {/* Quick Delivery Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Pay on Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
