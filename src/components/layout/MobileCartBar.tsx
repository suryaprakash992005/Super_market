import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, cn } from '../../lib/utils';
import { useLocation } from 'react-router-dom';

export const MobileCartBar: React.FC = () => {
  const { cartCount, cartTotal, setIsCartOpen, cartBounce } = useStore();
  const location = useLocation();

  // Hide on checkout, cart, order pages, or product detail page where dedicated purchase bar is present
  const isProductDetailPage = /^\/product\/[^/]+$/.test(location.pathname);
  if (
    cartCount === 0 ||
    location.pathname === '/checkout' ||
    location.pathname.startsWith('/orders') ||
    location.pathname === '/cart' ||
    isProductDetailPage
  ) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-[60px] left-0 right-0 z-40 px-3 py-2 pointer-events-none animate-sheet-up">
      <div
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto bg-stone-900 text-white rounded-2xl px-4 py-3 shadow-2xl flex items-center justify-between border border-stone-800 active:scale-[0.98] transition-all cursor-pointer ring-1 ring-white/10 min-h-[56px]"
      >
        {/* Left: icon + price */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "w-10 h-10 rounded-xl bg-brand-crimson text-white flex items-center justify-center relative shadow-sm shrink-0",
            cartBounce && "animate-cart-bounce"
          )}>
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-brand-crimson font-black text-[9px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center shadow-xs text-[10px] px-1">
              {cartCount}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base text-white tracking-tight leading-none">
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium mt-0.5 leading-none">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} • Ready
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-1.5 bg-brand-crimson text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs shrink-0">
          <span>View Basket</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
