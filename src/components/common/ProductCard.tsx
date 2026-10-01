import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Minus, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
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

  // Pack size variant selection if available
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    return product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
  });

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const currentUnit = selectedVariant ? selectedVariant.unit : product.unit;
  const currentInStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  const discount = calculateDiscount(currentMrp, currentPrice);

  // Cart quantity check matching product and variant
  const cartItem = cart.find(item => 
    item.product.id === product.id && 
    (selectedVariant ? item.selectedVariant?.id === selectedVariant.id : !item.selectedVariant)
  );
  const quantity = cartItem?.quantity || 0;
  const isWishlisted = isInWishlist(product.id);
  const secondaryImage = product.images[1] || product.images[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentInStock) return;
    
    addToCart(product, 1, undefined, selectedVariant);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartQuantity(product.id, quantity + 1, selectedVariant?.id);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateCartQuantity(product.id, quantity - 1, selectedVariant?.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlistAnimating(true);
    toggleWishlist(product.id);
    setTimeout(() => setIsWishlistAnimating(false), 450);
  };

  return (
    <div 
      className={cn(
        "group relative flex flex-col justify-between transition-all duration-300 select-none h-full",
        "bg-white rounded-2xl p-2.5 sm:p-3 border border-stone-200/90 hover:border-brand-crimson/40 hover:shadow-card shadow-subtle",
        !currentInStock && "opacity-75 grayscale-[20%]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Strict 1:1 Square Media Canvas with Crossfade */}
      <div className="relative aspect-square w-full rounded-xl bg-[#F8F7F4] overflow-hidden shrink-0 border border-stone-100">
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
              "w-full h-full object-cover object-center transition-all duration-500 ease-out",
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
                "absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out",
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-95"
              )}
            />
          )}
        </Link>

        {/* Minimal Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start pointer-events-none z-10">
          {discount > 0 && (
            <span className="bg-gradient-to-r from-brand-crimson to-brand-crimson-dark text-white text-[9.5px] sm:text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              {discount}% OFF
            </span>
          )}
          {product.isDailyStaple && (
            <span className="bg-stone-900/85 backdrop-blur-xs text-white text-[8.5px] sm:text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-full">
              Essential
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={cn(
            "absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 active:scale-90",
            isWishlisted 
              ? "bg-brand-crimson text-white shadow-xs" 
              : "bg-white/90 backdrop-blur-xs text-stone-500 hover:text-brand-crimson hover:bg-white shadow-2xs sm:opacity-0 sm:group-hover:opacity-100",
            isWishlistAnimating && "animate-heart-pulse"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", isWishlisted && "fill-current")} />
        </button>

        {/* Out of Stock Overlay */}
        {!currentInStock && (
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-white/95 text-stone-900 font-bold text-[10px] sm:text-[11px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Meta & Information */}
      <div className="pt-2.5 pb-0.5 flex flex-col flex-grow justify-between">
        <div>
          {/* Department / Brand & Unit */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted mb-1">
            <span className="font-bold tracking-wider uppercase text-stone-500 truncate max-w-[105px] sm:max-w-[130px]">
              {product.brand || product.categoryName}
            </span>
            <span className="text-stone-700 font-bold bg-stone-100 px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] shrink-0">
              {currentUnit}
            </span>
          </div>

          {/* Product Title with strict min-height for uniform rail alignment */}
          <Link 
            to={`/product/${product.slug || product.id}`}
            className="block font-semibold text-stone-900 text-xs sm:text-[13px] leading-snug line-clamp-2 hover:text-brand-crimson transition-colors min-h-[2.4rem] sm:min-h-[2.6rem]"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Pack Size Variants Selector with reserved min-height for laser alignment */}
          <div className="min-h-[28px] mt-1.5 flex items-center">
            {product.variants && product.variants.length > 1 ? (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(v);
                    }}
                    className={cn(
                      "px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold rounded-lg border transition-all whitespace-nowrap shrink-0 active:scale-95",
                      selectedVariant?.id === v.id
                        ? "bg-red-50 text-brand-crimson border-brand-crimson shadow-2xs ring-1 ring-brand-crimson/25"
                        : "bg-[#F7F6F3] text-stone-600 border-stone-200/90 hover:border-stone-400 hover:bg-stone-100"
                    )}
                  >
                    {v.unit}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-medium text-stone-400">Standard pack</span>
            )}
          </div>
        </div>

        {/* 3. Pricing & Cart Action */}
        <div className="mt-2.5 pt-2 border-t border-surface-border/50 flex items-center justify-between gap-1.5">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-sm sm:text-base text-stone-900 tracking-tight">
                {formatCurrency(currentPrice)}
              </span>
              {currentMrp > currentPrice && (
                <span className="text-[10.5px] sm:text-xs text-stone-400 line-through truncate font-medium">
                  {formatCurrency(currentMrp)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-stone-400 leading-none mt-0.5">Taxes incl.</span>
          </div>

          {/* Quick-Commerce Add / Stepper Action */}
          <div className="shrink-0">
            {!currentInStock ? (
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-stone-100 px-2 py-1 rounded-md">
                Out
              </span>
            ) : quantity === 0 ? (
              <button
                onClick={handleAdd}
                className={cn(
                  "relative inline-flex items-center justify-center gap-1 h-8 px-3 sm:px-3.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all duration-200 shadow-2xs active:scale-95 border-2",
                  justAdded 
                    ? "bg-emerald-600 border-emerald-600 text-white scale-105" 
                    : "bg-white border-brand-crimson text-brand-crimson hover:bg-brand-crimson hover:text-white"
                )}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span className="hidden xs:inline">Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ADD</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center border-2 border-brand-crimson rounded-xl sm:rounded-full bg-red-50/70 overflow-hidden shadow-2xs">
                <button
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-brand-crimson hover:bg-brand-crimson hover:text-white transition-colors active:scale-90"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
                <span className="w-5 sm:w-6 text-center font-black text-xs text-brand-crimson">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-brand-crimson hover:bg-brand-crimson hover:text-white transition-colors active:scale-90"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
