import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQty, 
    removeFromCart, 
    cartSubtotal, 
    shippingFee, 
    cartTotal,
    setIsCheckoutOpen
  } = useApp();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0f0f0f] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between animate-slide-left">
          
          {/* Cart Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="font-serif text-xl font-medium tracking-wide">Your Shopping Bag</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">You unlocked Free Express Shipping!</span>
                ) : (
                  <span>Add ${remainingForFreeShipping.toFixed(2)} more for <strong>Free Shipping</strong></span>
                )}
              </span>
              <span className="font-bold">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-neutral-900 dark:bg-white transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center text-neutral-400">
                <ShoppingBag className="w-12 h-12 stroke-[1.2] mb-4 opacity-40" />
                <p className="font-serif text-lg text-neutral-800 dark:text-neutral-200 mb-1">Your bag is empty</p>
                <p className="text-xs uppercase tracking-wider mb-6">Discover timeless pieces in our collection</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black text-xs uppercase tracking-[0.2em] font-semibold"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800/60"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.img}
                    alt={item.product.name}
                    className="w-20 h-26 object-cover object-center bg-neutral-100 dark:bg-neutral-900 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-medium text-neutral-900 dark:text-neutral-100 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-neutral-400 hover:text-red-500 transition-colors ml-2"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                        Size: <span className="text-neutral-700 dark:text-neutral-300 font-semibold">{item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center border border-neutral-200 dark:border-neutral-800 text-xs">
                        <button
                          onClick={() => updateQty(item.product.id, item.size, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.size, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/30 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Estimated Delivery</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-neutral-900 dark:text-neutral-100 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-white dark:bg-black/60 border border-neutral-200 dark:border-neutral-800 rounded-xs text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Payment on Delivery option ready at checkout — inspect upon arrival before paying.</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                id="drawer-checkout-btn"
                className="w-full py-4 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Delivery & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
