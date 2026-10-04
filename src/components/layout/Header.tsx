import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  MapPin, 
  Phone, 
  Clock, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Check,
  Store,
  Tag,
  Loader2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatCurrency, calculateDiscount, cn } from '../../lib/utils';

// Balanced department categories for clean supermarket navigation
const DEPARTMENTS = [
  { slug: 'fruits-vegetables', name: 'Fresh Fruits & Veg' },
  { slug: 'dairy-bakery', name: 'Dairy & Bakery' },
  { slug: 'staples-grains', name: 'Daily Staples' },
  { slug: 'spices-masalas', name: 'Spices & Masalas' },
  { slug: 'snacks-beverages', name: 'Snacks & Drinks' },
  { slug: 'household-cleaning', name: 'Household Care' },
  { slug: 'gourmet-organic', name: 'Dry Fruits & Honey' },
];

const POPULAR_SEARCH_TAGS = [
  'Country Tomatoes',
  'A2 Cow Ghee',
  'Salem Turmeric',
  'Basmati Rice',
  'Farm Spinach',
  'Malai Paneer',
  'Filter Coffee',
];

export const Header: React.FC = () => {
  const { 
    cartCount, 
    cartBounce, 
    setIsCartOpen, 
    wishlist, 
    products, 
    categories, 
    settings, 
    user, 
    setIsAuthModalOpen,
    isAdmin,
    addToCart,
    cart,
    updateCartQuantity,
    addresses
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Customer delivery address selection
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('bharathi_selected_address_id');
      return saved || defaultAddress?.id || 'addr-01';
    } catch {
      return defaultAddress?.id || 'addr-01';
    }
  });

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || defaultAddress;

  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    try {
      localStorage.setItem('bharathi_selected_address_id', addrId);
    } catch {}
    setIsLocationModalOpen(false);
  };

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Auto-focus mobile search input when overlay opens
  useEffect(() => {
    if (isMobileSearchOpen) {
      const timer = setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobileSearchOpen]);

  // Recent searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bharathi_recent_searches');
      return saved ? JSON.parse(saved) : ['Country Tomatoes', 'A2 Cow Ghee', 'Salem Turmeric'];
    } catch {
      return ['Country Tomatoes', 'A2 Cow Ghee', 'Salem Turmeric'];
    }
  });

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('bharathi_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('bharathi_recent_searches');
    } catch {}
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      try {
        localStorage.setItem('bharathi_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Micro-interaction states
  const [isWishlistPulsing, setIsWishlistPulsing] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Global '/' keyboard shortcut to instantly focus search bar
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !isSearchFocused &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSearchFocused]);

  // Filter matching products with real-time scoring
  const matchingProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    
    return products.filter((p: Product) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.categoryName.toLowerCase().includes(q);
      const matchTags = p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q));
      const matchOrigin = p.origin && p.origin.toLowerCase().includes(q);
      const matchDesc = p.description && p.description.toLowerCase().includes(q);
      const matchesCatFilter = selectedCategory === 'all' || p.category === selectedCategory;
      return (matchName || matchCat || matchTags || matchOrigin || matchDesc) && matchesCatFilter;
    }).slice(0, 6);
  }, [searchQuery, products, selectedCategory]);

  // Matching Category suggestions for instant department discovery
  const matchingCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return categories.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.slug.toLowerCase().includes(q) ||
      c.subcategories?.some(s => s.name.toLowerCase().includes(q))
    ).slice(0, 3);
  }, [searchQuery, categories]);

  // Handle typing state
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 120);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
      setSelectedIndex(-1);
    }
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus mobile input when mobile search overlay opens
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Wishlist click animation
  const handleWishlistClick = (e: React.MouseEvent) => {
    setIsWishlistPulsing(true);
    setTimeout(() => setIsWishlistPulsing(false), 450);
  };

  // Keyboard navigation for search suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchFocused && !isMobileSearchOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < matchingProducts.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : matchingProducts.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && matchingProducts[selectedIndex]) {
        const item = matchingProducts[selectedIndex];
        saveRecentSearch(item.name);
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
        navigate(`/product/${item.slug || item.id}`);
      } else if (searchQuery.trim()) {
        saveRecentSearch(searchQuery.trim());
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
      searchInputRef.current?.blur();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`);
    }
  };

  // Instant Add to Cart from Search Suggestion
  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1200);
  };

  // Text highlight helper for search matches
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-brand-crimson font-bold bg-red-50/90 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const cleanHours = (settings.openingHours || '7:00 AM – 10:00 PM')
    .replace(/^Open\s+(All\s+)?7\s+Days:?\s*/i, '')
    .trim();

  return (
    <header className="sticky top-0 z-40 bg-white font-sans border-b border-surface-border shadow-xs">
      {/* 1. Stationary Top Announcement Bar - Pinned at top on all devices */}
      <div className="bg-[#111111] text-stone-300 text-[11px] border-b border-stone-800 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
            <span className="flex items-center gap-2 font-medium text-stone-200 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Open All 7 Days: {cleanHours}</span>
            </span>
            <span className="hidden md:inline-block text-stone-600">•</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-stone-400 truncate">
              <span>Doorstep Supermarket Delivery or In-Store Pickup at Madurai Central</span>
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a 
              href={`tel:${settings.phone.replace(/\s+/g, '')}`} 
              className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-brand-crimson" />
              <span className="hidden sm:inline text-stone-400">Store Helpline:</span>
              <span className="font-semibold text-white">{settings.phone}</span>
            </a>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="bg-brand-crimson hover:bg-brand-crimson-dark text-white px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors"
              >
                Admin Desk
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Header Row - Invariant height & padding, 100% stationary on all devices */}
      <div className="relative z-30 max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-6 bg-white">
          {/* Brand Logo with Refined Entrance & Subtle Hover Animation */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0 animate-entrance-logo">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-stone-700 hover:text-brand-crimson hover:bg-stone-100 rounded-lg transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 group py-0.5 min-w-0" aria-label="Bharathi Store">
              {/* 3D 'B' Shopping Cart Emblem Icon */}
              <img 
                src="/bharathi-emblem-4k.png" 
                alt="Bharathi Store Emblem" 
                className="h-8 sm:h-11 md:h-12 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />

              {/* 4K Brand Letters — hidden on very small screens to prevent overflow */}
              <img 
                src="/bharathi-brand-header-4k.png" 
                srcSet="/bharathi-brand-header-4k.png 2x, /bharathi-brand-header-4k.png 3x"
                alt="Bharathi Store - Supermarket & Provisions" 
                className="h-7 sm:h-10 md:h-11 w-auto max-w-[110px] xs:max-w-[140px] sm:max-w-[185px] md:max-w-[210px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </Link>
          </div>

          {/* Search Bar on Desktop (Luxury sculpted pill with crimson focus glow) */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl relative z-40 hidden sm:block animate-entrance-search">
            <form 
              onSubmit={handleSearchSubmit} 
              className={cn(
                "group flex items-center h-12 rounded-full border transition-all duration-200",
                isSearchFocused 
                  ? "border-brand-crimson ring-4 ring-brand-crimson/15 bg-white shadow-xl shadow-stone-900/5" 
                  : "border-stone-200/90 bg-[#F7F5F1] hover:bg-[#EFECE5] hover:border-stone-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              )}
            >
              {/* Left Search Icon Badge */}
              <div className="flex items-center justify-center pl-2.5 pr-1 shrink-0">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                  isSearchFocused ? "bg-red-50 text-brand-crimson" : "bg-white text-stone-500 shadow-2xs"
                )}>
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 text-brand-crimson animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 stroke-[2.2]" />
                  )}
                </div>
              </div>

              {/* Input Field */}
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search atta, biscuits, chocolates, badam..."
                className="w-full text-xs sm:text-[13.5px] font-medium px-2.5 bg-transparent text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:ring-0 border-none selection:bg-red-100 selection:text-brand-crimson"
              />

              {/* Keyboard Shortcut Indicator when not focused */}
              {!isSearchFocused && !searchQuery && (
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-stone-400 bg-white/90 border border-stone-200/80 rounded-md shadow-2xs mr-2 pointer-events-none select-none shrink-0">
                  <span>Press</span>
                  <kbd className="font-mono text-stone-600 font-bold">/</kbd>
                </span>
              )}

              {/* Clear (X) Button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="w-7 h-7 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center mr-1 transition-colors shrink-0"
                  aria-label="Clear search text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Sculpted Premium Search Button */}
              <button
                type="submit"
                className="h-9 px-5 mr-1.5 bg-gradient-to-r from-brand-crimson to-brand-crimson-dark hover:brightness-105 text-white text-xs font-bold rounded-full shadow-xs hover:shadow-md hover:shadow-brand-crimson/25 transition-all duration-200 active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </form>

            {/* Desktop Search Suggestions Overlay Panel with Guaranteed High Stacking Context and 100% Solid White Surface */}
            {isSearchFocused && (
              <div 
                className="absolute top-full left-0 right-0 mt-2.5 bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)] border border-stone-200/90 overflow-hidden z-[100] animate-fadeIn ring-1 ring-black/5"
                role="listbox"
              >
                {/* Category suggestions preview if match found */}
                {searchQuery.trim() && matchingCategories.length > 0 && (
                  <div className="p-2.5 bg-red-50/60 border-b border-red-100 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mr-1">
                      Departments:
                    </span>
                    {matchingCategories.map((mc) => (
                      <button
                        key={mc.id}
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate(`/products?category=${mc.slug}`);
                        }}
                        className="px-2.5 py-0.5 bg-white hover:bg-brand-crimson hover:text-white text-stone-800 rounded-full text-[11px] font-semibold border border-red-200/80 shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <span>{mc.name}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-brand-crimson" />
                      </button>
                    ))}
                  </div>
                )}

                {/* State: Typing query with matching results */}
                {searchQuery.trim() && matchingProducts.length > 0 && (
                  <>
                    <div className="p-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-stone-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-crimson" />
                        <span>Matching Groceries in Madurai</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-[10px] text-stone-400 font-medium">Use ↑ ↓ to navigate, ↵ to select</span>
                        <span className="text-[10px] font-bold text-brand-crimson bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                          {matchingProducts.length} items found
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-stone-100 max-h-84 overflow-y-auto bg-white">
                      {matchingProducts.map((p, idx) => {
                        const isSelected = selectedIndex === idx;
                        const isAdded = addedProductId === p.id;
                        return (
                          <div
                            key={p.id}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() => {
                              saveRecentSearch(p.name);
                              setIsSearchFocused(false);
                              navigate(`/product/${p.slug || p.id}`);
                            }}
                            className={cn(
                              "flex items-center gap-3.5 p-3.5 transition-colors cursor-pointer group bg-white",
                              isSelected ? "bg-red-50/70" : "hover:bg-stone-50/90"
                            )}
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200/60 shadow-2xs group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-[13px] font-semibold text-obsidian truncate group-hover:text-brand-crimson transition-colors">
                                {renderHighlightedText(p.name, searchQuery)}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-medium text-stone-500">{p.categoryName}</span>
                                <span className="text-stone-300">•</span>
                                <span className="text-[10px] text-stone-400 font-medium">{p.unit}</span>
                                {p.origin && (
                                  <>
                                    <span className="text-stone-300">•</span>
                                    <span className="text-[10px] text-emerald-700 font-medium">{p.origin}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-obsidian">{formatCurrency(p.price)}</span>
                                {p.mrp > p.price && (
                                  <span className="text-[10px] text-stone-400 line-through">
                                    {formatCurrency(p.mrp)}
                                  </span>
                                )}
                              </div>
                              {p.mrp > p.price && (
                                <span className="text-[9px] font-bold text-brand-crimson bg-red-50 px-1.5 py-0.5 rounded-full">
                                  {calculateDiscount(p.mrp, p.price)}% OFF
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleQuickAdd(e, p)}
                                className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-150 flex items-center gap-1 shadow-2xs",
                                  isAdded
                                    ? "bg-emerald-600 text-white shadow-emerald-600/20"
                                    : "bg-stone-100 hover:bg-brand-crimson hover:text-white text-stone-800 active:scale-95"
                                )}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Added</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Add</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-brand-crimson hover:underline flex items-center justify-center gap-1.5 w-full"
                      >
                        <span>View all matching results for &ldquo;{searchQuery}&rdquo;</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}

                {/* State: Query typed but no matches found */}
                {searchQuery.trim() && matchingProducts.length === 0 && !isSearching && (
                  <div className="p-6 text-center space-y-3 bg-white">
                    <div className="w-11 h-11 rounded-full bg-red-50 text-brand-crimson flex items-center justify-center mx-auto">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-obsidian">No grocery products found</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-surface-border/80">
                      <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">
                        Try popular supermarket staples:
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {POPULAR_SEARCH_TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSearchQuery(tag);
                              saveRecentSearch(tag);
                              searchInputRef.current?.focus();
                            }}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 hover:bg-red-50 hover:text-brand-crimson transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* State: Empty query focused (Recent Searches, Trending Searches & Department Quick Links) */}
                {!searchQuery.trim() && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* Recent Searches (if user has any saved) */}
                    {recentSearches.length > 0 && (
                      <div className="space-y-2 pb-3 border-b border-stone-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>Recent Searches</span>
                          </span>
                          <button
                            type="button"
                            onClick={clearRecentSearches}
                            className="text-[10px] font-semibold text-stone-400 hover:text-brand-crimson transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map((term) => (
                            <div
                              key={term}
                              onClick={() => {
                                setSearchQuery(term);
                                saveRecentSearch(term);
                                setIsSearchFocused(false);
                                navigate(`/search?q=${encodeURIComponent(term)}`);
                              }}
                              className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-50 hover:bg-red-50 hover:text-brand-crimson border border-stone-200/60 hover:border-brand-crimson/30 transition-all text-stone-700 cursor-pointer shadow-2xs"
                            >
                              <span>{term}</span>
                              <button
                                type="button"
                                onClick={(e) => removeRecentSearch(term, e)}
                                className="text-stone-300 group-hover:text-stone-500 hover:!text-brand-crimson p-0.5 rounded-full"
                                aria-label={`Remove ${term}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-crimson animate-pulse" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800">
                          Trending in Madurai Store
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-stone-400">Fresh Daily</span>
                    </div>

                    {/* Trending items with mini icons */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Popular Groceries
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { tag: 'Country Tomatoes', icon: '🍅' },
                          { tag: 'A2 Cow Ghee', icon: '🧈' },
                          { tag: 'Salem Turmeric', icon: '🌿' },
                          { tag: 'Basmati Rice', icon: '🌾' },
                          { tag: 'Filter Coffee', icon: '☕' },
                          { tag: 'Malai Paneer', icon: '🧀' },
                          { tag: 'Organic Honey', icon: '🍯' },
                          { tag: 'California Almonds', icon: '🥜' },
                        ].map((item) => (
                          <button
                            key={item.tag}
                            type="button"
                            onClick={() => {
                              setSearchQuery(item.tag);
                              saveRecentSearch(item.tag);
                              setIsSearchFocused(false);
                              navigate(`/search?q=${encodeURIComponent(item.tag)}`);
                            }}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-50 hover:bg-red-50 hover:text-brand-crimson border border-stone-200/70 hover:border-brand-crimson/30 transition-all text-stone-700 flex items-center gap-1.5 shadow-2xs active:scale-95"
                          >
                            <span>{item.icon}</span>
                            <span>{item.tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Department Shortcuts */}
                    <div className="pt-2 border-t border-stone-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Explore by Department
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {[
                          { name: 'Fresh Produce', slug: 'fruits-vegetables', icon: '🍏' },
                          { name: 'Dairy & Bakery', slug: 'dairy-bakery', icon: '🥛' },
                          { name: 'Daily Staples', slug: 'staples-grains', icon: '🍚' },
                          { name: 'Salem Spices', slug: 'spices-masalas', icon: '🌶️' },
                          { name: 'Snacks & Drinks', slug: 'snacks-beverages', icon: '☕' },
                          { name: 'Dry Fruits', slug: 'gourmet-organic', icon: '🌰' },
                        ].map((d) => (
                          <Link
                            key={d.slug}
                            to={`/products?category=${d.slug}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="p-2 bg-stone-50 hover:bg-red-50/50 rounded-xl flex items-center gap-2 text-stone-700 hover:text-brand-crimson transition-colors border border-stone-200/60 group"
                          >
                            <span className="text-base group-hover:scale-110 transition-transform">{d.icon}</span>
                            <span className="text-[11px] font-semibold truncate">{d.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Hint */}
                    <div className="pt-1 text-center text-[10px] text-stone-400 flex items-center justify-center gap-2 border-t border-stone-100/80">
                      <span>Press <kbd className="font-mono font-bold bg-stone-100 px-1 py-0.5 rounded text-stone-600">/</kbd> anytime to search</span>
                      <span>•</span>
                      <span>Press <kbd className="font-mono font-bold bg-stone-100 px-1 py-0.5 rounded text-stone-600">Esc</kbd> to dismiss</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Micro Actions — simplified on mobile to prevent overflow at 320-375px */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0 animate-entrance-basket">

            {/* Customer delivery address pin indicator — visible on both mobile and desktop */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 text-xs text-stone-700 bg-red-50/80 hover:bg-red-100/80 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border border-red-200/80 font-medium transition-colors shrink-0 active:scale-95 animate-entrance-location"
              aria-label="Customer delivery address"
              title="Click to select or manage customer delivery address"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-crimson shrink-0" />
              <div className="flex items-center gap-1 text-left">
                <span className="text-[10px] font-bold text-stone-500 hidden md:inline">Deliver to:</span>
                <span className="text-[10.5px] sm:text-[11px] font-bold text-brand-crimson truncate max-w-[95px] xs:max-w-[135px] sm:max-w-[170px]">
                  {activeAddress ? `${activeAddress.label || 'Home'} · ${activeAddress.city || 'Madurai'}` : 'Madurai Central'}
                </span>
              </div>
            </button>

            {/* Wishlist — hidden on mobile (accessible via /wishlist in account) */}
            <Link
              to="/wishlist"
              onClick={handleWishlistClick}
              className={cn(
                "relative p-2 text-stone-700 hover:text-brand-crimson hover:bg-stone-100 rounded-full transition-colors animate-entrance-wishlist hidden sm:flex",
                isWishlistPulsing && "animate-heart-pulse text-brand-crimson"
              )}
              aria-label={`Wishlist with ${wishlist.length} items`}
            >
              <Heart className={cn("w-5 h-5 transition-colors", wishlist.length > 0 ? "fill-brand-crimson text-brand-crimson" : "")} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-brand-crimson text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account — hidden on mobile (accessible via MobileNav) */}
            <button
              onClick={() => user ? navigate('/account') : setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 p-2 text-stone-700 hover:text-brand-crimson hover:bg-stone-100 rounded-full transition-colors text-xs font-medium animate-entrance-account"
              aria-label="User account"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:inline text-xs font-medium">
                {user ? user.fullName.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Shopping Basket Trigger with Cart Bounce Micro-interaction */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 bg-stone-900 hover:bg-brand-crimson text-white px-3 sm:px-4 py-2 rounded-full text-xs font-semibold shadow-xs transition-all duration-200 active:scale-95",
                cartBounce && "animate-cart-bounce"
              )}
              aria-label={`Basket with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-crimson text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Basket</span>
            </button>
          </div>
        </div>

        {/* Mobile Prominent Search Bar (Row 2 on Mobile - Most Prominent Mobile Element) */}
        <div className="sm:hidden px-4 pb-2.5 pt-0.5 animate-entrance-search">
          <div
            onClick={() => {
              setIsMobileSearchOpen(true);
            }}
            className="w-full h-11 bg-[#F7F5F1] active:bg-white rounded-full border border-stone-200/90 px-3.5 flex items-center justify-between shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-full bg-white text-brand-crimson flex items-center justify-center shadow-2xs shrink-0">
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-medium text-stone-400 truncate">
                Search atta, biscuits, chocolates, badam...
              </span>
            </div>
            <span className="text-[10px] font-bold text-brand-crimson uppercase tracking-wider bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full shrink-0">
              Search
            </span>
          </div>
        </div>

        {/* 3. Department Aisle Navigation Strip (relative z-10 so dropdown floats above it) */}
        <div className="relative z-10 hidden md:block bg-white/95 border-t border-surface-border/60 animate-entrance-nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-medium">
            {/* Department Links with smooth sliding underline */}
            <nav className="flex items-center gap-5 lg:gap-7 py-2.5 overflow-x-auto no-scrollbar shrink min-w-0 pr-4">
              <Link
                to="/products"
                className={cn(
                  "py-1 tracking-wide transition-all duration-150 relative whitespace-nowrap shrink-0 group",
                  location.pathname === '/products' && !location.search 
                    ? "text-brand-crimson font-bold" 
                    : "text-stone-700 hover:text-brand-crimson"
                )}
              >
                <span>All Provisions</span>
                <span 
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-brand-crimson transition-transform duration-200",
                    location.pathname === '/products' && !location.search 
                      ? "scale-x-100" 
                      : "scale-x-0 group-hover:scale-x-100"
                  )} 
                />
              </Link>
              {DEPARTMENTS.map((dept) => {
                const isActive = location.search.includes(dept.slug);
                return (
                  <Link
                    key={dept.slug}
                    to={`/products?category=${dept.slug}`}
                    className={cn(
                      "py-1 tracking-wide transition-all duration-150 relative whitespace-nowrap shrink-0 group",
                      isActive
                        ? "text-brand-crimson font-bold"
                        : "text-stone-600 hover:text-brand-crimson"
                    )}
                  >
                    <span>{dept.name}</span>
                    <span 
                      className={cn(
                        "absolute bottom-0 left-0 right-0 h-0.5 bg-brand-crimson transition-transform duration-200",
                        isActive
                          ? "scale-x-100" 
                          : "scale-x-0 group-hover:scale-x-100"
                      )} 
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Promotional Aisles with Divider */}
            <div className="flex items-center gap-4 shrink-0 py-1 pl-4 border-l border-stone-200 text-xs">
              <Link
                to="/products?deal=true"
                className="text-brand-crimson font-semibold hover:underline flex items-center gap-1 shrink-0 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span>Pantry Savings</span>
              </Link>
              <span className="text-stone-300">•</span>
              <Link to="/about" className="text-stone-600 hover:text-brand-crimson shrink-0 whitespace-nowrap transition-colors">
                Store Visit Guide
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Dedicated Search Experience */}
        {isMobileSearchOpen && (
          <div className="sm:hidden fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
            {/* Mobile Search Input Header Bar */}
            <div className="p-2.5 border-b border-stone-200 bg-white flex items-center gap-2 shadow-xs shrink-0 pt-safe">
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-700 hover:text-brand-crimson hover:bg-stone-100 transition-colors shrink-0 -ml-0.5"
                aria-label="Back to store"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
              
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-[#F7F5F1] rounded-full px-3.5 py-2 border-2 border-brand-crimson/80 bg-white shadow-sm ring-2 ring-brand-crimson/10 transition-all">
                <Search className="w-4 h-4 text-brand-crimson shrink-0 mr-2 stroke-[2.5]" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search atta, biscuits, chocolates, badam..."
                  className="w-full text-sm font-medium bg-transparent text-stone-900 placeholder:text-stone-400 outline-none border-none selection:bg-red-100 selection:text-brand-crimson"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      mobileSearchInputRef.current?.focus();
                    }}
                    className="p-1 text-stone-400 hover:text-stone-700"
                    aria-label="Clear mobile search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
              
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="px-3.5 py-2 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all"
              >
                Search
              </button>
            </div>

            {/* Mobile Search Results / Suggestions Scrollable Container (pb-32 for keyboard safety) */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-100 bg-white pb-32">
              {/* Category suggestions chips in mobile search */}
              {searchQuery.trim() && matchingCategories.length > 0 && (
                <div className="p-3 bg-red-50/60 border-b border-red-100 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mr-1">
                    Matching Aisles:
                  </span>
                  {matchingCategories.map((mc) => (
                    <button
                      key={mc.id}
                      type="button"
                      onClick={() => {
                        setIsMobileSearchOpen(false);
                        navigate(`/products?category=${mc.slug}`);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-brand-crimson hover:text-white text-stone-800 rounded-full text-xs font-semibold border border-red-200/80 shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <span>{mc.name}</span>
                      <ArrowRight className="w-3 h-3 text-brand-crimson" />
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.trim() && matchingProducts.length > 0 && (
                <>
                  <div className="p-3 bg-stone-50 text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between border-b border-stone-100">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-crimson" />
                      <span>Matching Supermarket Provisions</span>
                    </span>
                    <span className="text-brand-crimson font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                      {matchingProducts.length} in stock
                    </span>
                  </div>
                  {matchingProducts.map((p) => {
                    const cartItem = cart.find(item => item.product.id === p.id);
                    const quantity = cartItem?.quantity || 0;
                    
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          saveRecentSearch(p.name);
                          setIsMobileSearchOpen(false);
                          navigate(`/product/${p.slug || p.id}`);
                        }}
                        className="flex items-center gap-3 p-3.5 active:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-14 h-14 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200/70"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-obsidian truncate">
                            {renderHighlightedText(p.name, searchQuery)}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                            <span>{p.categoryName}</span>
                            <span>•</span>
                            <span className="font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.2 rounded text-[10px]">
                              {p.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs sm:text-sm font-bold text-obsidian">{formatCurrency(p.price)}</span>
                            {p.mrp > p.price && (
                              <>
                                <span className="text-[10px] text-stone-400 line-through">
                                  {formatCurrency(p.mrp)}
                                </span>
                                <span className="text-[9px] font-bold text-brand-crimson bg-red-50 px-1.5 py-0.2 rounded-full">
                                  {calculateDiscount(p.mrp, p.price)}% OFF
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Direct Quick-Commerce Add / Stepper on Search Card */}
                        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                          {!p.inStock ? (
                            <span className="text-[10px] text-stone-400 italic">Sold Out</span>
                          ) : quantity === 0 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                handleQuickAdd(e, p);
                              }}
                              className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border-2 border-brand-crimson text-brand-crimson bg-white active:bg-brand-crimson active:text-white transition-all shadow-2xs"
                            >
                              + ADD
                            </button>
                          ) : (
                            <div className="flex items-center border-2 border-brand-crimson rounded-full bg-red-50/50 overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(p.id, quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-brand-crimson active:bg-brand-crimson active:text-white transition-colors"
                              >
                                <Minus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                              <span className="w-5 text-center font-bold text-xs text-brand-crimson">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(p.id, quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-brand-crimson active:bg-brand-crimson active:text-white transition-colors"
                              >
                                <Plus className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="p-4 bg-stone-50 text-center border-t border-stone-100">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full py-2.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>See all matching results for &ldquo;{searchQuery}&rdquo;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}

              {searchQuery.trim() && matchingProducts.length === 0 && !isSearching && (
                <div className="p-8 text-center space-y-3 bg-white">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-brand-crimson flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-obsidian">No items found</p>
                  <p className="text-xs text-muted max-w-xs mx-auto">
                    We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;. Try another staple or popular category below.
                  </p>
                </div>
              )}

              {!searchQuery.trim() && (
                <div className="p-4 space-y-5 bg-white">
                  {/* Recent Searches on Mobile */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-2 pb-3 border-b border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Recent Searches</span>
                        </span>
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          className="text-[10px] font-semibold text-stone-400 hover:text-brand-crimson"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            onClick={() => {
                              setSearchQuery(term);
                              saveRecentSearch(term);
                              setIsMobileSearchOpen(false);
                              navigate(`/search?q=${encodeURIComponent(term)}`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-stone-50 border border-stone-200 text-stone-700 active:bg-red-50 active:text-brand-crimson"
                          >
                            <span>{term}</span>
                            <button
                              type="button"
                              onClick={(e) => removeRecentSearch(term, e)}
                              className="text-stone-400 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Supermarket Searches in Madurai */}
                  <div>
                    <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-crimson inline-block animate-pulse" />
                      <span>Trending in Madurai</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { tag: 'Country Tomatoes', icon: '🍅' },
                        { tag: 'A2 Cow Ghee', icon: '🧈' },
                        { tag: 'Salem Turmeric', icon: '🌿' },
                        { tag: 'Basmati Rice', icon: '🌾' },
                        { tag: 'Filter Coffee', icon: '☕' },
                        { tag: 'Malai Paneer', icon: '🧀' },
                        { tag: 'Organic Honey', icon: '🍯' },
                        { tag: 'California Almonds', icon: '🥜' },
                      ].map((item) => (
                        <button
                          key={item.tag}
                          type="button"
                          onClick={() => {
                            setSearchQuery(item.tag);
                            saveRecentSearch(item.tag);
                            setIsMobileSearchOpen(false);
                            navigate(`/search?q=${encodeURIComponent(item.tag)}`);
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-50 active:bg-red-50 active:text-brand-crimson border border-stone-200 text-stone-700 flex items-center gap-1.5"
                        >
                          <span>{item.icon}</span>
                          <span>{item.tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customer Delivery Address Bottom Sheet Modal */}
        {isLocationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center font-sans">
            <div 
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsLocationModalOpen(false)}
            />
            <div className="relative w-full max-w-lg bg-white rounded-t-3xl md:rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 z-10 animate-sheet-up pb-safe max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-brand-crimson flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-obsidian">Customer Delivery Address</h3>
                    <p className="text-[11px] text-muted">Select your delivery destination</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsLocationModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
                  aria-label="Close address modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Saved Addresses List */}
              <div className="space-y-2.5">
                {addresses.map((addr) => {
                  const isSelected = activeAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr.id || '')}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative",
                        isSelected
                          ? "border-brand-crimson bg-red-50/40 shadow-xs ring-1 ring-brand-crimson"
                          : "border-surface-border hover:bg-stone-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                            isSelected ? "bg-brand-crimson text-white" : "bg-stone-100 text-stone-700"
                          )}>
                            {addr.label || 'Home'}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                          <span className="font-semibold text-xs text-obsidian">{addr.recipientName}</span>
                        </div>
                        {isSelected ? (
                          <span className="text-[10px] font-bold text-brand-crimson flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-stone-400 hover:text-brand-crimson">
                            Select
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-stone-600 space-y-0.5">
                        <p className="font-medium text-obsidian">{addr.streetAddress}</p>
                        {addr.landmark && (
                          <p className="text-[11px] text-muted">Landmark: {addr.landmark}</p>
                        )}
                        <p className="text-[11px] text-muted">
                          {addr.city}, {addr.state} - <span className="font-mono font-semibold">{addr.postalCode}</span>
                        </p>
                        <p className="text-[11px] text-stone-500 pt-0.5">Contact: {addr.phone}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Link: Manage Addresses in Account */}
              <div className="pt-2 border-t border-surface-border flex items-center justify-between gap-2">
                <Link
                  to="/account"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="text-xs font-semibold text-brand-crimson hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manage / Add New Address</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Slide-down Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-surface-border bg-white px-4 py-4 space-y-4 shadow-xl animate-fadeIn">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Supermarket Aisles</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 bg-stone-50 rounded-xl font-semibold text-stone-900 hover:text-brand-crimson"
              >
                All Provisions
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/products?category=${c.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 bg-stone-50 rounded-xl text-stone-700 hover:text-brand-crimson truncate font-medium"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <Link
                to="/products?deal=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-brand-crimson font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pantry Savings Deals</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-stone-600 font-medium"
              >
                Store Visit Guide
              </Link>
            </div>
          </div>
        )}
      </header>
  );
};

export default Header;
