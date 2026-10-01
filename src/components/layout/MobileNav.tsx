import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Layers, Search, ShoppingBag, ReceiptText, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/utils';

export const MobileNav: React.FC = () => {
  const { cartCount, setIsCartOpen, cartBounce, user } = useStore();
  const location = useLocation();

  // Hide mobile nav during full-page checkout, dedicated shop bill permalink, or product detail page
  const isProductDetailPage = /^\/product\/[^/]+$/.test(location.pathname);
  if (
    location.pathname === '/checkout' || 
    location.pathname.endsWith('/bill') ||
    isProductDetailPage
  ) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Orders', path: '/orders', icon: ReceiptText },
    { label: 'Account', path: '/account', icon: User },
    { 
      label: 'Cart', 
      isCartButton: true, 
      icon: ShoppingBag, 
      badge: cartCount 
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 pt-1.5 pb-[max(0.55rem,env(safe-area-inset-bottom,0.55rem))] select-none">
      <div className="grid grid-cols-6 items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCartButton) {
            return (
              <button
                key={item.label}
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center justify-center min-h-[44px] py-0.5 text-stone-600 active:scale-95 transition-all relative group"
                aria-label="View basket"
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={cn(
                    "w-5 h-5 transition-transform group-active:scale-110",
                    cartCount > 0 ? "text-brand-crimson stroke-[2.3]" : "text-stone-700 stroke-[2]"
                  )} />
                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className={cn(
                      "absolute -top-1.5 -right-2 bg-brand-crimson text-white text-[9.5px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs",
                      cartBounce && "animate-cart-bounce"
                    )}>
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className={cn(
                  "text-[9.5px] xs:text-[10px] font-semibold mt-1 tracking-tight leading-none truncate max-w-[52px]",
                  cartCount > 0 ? "text-brand-crimson font-bold" : "text-stone-600"
                )}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path!}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center min-h-[44px] py-0.5 transition-all relative active:scale-95 group",
                  isActive 
                    ? "text-brand-crimson font-bold" 
                    : "text-stone-600 hover:text-stone-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center">
                    <Icon className={cn(
                      "w-5 h-5 transition-transform", 
                      isActive ? "scale-105 text-brand-crimson stroke-[2.4]" : "text-stone-700 stroke-[2] group-hover:text-stone-900"
                    )} />
                  </div>
                  <span className={cn(
                    "text-[9.5px] xs:text-[10px] mt-1 tracking-tight leading-none truncate max-w-[56px]", 
                    isActive ? "font-bold text-brand-crimson" : "font-medium text-stone-600"
                  )}>
                    {item.label === 'Account' && user ? (user.fullName ? user.fullName.split(' ')[0] : 'Profile') : item.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson mt-0.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
