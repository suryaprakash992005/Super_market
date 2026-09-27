import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, cn } from '../../lib/utils';
import { useLocation } from 'react-router-dom';

export const MobileCartBar: React.FC = () => {
  const { cartCount, cartTotal, setIsCartOpen, cartBounce } = useStore();
  const location = useLocation();

  // Hide on checkout, cart, order pages, or product detail page where dedicated purchase bar is present
  const isProductDetailPage = location.pathname.startsWith('/products/') && location.pathname !== '/products';
  if (
    cartCount === 0 || 
    location.pathname === '/checkout' || 
    location.pathname.startsWith('/orders') ||
    isProductDetailPage
  ) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-[60px] left-0 right-0 z-40 px-3 py-1.5 pointer-events-none animate-sheet-up">
      <div 
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto bg-stone-900 text-white rounded-2xl p-3 shadow-2xl flex items-center justify-between border border-stone-800 active:scale-[0.98] transition-all cursor-pointer ring-1 ring-white/10"
      >
        {/* Left item details & price */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl bg-brand-crimson text-white flex items-center justify-center relative shadow-sm",
            cartBounce && "animate-cart-bounce"
          )}>
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-white text-brand-crimson font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">
                {formatCurrency(cartTotal)}
              </span>
              <span className="text-[10px] text-stone-400">
                ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium leading-none mt-0.5">
              Supermarket Express Ready
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-1.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors">
          <span>View Basket</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
