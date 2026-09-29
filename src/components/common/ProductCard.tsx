import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Check, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, calculateDiscount, cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  layout?: 'standard' | 'horizontal' | 'minimal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className,
  layout = 'standard' 
}) => {
  const { 
    cart, 
    addToCart, 
    updateCartQuantity, 
    toggleWishlist, 
    isInWishlist 
  } = useStore();

  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);

  const cartItem = cart.find(item => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const isWishlisted = isInWishlist(product.id);
  const discount = calculateDiscount(product.mrp, product.price);
  const secondaryImage = product.images[1] || product.images[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartQuantity(product.id, quantity - 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlistAnimating(true);
    toggleWishlist(product.id);
    setTimeout(() => setIsWishlistAnimating(false), 450);
  };

  return (
    <motion.div 
      whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      className={cn(
        "group relative flex flex-col justify-between transition-shadow duration-300 select-none",
        // Clean frameless open design, removing rigid box borders, touch-optimized
        "bg-white rounded-2xl p-2.5 sm:p-3.5 border border-surface-border/50 hover:border-surface-border hover:shadow-card shadow-2xs",
        !product.inStock && "opacity-70 grayscale-[30%]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Media Canvas with Secondary Image Crossfade */}
      <div className="relative aspect-[4/3.8] w-full rounded-xl bg-stone-100/70 overflow-hidden">
        <Link 
          to={`/product/${product.slug || product.id}`} 
          className="block w-full h-full relative"
        >
          {/* Primary image */}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover object-center transition-all duration-500",
              isHovered && product.images.length > 1 ? "opacity-0 scale-105" : "opacity-100 scale-100",
              isHovered && product.images.length === 1 ? "scale-105" : ""
            )}
          />

          {/* Secondary image reveal on hover */}
          {product.images.length > 1 && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate`}
              loading="lazy"
              className={cn(
                "absolute inset-0 w-full h-full object-cover object-center transition-all duration-500",
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-95"
              )}
            />
          )}
        </Link>

        {/* Minimal Badges Overlay */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 items-start pointer-events-none z-10">
          {discount > 0 && (
            <span className="bg-brand-crimson text-white text-[9px] sm:text-[10px] font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-full shadow-xs">
              {discount}% OFF
            </span>
          )}
          {product.isDailyStaple && (
            <span className="hidden xs:inline-block bg-stone-900/85 backdrop-blur-xs text-stone-100 text-[8px] sm:text-[9px] font-medium tracking-wide px-1.5 sm:px-2 py-0.5 rounded-full">
              Essential
            </span>
          )}
        </div>

        {/* Wishlist Button (Enlarged 40px touch zone for mobile) */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={cn(
            "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 active:scale-90",
            isWishlisted 
              ? "bg-brand-crimson text-white shadow-xs" 
              : "bg-white/85 backdrop-blur-xs text-stone-600 hover:text-brand-crimson hover:bg-white shadow-2xs sm:opacity-0 sm:group-hover:opacity-100",
            isWishlistAnimating && "animate-heart-pulse"
          )}
        >
          <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-white/95 text-stone-900 font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-xs">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Meta & Information */}
      <div className="pt-2 sm:pt-3 pb-0.5 flex flex-col flex-grow justify-between">
        <div>
          {/* Department Tag & Unit */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted mb-0.5 sm:mb-1">
            <span className="font-medium tracking-wider uppercase text-stone-500 truncate max-w-[90px] sm:max-w-[130px]">
              {product.categoryName}
            </span>
            <span className="text-stone-500 font-semibold bg-stone-100 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px]">
              {product.unit}
            </span>
          </div>

          {/* Product Title */}
          <Link 
            to={`/product/${product.slug || product.id}`}
            className="block font-medium text-obsidian text-xs sm:text-sm leading-snug line-clamp-2 hover:text-brand-crimson transition-colors min-h-[2rem] sm:min-h-[2.25rem]"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* 3. Pricing & Cart Action */}
        <div className="mt-2 pt-2 border-t border-surface-border/40 flex items-center justify-between gap-1.5">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-xs sm:text-base text-obsidian tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through truncate">
                  {formatCurrency(product.mrp)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-stone-400 hidden xs:inline-block">Taxes incl.</span>
          </div>

          {/* Mobile Quick-Commerce Add / Stepper Action (Min 40px touch ergonomics) */}
          <div className="shrink-0">
            {!product.inStock ? (
              <span className="text-[10px] text-stone-400 italic">Out</span>
            ) : quantity === 0 ? (
              <button
                onClick={handleAdd}
                className={cn(
                  "relative inline-flex items-center justify-center gap-1 h-8 sm:h-8 px-3 sm:px-3.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-2xs active:scale-95",
                  justAdded 
                    ? "bg-emerald-600 text-white scale-105" 
                    : "bg-white border-2 border-brand-crimson text-brand-crimson hover:bg-brand-crimson hover:text-white"
                )}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ADD</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center border-2 border-brand-crimson rounded-full bg-red-50/50 overflow-hidden shadow-2xs">
                <button
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-brand-crimson hover:bg-brand-crimson hover:text-white transition-colors active:scale-90"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="w-5 sm:w-6 text-center font-bold text-xs text-brand-crimson">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-brand-crimson hover:bg-brand-crimson hover:text-white transition-colors active:scale-90"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
