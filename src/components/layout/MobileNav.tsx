import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Layers, ShoppingBag, ReceiptText, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/utils';

export const MobileNav: React.FC = () => {
  const { cartCount, setIsCartOpen, cartBounce, user, setIsAuthModalOpen } = useStore();
  const location = useLocation();

  // Hide mobile nav during full-page checkout, dedicated shop bill permalink, or product detail page
  // Note: product detail route is /product/:id (singular), NOT /products/:id
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
    { label: 'Aisles', path: '/categories', icon: Layers },
    { 
      label: 'Basket', 
      isCartButton: true, 
      icon: ShoppingBag, 
      badge: cartCount 
    },
    { label: 'Orders', path: '/orders', icon: ReceiptText },
    { label: 'Account', path: '/account', icon: User, requiresAuth: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom,0.6rem))] select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCartButton) {
            return (
              <button
                key={item.label}
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] p-1 text-stone-600 active:scale-95 transition-all relative group"
                aria-label="View basket"
              >
                <div className="relative">
                  <Icon className={cn(
                    "w-5 h-5 transition-transform group-active:scale-110",
                    cartCount > 0 ? "text-brand-crimson" : "text-stone-700"
                  )} />
                  {item.badge !== undefined && item.badge > 0 ? (
                    <span className={cn(
                      "absolute -top-1.5 -right-2.5 bg-brand-crimson text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs",
                      cartBounce && "animate-cart-bounce"
                    )}>
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className={cn(
                  "text-[10px] font-semibold mt-1 tracking-tight leading-none",
                  cartCount > 0 ? "text-brand-crimson" : "text-stone-600"
                )}>
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.requiresAuth && !user) {
            return (
              <button
                key={item.label}
                onClick={() => setIsAuthModalOpen(true)}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] p-1 text-stone-600 active:scale-95 transition-all group"
                aria-label="Account login"
              >
                <Icon className="w-5 h-5 text-stone-700 group-hover:text-brand-crimson transition-colors" />
                <span className="text-[10px] font-medium mt-1 text-stone-600 tracking-tight leading-none">
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
                  "flex flex-col items-center justify-center min-w-[56px] min-h-[44px] p-1 transition-all relative active:scale-95",
                  isActive 
                    ? "text-brand-crimson font-bold" 
                    : "text-stone-600 hover:text-stone-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center">
                    <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-105 stroke-[2.4]")} />
                  </div>
                  <span className={cn("text-[10px] mt-1 tracking-tight leading-none", isActive ? "font-bold text-brand-crimson" : "font-medium text-stone-600")}>
                    {item.label}
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

