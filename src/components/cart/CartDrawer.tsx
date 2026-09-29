import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { EASE_PREMIUM } from '../../lib/motion';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    freeDeliveryThreshold, 
    amountNeededForFreeDelivery, 
    deliveryFee, 
    cartTotal,
    couponDiscount
  } = useStore();

  const navigate = useNavigate();

  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Container: Bottom Sheet on Mobile (< 768px), Right Drawer on Desktop (>= 768px) */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
            className="fixed inset-x-0 bottom-0 md:inset-y-0 md:left-auto md:right-0 max-h-[92vh] md:max-h-full w-full md:w-screen md:max-w-md bg-white rounded-t-3xl md:rounded-none shadow-2xl flex flex-col justify-between overflow-hidden z-50"
          >
            {/* Mobile Pull Handle */}
            <div className="md:hidden flex items-center justify-center pt-2.5 pb-1 bg-surface-subtle shrink-0">
              <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
            </div>

            {/* Top Header */}
            <div className="shrink-0">
              <div className="px-4 py-3 sm:p-5 border-b border-surface-border flex items-center justify-between bg-surface-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-crimson/10 text-brand-crimson flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-obsidian tracking-tight leading-none">
                      Supermarket Basket
                    </h2>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {cart.reduce((s, i) => s + i.quantity, 0)} items in basket
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close basket"
                  className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-obsidian hover:bg-stone-200/60 rounded-full transition-colors active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Delivery Bar */}
              <div className="bg-brand-crimson-tint px-4 sm:px-5 py-2.5 border-b border-brand-crimson/15 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-brand-crimson">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>
                      {amountNeededForFreeDelivery > 0
                        ? `Add ${formatCurrency(amountNeededForFreeDelivery)} more for FREE Delivery`
                        : "🎉 FREE Supermarket Delivery Unlocked!"}
                    </span>
                  </div>
                  <span>{freeDeliveryProgress}%</span>
                </div>
                <div className="w-full bg-brand-crimson/20 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-crimson h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-obsidian">Your Basket is Empty</h3>
                    <p className="text-xs text-muted mt-1 max-w-[240px]">
                      Discover fresh produce, daily staples and provisions from Bharathi Store.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/products');
                    }}
                    className="px-6 py-2.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
                  >
                    Browse Provisions
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div 
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3.5 pb-4 border-b border-surface-border/60 last:border-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-surface-border/60 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <Link 
                            to={`/product/${item.product.slug || item.product.id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs font-semibold text-obsidian line-clamp-2 hover:text-brand-crimson transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-red-600 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-muted mt-0.5">
                          Pack: {item.product.unit}
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-baseline gap-1">
                            <span className="font-bold text-xs text-obsidian">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              ({formatCurrency(item.product.price)} ea)
                            </span>
                          </div>

                          {/* Pill Stepper */}
                          <div className="flex items-center border border-surface-border rounded-full bg-stone-50 overflow-hidden shadow-2xs">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors"
                              aria-label="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Bottom Checkout Actions */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-surface-border bg-surface-subtle space-y-3.5 shrink-0">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartSubtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Coupon Applied</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted">
                    <span>Standard Delivery</span>
                    <span>{deliveryFee === 0 ? <strong className="text-emerald-700 uppercase">FREE</strong> : formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-obsidian text-sm pt-2 border-t border-surface-border">
                    <span>To Pay</span>
                    <span className="text-brand-crimson">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-crimson active:scale-[0.99] cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Genuine Supermarket Quality &amp; Safe Packaging</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
