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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
            Shopping Basket ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Review your items and proceed to choose doorstep delivery or store pickup.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline self-start sm:self-auto font-medium"
        >
          Empty Entire Basket
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-brand-crimson-tint p-4 rounded-xl border border-brand-crimson/20 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-crimson">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>
              {amountNeededForFreeDelivery > 0
                ? `Add ${formatCurrency(amountNeededForFreeDelivery)} more to qualify for FREE Delivery!`
                : "Congratulations! You have unlocked FREE Supermarket Doorstep Delivery."}
            </span>
          </div>
          <span>{freeDeliveryProgress}%</span>
        </div>
        <div className="w-full bg-brand-crimson/20 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-brand-crimson h-full rounded-full transition-all duration-300"
            style={{ width: `${freeDeliveryProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle divide-y divide-surface-border">
          {cart.map((item) => {
            const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.product.price;
            const itemUnit = item.selectedVariant ? `${item.selectedVariant.name} (${item.selectedVariant.unit})` : item.product.unit;

            return (
              <div 
                key={`${item.product.id}-${item.selectedVariant?.id || 'base'}`} 
                className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-surface-border shrink-0 bg-stone-50"
                  />
                  <div className="space-y-1 min-w-0">
                    <Link 
                      to={`/product/${item.product.slug || item.product.id}`}
                      className="font-semibold text-sm text-obsidian hover:text-brand-crimson transition-colors block truncate"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted">
                      Pack: <span className="text-stone-700 font-medium">{itemUnit}</span>
                    </p>
                    <p className="text-xs text-stone-600">
                      {formatCurrency(itemPrice)} each
                    </p>
                  </div>
                </div>

                {/* Stepper and Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-border/60">
                  <div className="flex items-center border border-surface-border-strong rounded-lg bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                      className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-200"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-obsidian">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                      className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-200"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <span className="font-bold text-sm text-obsidian block">
                      {formatCurrency(itemPrice * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                      className="text-[11px] text-stone-400 hover:text-red-600 transition-colors mt-0.5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
