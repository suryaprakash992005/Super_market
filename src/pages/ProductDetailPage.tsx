import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  MapPin, 
  ChevronRight,
  Sparkles,
  Info,
  ArrowRight,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductVariant } from '../types';
import { formatCurrency, calculateDiscount, cn } from '../lib/utils';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    products, 
    addToCart, 
    cart, 
    toggleWishlist, 
    isInWishlist, 
    settings,
    setIsCartOpen
  } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [pincodeInput, setPincodeInput] = useState<string>('625001');
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const product = products.find(p => p.slug === id || p.id === id) || products[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    return product?.variants && product.variants.length > 0 ? product.variants[0] : undefined;
  });

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(undefined);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <Link to="/products" className="text-brand-crimson underline mt-2 inline-block">
          Return to Supermarket Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const currentUnit = selectedVariant ? `${selectedVariant.name} (${selectedVariant.unit})` : product.unit;
  const currentInStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  const discount = calculateDiscount(currentMrp, currentPrice);

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, undefined, selectedVariant);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1200);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, undefined, selectedVariant);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Touch swipe handling for mobile gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      // Swiped left -> next
      setSelectedImageIdx(prev => (prev + 1) % product.images.length);
    } else if (diff < -45) {
      // Swiped right -> prev
      setSelectedImageIdx(prev => (prev - 1 + product.images.length) % product.images.length);
    }
    setTouchStart(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-16 font-sans pb-36 md:pb-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted overflow-x-auto no-scrollbar py-1">
        <Link to="/" className="hover:text-brand-crimson shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link to="/products" className="hover:text-brand-crimson shrink-0">Provisions</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link to={`/products?category=${product.category}`} className="hover:text-brand-crimson shrink-0">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-obsidian font-medium truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout: Open, Editorial Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div 
            className="relative aspect-square sm:aspect-[4/3.8] rounded-3xl bg-stone-100 overflow-hidden shadow-card border border-surface-border/40 touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300 select-none"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-brand-crimson text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full shadow-xs">
                {discount}% SAVINGS
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                "absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors shadow-md",
                isWishlisted ? "bg-brand-crimson text-white" : "bg-white/90 backdrop-blur-xs text-stone-700 hover:text-brand-crimson"
              )}
              aria-label="Wishlist toggle"
            >
              <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
            </button>

            {/* Mobile Image Indicator: 1 / N count */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-stone-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                {selectedImageIdx + 1} / {product.images.length}
              </div>
            )}

            {/* Mobile Swipe indicator dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:hidden bg-stone-900/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                {product.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      selectedImageIdx === idx ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={cn(
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden bg-stone-50 transition-all shrink-0",
                    selectedImageIdx === idx 
                      ? "border-brand-crimson ring-3 ring-brand-crimson/15" 
                      : "border-surface-border opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Story & Purchase (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-crimson">
                {product.categoryName}
              </span>
              <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {product.origin}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-supermarket-fresh font-bold">
                <span>{product.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-muted">
                ({product.reviewCount} customer reviews)
              </span>
              <span className="text-stone-300">•</span>
              <span className={cn("font-medium", product.inStock ? "text-supermarket-fresh" : "text-red-600")}>
                {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Temporarily Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing display */}
          <div className="pt-2 border-t border-surface-border space-y-3">
            <div className="flex items-center gap-2">
              {product.brand && (
                <span className="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-md">
                  Brand: {product.brand}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-obsidian">
                {formatCurrency(currentPrice)}
              </span>
              {currentMrp > currentPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    {formatCurrency(currentMrp)}
                  </span>
                  <span className="text-xs font-bold text-supermarket-fresh bg-green-50 px-2.5 py-0.5 rounded-full">
                    Save {formatCurrency(currentMrp - currentPrice)}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-stone-500">
              Selected Pack: <strong className="text-obsidian">{currentUnit}</strong> • Inclusive of all taxes
            </p>

            {/* Pack Size Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-obsidian block">
                  Select Pack Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const vDiscount = calculateDiscount(v.mrp, v.price);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          "px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 min-h-[40px]",
                          isSelected
                            ? "border-brand-crimson bg-red-50/80 text-brand-crimson shadow-xs ring-1 ring-brand-crimson"
                            : "border-surface-border bg-white text-stone-700 hover:bg-stone-50"
                        )}
                      >
                        <span>{v.name} ({v.unit})</span>
                        <span className="font-bold text-obsidian">{formatCurrency(v.price)}</span>
                        {vDiscount > 0 && (
                          <span className="text-[10px] text-supermarket-fresh font-bold">
                            {vDiscount}% OFF
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed pt-2">
            <p>{product.description}</p>
            {product.nutritionalHighlights && (
              <div className="flex flex-wrap gap-2 pt-1">
                {product.nutritionalHighlights.map((n, i) => (
                  <span key={i} className="bg-white border border-surface-border text-stone-800 text-[11px] font-medium px-3 py-1 rounded-full shadow-2xs">
                    ✓ {n}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Window Validator */}
          <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-subtle space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-obsidian flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-crimson" />
                <span>Express Supermarket Delivery</span>
              </span>
              <span className="text-[11px] text-supermarket-fresh font-bold">Standard 2-Hour Window</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                className="w-36 text-xs px-3 py-1.5 border border-surface-border rounded-full"
              />
              <button
                type="button"
                onClick={() => setPincodeChecked(true)}
                className="px-4 py-1.5 bg-stone-900 text-white font-semibold rounded-full text-xs hover:bg-stone-800"
              >
                Check Slot
              </button>
            </div>
            {pincodeChecked && (
              <p className="text-[11px] text-supermarket-fresh flex items-center gap-1 pt-1">
                <Check className="w-3.5 h-3.5" />
                <span>Delivery active for Pincode {pincodeInput}. Free on orders above {formatCurrency(settings.minOrderForFreeDelivery)}.</span>
              </p>
            )}
          </div>

          {/* Purchase Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-stone-700">Select Quantity:</span>
              <div className="flex items-center border border-surface-border rounded-full bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-xs text-obsidian">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-stone-500">
                Item Total: <strong className="text-obsidian">{formatCurrency(currentPrice * quantity)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!currentInStock}
                className={cn(
                  "py-3.5 rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-crimson active:scale-98 min-h-[44px]",
                  addedNotice 
                    ? "bg-supermarket-fresh text-white"
                    : "bg-brand-crimson hover:bg-brand-crimson-dark text-white"
                )}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!currentInStock}
                className="py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 min-h-[44px]"
              >
                <span>Instant Buy Now</span>
              </button>
            </div>

            {product.storageInstructions && (
              <div className="flex items-start gap-2 text-[11px] text-stone-500 bg-white p-3 rounded-2xl border border-surface-border">
                <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span><strong>Freshness Care:</strong> {product.storageInstructions}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Provisions */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-surface-border">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-crimson block mb-1">
                Complementary Selections
              </span>
              <h2 className="font-serif text-2xl font-bold text-obsidian">
                Frequently Bought with this Item
              </h2>
            </div>
            <Link
              to={`/products?category=${product.category}`}
              className="text-xs font-semibold text-brand-crimson hover:underline flex items-center gap-1"
            >
              <span>Explore Full Aisle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Purchase Bar (Fixed at bottom with Safe Area) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-stone-200/90 px-4 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom,0.85rem))] shadow-[0_-6px_25px_rgba(0,0,0,0.08)] animate-sheet-up">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          {/* Price & Unit Details */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl font-bold text-obsidian tracking-tight">
                {formatCurrency(currentPrice * quantity)}
              </span>
              {currentMrp > currentPrice && (
                <span className="text-[10px] text-stone-400 line-through">
                  {formatCurrency(currentMrp * quantity)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-500 font-medium block truncate">
              {currentUnit} • Inclusive of GST
            </span>
          </div>

          {/* Stepper + Add Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 h-10 shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-transform"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-xs text-obsidian select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                className="w-8 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-transform"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Basket Action */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!currentInStock}
              className={cn(
                "h-10 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-crimson active:scale-95",
                addedNotice 
                  ? "bg-supermarket-fresh text-white" 
                  : "bg-brand-crimson text-white hover:bg-brand-crimson-dark"
              )}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
