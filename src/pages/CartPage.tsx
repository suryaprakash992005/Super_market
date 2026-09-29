import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/utils';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    deliveryFee, 
    freeDeliveryThreshold, 
    amountNeededForFreeDelivery, 
    cartTotal,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon
  } = useStore();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
            Your Supermarket Basket is Empty
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
            You don't have any items in your basket yet. Stock up on farm vegetables, fresh milk, daily staples, and provisions.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-crimson hover:bg-brand-crimson-dark text-white font-semibold text-xs rounded-xl shadow-crimson transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-5 sm:space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-4">
        <div>
          <h1 className="font-serif text-xl sm:text-3xl font-bold text-obsidian">
            Basket ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>
          <p className="text-xs text-muted mt-0.5 hidden sm:block">
            Review your items and proceed to choose doorstep delivery or store pickup.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline self-start sm:self-auto font-medium"
        >
          Clear Basket
        </button>
      </div>

      {/* Free Delivery Progress Bar */}
      <div className="bg-brand-crimson-tint p-3.5 sm:p-4 rounded-xl border border-brand-crimson/20 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-crimson gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Truck className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {amountNeededForFreeDelivery > 0
                ? `Add ${formatCurrency(amountNeededForFreeDelivery)} for FREE Delivery!`
                : 'FREE Delivery Unlocked! 🎉'}
            </span>
          </div>
          <span className="shrink-0">{freeDeliveryProgress}%</span>
        </div>
        <div className="w-full bg-brand-crimson/20 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-crimson h-full rounded-full transition-all duration-300"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle divide-y divide-surface-border">
          {cart.map((item) => (
            <div key={item.product.id} className="p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4">
              {/* Image */}
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-surface-border shrink-0 bg-stone-50"
              />

              {/* Info + Controls */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                {/* Top: name + remove */}
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/product/${item.product.slug || item.product.id}`}
                    className="font-semibold text-xs sm:text-sm text-obsidian hover:text-brand-crimson transition-colors leading-snug line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1 -mt-0.5 shrink-0"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Unit */}
                <p className="text-[11px] text-muted">
                  {item.product.unit} · {formatCurrency(item.product.price)} each
                </p>

                {/* Bottom: stepper + line total */}
                <div className="flex items-center justify-between gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-surface-border-strong rounded-lg bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-obsidian">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <span className="font-bold text-sm text-obsidian">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Bill Details & Promo */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon input */}
          <div className="bg-white rounded-2xl p-5 border border-surface-border shadow-subtle space-y-3">
            <h3 className="font-semibold text-xs text-obsidian uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-brand-crimson" />
              <span>Apply Supermarket Coupon</span>
            </h3>

            {couponCode ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-supermarket-fresh">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Coupon <strong>{couponCode}</strong> applied (-{formatCurrency(couponDiscount)})</span>
                </div>
                <button onClick={removeCoupon} className="text-stone-500 hover:text-stone-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Try BHARATHI50"
                  className="flex-1 text-xs px-3 py-2 border border-surface-border rounded-lg uppercase tracking-wider focus:border-brand-crimson focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
                >
                  Apply
                </button>
              </form>
            )}

            {couponFeedback && !couponCode && (
              <p className="text-[11px] text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{couponFeedback.message}</span>
              </p>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-2xl p-5 border border-surface-border shadow-subtle space-y-4">
            <h3 className="font-serif text-lg font-bold text-obsidian border-b border-surface-border pb-3">
              Bill Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-medium text-stone-900">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-supermarket-fresh font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-supermarket-fresh font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-surface-border flex justify-between items-baseline">
                <span className="font-bold text-sm text-obsidian">To Pay</span>
                <span className="font-serif text-2xl font-bold text-brand-crimson">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white font-semibold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-crimson active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted pt-1">
              <ShieldCheck className="w-4 h-4 text-supermarket-fresh" />
              <span>Safe & Secure Bank-Level Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
