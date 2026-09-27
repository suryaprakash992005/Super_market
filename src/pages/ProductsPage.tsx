import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { cn } from '../lib/utils';

export const ProductsPage: React.FC = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const isDealOnly = searchParams.get('deal') === 'true';
  const isStapleOnly = searchParams.get('staple') === 'true';

  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory);
  const [priceRange, setPriceRange] = useState<'all' | 'under100' | '100to300' | 'above300'>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  React.useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setCurrentPage(1);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (isDealOnly && !p.isDeal) return false;
      if (isStapleOnly && !p.isDailyStaple) return false;
      if (inStockOnly && !p.inStock) return false;
      if (priceRange === 'under100' && p.price >= 100) return false;
      if (priceRange === '100to300' && (p.price < 100 || p.price > 300)) return false;
      if (priceRange === 'above300' && p.price <= 300) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, isDealOnly, isStapleOnly, inStockOnly, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    priceRange !== 'all' || 
    inStockOnly || 
    isDealOnly || 
    isStapleOnly || 
    sortBy !== 'featured';

  const categoryObject = categories.find(c => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Editorial Header */}
      <div className="border-b border-surface-border pb-6">
        <div className="flex items-center gap-2 text-xs text-muted mb-2">
          <Link to="/" className="hover:text-brand-crimson">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-obsidian font-medium">Provisions Catalog</span>
          {categoryObject && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-brand-crimson font-semibold">{categoryObject.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian tracking-tight">
              {categoryObject ? categoryObject.name : isDealOnly ? "Special Pantry Offers" : "Supermarket Catalog"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Showing {filteredProducts.length} verified provisions available for 2-hour delivery & Madurai store pickup.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-stretch sm:self-auto w-full sm:w-auto">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs font-semibold text-stone-800 shadow-2xs active:scale-95 transition-all min-h-[44px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-crimson" />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>

            {/* Mobile Sort Trigger */}
            <button
              onClick={() => setIsMobileSortOpen(true)}
              className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs font-semibold text-stone-800 shadow-2xs active:scale-95 transition-all min-h-[44px]"
            >
              <span className="text-stone-500 font-normal">Sort:</span>
              <span className="truncate max-w-[100px]">
                {sortBy === 'featured' ? 'Featured' : sortBy === 'price-asc' ? '₹ Low-High' : sortBy === 'price-desc' ? '₹ High-Low' : sortBy === 'rating' ? 'Top Rated' : 'A-Z'}
              </span>
            </button>

            {/* Desktop Sort Dropdown */}
            <div className="hidden lg:flex items-center gap-2 bg-white border border-surface-border rounded-full px-3.5 py-2 shadow-xs text-xs">
              <span className="text-muted text-[11px] font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-stone-800 focus:outline-hidden cursor-pointer text-xs"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applied Filter Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-[11px] text-muted font-medium">Active:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                Aisle: {categoryObject?.name || selectedCategory}
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchParams({});
                  }} 
                  className="hover:text-red-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                Price: {priceRange === 'under100' ? 'Under ₹100' : priceRange === '100to300' ? '₹100 - ₹300' : 'Above ₹300'}
                <button onClick={() => setPriceRange('all')} className="hover:text-red-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="hover:text-red-600 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-[11px] font-semibold text-brand-crimson hover:underline flex items-center gap-1 ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid with Open Airy Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (Minimal line aesthetic, not heavy box) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28">
          <div className="pb-3 border-b border-surface-border flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-obsidian flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-brand-crimson" />
              <span>Filter Aisles</span>
            </h2>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] text-brand-crimson font-medium hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department selection */}
          <div className="space-y-1.5">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchParams({});
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>All Provisions</span>
              <span className="text-[10px] opacity-70">{products.length}</span>
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.slug);
                  setSearchParams({ category: c.slug });
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === c.slug
                    ? 'bg-stone-900 text-white font-semibold shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="truncate pr-1">{c.name}</span>
                <span className="text-[10px] opacity-70">
                  {products.filter(p => p.category === c.slug).length}
                </span>
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-surface-border space-y-2">
            <span className="text-xs font-bold text-obsidian block">Price Range</span>
            <div className="space-y-1.5 text-xs text-stone-700">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under100', label: 'Under ₹100' },
                { id: '100to300', label: '₹100 – ₹300' },
                { id: 'above300', label: 'Above ₹300' },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-obsidian">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === opt.id}
                    onChange={() => setPriceRange(opt.id as any)}
                    className="text-brand-crimson focus:ring-brand-crimson"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-surface-border">
            <label className="flex items-center gap-2 text-xs text-stone-700 hover:text-obsidian cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-brand-crimson focus:ring-brand-crimson"
              />
              <span>In Stock Only ({products.filter(p => p.inStock).length})</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-8">
          {paginatedProducts.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-white p-16 text-center space-y-4 shadow-subtle max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-xl font-bold text-obsidian">No items matched your filters</h2>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Try widening your price range or choosing another supermarket aisle.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 bg-brand-crimson text-white rounded-full text-xs font-semibold hover:bg-brand-crimson-dark transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-8 border-t border-surface-border flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-1.5 border border-surface-border rounded-full bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 font-medium transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center transition-colors ${
                          currentPage === num 
                            ? 'bg-stone-900 text-white shadow-xs' 
                            : 'bg-white border border-surface-border text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-1.5 border border-surface-border rounded-full bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 font-medium transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {isMobileFilterOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end justify-center animate-fadeIn"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col animate-sheet-up overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom,1rem))]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-crimson" />
                <h3 className="font-serif font-bold text-base text-obsidian">Filter Provisions</h3>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs text-brand-crimson font-semibold hover:underline px-2 py-1"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-obsidian"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Department */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-obsidian uppercase tracking-wider block">
                  Supermarket Aisle
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchParams({});
                    }}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all",
                      selectedCategory === 'all'
                        ? "border-brand-crimson bg-brand-crimson text-white font-bold shadow-xs"
                        : "border-surface-border bg-stone-50 text-stone-700"
                    )}
                  >
                    All Aisles ({products.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setSearchParams({ category: c.slug });
                      }}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all truncate",
                        selectedCategory === c.slug
                          ? "border-brand-crimson bg-brand-crimson text-white font-bold shadow-xs"
                          : "border-surface-border bg-stone-50 text-stone-700"
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2.5 pt-4 border-t border-surface-border">
                <label className="text-xs font-bold text-obsidian uppercase tracking-wider block">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under100', label: 'Under ₹100' },
                    { id: '100to300', label: '₹100 – ₹300' },
                    { id: 'above300', label: 'Above ₹300' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPriceRange(opt.id as any)}
                      className={cn(
                        "p-2.5 rounded-xl border text-center transition-all",
                        priceRange === opt.id
                          ? "border-brand-crimson bg-red-50 text-brand-crimson font-bold ring-1 ring-brand-crimson"
                          : "border-surface-border bg-stone-50 text-stone-700"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only */}
              <div className="pt-4 border-t border-surface-border">
                <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-surface-border cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-crimson focus:ring-brand-crimson"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    Show In-Stock Provisions Only ({products.filter(p => p.inStock).length})
                  </span>
                </label>
              </div>
            </div>

            {/* Bottom Sticky Action */}
            <div className="p-4 border-t border-surface-border bg-white">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full text-xs font-bold tracking-wider uppercase shadow-crimson active:scale-98 transition-all min-h-[44px]"
              >
                Apply Filters ({filteredProducts.length} Items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {isMobileSortOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end justify-center animate-fadeIn"
          onClick={() => setIsMobileSortOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] animate-sheet-up space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="font-serif font-bold text-base text-obsidian">Sort Provisions By</h3>
              <button
                type="button"
                onClick={() => setIsMobileSortOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-obsidian"
                aria-label="Close sort"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { id: 'featured', label: 'Featured First (Recommended)' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
                { id: 'rating', label: 'Top Customer Rated' },
                { id: 'name', label: 'Alphabetical: A to Z' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.id as any);
                    setIsMobileSortOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all min-h-[44px]",
                    sortBy === opt.id
                      ? "border-brand-crimson bg-red-50/70 text-brand-crimson font-bold shadow-2xs"
                      : "border-transparent hover:bg-stone-50 text-stone-700"
                  )}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-crimson" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
