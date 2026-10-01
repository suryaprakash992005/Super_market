import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  ShoppingBag,
  ChevronRight,
  Search,
  Sparkles,
  Tag,
  Check,
  PackageSearch
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { cn } from '../lib/utils';

export const ProductsPage: React.FC = () => {
  const { products, categories, getMainCategories, getSubcategories, getCategoryBySlug } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSubcategory = searchParams.get('subcategory') || 'all';
  const currentBrand = searchParams.get('brand') || 'all';
  const isDealOnly = searchParams.get('deal') === 'true';
  const isStapleOnly = searchParams.get('staple') === 'true';
  const querySearch = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(currentSubcategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(currentBrand);
  const [priceRange, setPriceRange] = useState<'all' | 'under100' | '100to300' | '300to500' | 'above500'>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState<boolean>(false);
  const [aisleFilterSearch, setAisleFilterSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Sync state with search params
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedSubcategory(searchParams.get('subcategory') || 'all');
    setSelectedBrand(searchParams.get('brand') || 'all');
    setCurrentPage(1);
  }, [searchParams]);

  // Main departments from store
  const mainCategories = useMemo(() => {
    return getMainCategories ? getMainCategories() : categories.filter(c => !c.parentId);
  }, [getMainCategories, categories]);

  // Subcategories for the current selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    return getSubcategories ? getSubcategories(selectedCategory) : [];
  }, [selectedCategory, getSubcategories]);

  // Extract distinct brands from current category products
  const availableBrands = useMemo(() => {
    const relevantProducts = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory || p.subcategoryId === selectedCategory);
    const brandsSet = new Set<string>();
    relevantProducts.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [products, selectedCategory]);

  // Filtered products logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== 'all') {
        const matchesCategory = p.category === selectedCategory || 
          p.subcategoryId === selectedCategory || 
          p.subcategorySlug === selectedCategory;
        if (!matchesCategory) return false;
      }

      // Subcategory match
      if (selectedSubcategory !== 'all') {
        const matchesSubcategory = p.subcategoryId === selectedSubcategory || 
          p.subcategorySlug === selectedSubcategory ||
          p.category === selectedSubcategory;
        if (!matchesSubcategory) return false;
      }

      // Brand match
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }

      // Deals & Staples
      if (isDealOnly && !p.isDeal) return false;
      if (isStapleOnly && !p.isDailyStaple) return false;
      if (inStockOnly && !p.inStock) return false;

      // Price range
      if (priceRange === 'under100' && p.price >= 100) return false;
      if (priceRange === '100to300' && (p.price < 100 || p.price > 300)) return false;
      if (priceRange === '300to500' && (p.price < 300 || p.price > 500)) return false;
      if (priceRange === 'above500' && p.price <= 500) return false;

      // Search query
      if (querySearch) {
        const q = querySearch.toLowerCase();
        const matches = p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          p.categoryName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedSubcategory, selectedBrand, isDealOnly, isStapleOnly, inStockOnly, priceRange, querySearch, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedSubcategory('all');
    setSelectedBrand('all');
    const newParams: Record<string, string> = {};
    if (slug !== 'all') newParams.category = slug;
    if (isDealOnly) newParams.deal = 'true';
    if (isStapleOnly) newParams.staple = 'true';
    if (querySearch) newParams.q = querySearch;
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subSlugOrId: string) => {
    setSelectedSubcategory(subSlugOrId);
    const newParams: Record<string, string> = {};
    if (selectedCategory !== 'all') newParams.category = selectedCategory;
    if (subSlugOrId !== 'all') newParams.subcategory = subSlugOrId;
    if (selectedBrand !== 'all') newParams.brand = selectedBrand;
    if (isDealOnly) newParams.deal = 'true';
    if (isStapleOnly) newParams.staple = 'true';
    if (querySearch) newParams.q = querySearch;
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const newParams: Record<string, string> = {};
    if (selectedCategory !== 'all') newParams.category = selectedCategory;
    if (selectedSubcategory !== 'all') newParams.subcategory = selectedSubcategory;
    if (brand !== 'all') newParams.brand = brand;
    if (isDealOnly) newParams.deal = 'true';
    if (isStapleOnly) newParams.staple = 'true';
    if (querySearch) newParams.q = querySearch;
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedBrand('all');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedSubcategory !== 'all' ||
    selectedBrand !== 'all' ||
    priceRange !== 'all' || 
    inStockOnly || 
    isDealOnly || 
    isStapleOnly || 
    Boolean(querySearch) ||
    sortBy !== 'featured';

  const categoryObject = getCategoryBySlug ? getCategoryBySlug(selectedCategory) : categories.find(c => c.slug === selectedCategory);
  const subcategoryObject = availableSubcategories.find(s => s.slug === selectedSubcategory || s.id === selectedSubcategory);

  // Filtered aisle list for sidebar search
  const displayedAisles = useMemo(() => {
    if (!aisleFilterSearch.trim()) return mainCategories;
    const q = aisleFilterSearch.toLowerCase();
    return mainCategories.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [mainCategories, aisleFilterSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 font-sans">
      {/* Editorial Breadcrumbs & Header */}
      <div className="border-b border-surface-border pb-6">
        <div className="flex items-center gap-2 text-xs text-muted mb-2 overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-brand-crimson shrink-0">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link 
            to="/products" 
            onClick={() => handleCategoryChange('all')} 
            className={cn("shrink-0 hover:text-brand-crimson", selectedCategory === 'all' && "text-obsidian font-semibold")}
          >
            Provisions Catalog
          </Link>
          {categoryObject && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <Link
                to={`/products?category=${categoryObject.slug}`}
                onClick={() => handleSubcategoryChange('all')}
                className={cn("shrink-0 hover:text-brand-crimson", selectedSubcategory === 'all' ? "text-brand-crimson font-bold" : "text-stone-700")}
              >
                {categoryObject.name}
              </Link>
            </>
          )}
          {subcategoryObject && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="text-brand-crimson font-bold shrink-0">{subcategoryObject.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-obsidian tracking-tight flex items-center gap-2.5">
              <span>
                {subcategoryObject 
                  ? subcategoryObject.name 
                  : categoryObject 
                  ? categoryObject.name 
                  : isDealOnly 
                  ? "Special Pantry Offers" 
                  : querySearch 
                  ? `Search results for "${querySearch}"` 
                  : "Supermarket Catalog"}
              </span>
              {categoryObject?.icon && <span className="text-2xl">{categoryObject.icon}</span>}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Showing {filteredProducts.length} verified provisions • Direct farm fresh batches & Madurai Central store pickup.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-stretch sm:self-auto w-full sm:w-auto">
            {/* Mobile/Tablet Filter Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs font-semibold text-stone-800 shadow-2xs active:scale-95 transition-all min-h-[44px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-crimson" />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>

            {/* Mobile/Tablet Sort Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileSortOpen(true)}
              className="md:hidden flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs font-semibold text-stone-800 shadow-2xs active:scale-95 transition-all min-h-[44px]"
            >
              <span className="text-stone-500 font-normal">Sort:</span>
              <span className="truncate max-w-[100px]">
                {sortBy === 'featured' ? 'Featured' : sortBy === 'price-asc' ? '₹ Low-High' : sortBy === 'price-desc' ? '₹ High-Low' : sortBy === 'rating' ? 'Top Rated' : 'A-Z'}
              </span>
            </button>

            {/* Desktop Sort Dropdown */}
            <div className="hidden md:flex items-center gap-2 bg-white border border-surface-border rounded-full px-3.5 py-2 shadow-xs text-xs">
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

        {/* Subcategory Horizontal Chips Rail (Rendered when category is active) */}
        {selectedCategory !== 'all' && availableSubcategories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-border/60">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
                Sub-Aisles:
              </span>
              <button
                type="button"
                onClick={() => handleSubcategoryChange('all')}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all min-h-[36px] flex items-center gap-1.5",
                  selectedSubcategory === 'all'
                    ? "bg-brand-crimson text-white shadow-xs"
                    : "bg-white border border-surface-border text-stone-700 hover:bg-stone-50"
                )}
              >
                <span>All {categoryObject?.name || 'Department'}</span>
              </button>
              {availableSubcategories.map((sub) => {
                const isActive = selectedSubcategory === sub.slug || selectedSubcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubcategoryChange(sub.slug)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all min-h-[36px] flex items-center gap-1.5",
                      isActive
                        ? "bg-brand-crimson text-white shadow-xs"
                        : "bg-white border border-surface-border text-stone-700 hover:bg-stone-50"
                    )}
                  >
                    {sub.icon && <span className="text-sm">{sub.icon}</span>}
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Applied Filter Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-[11px] text-muted font-medium">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                Aisle: {categoryObject?.name || selectedCategory}
                <button 
                  onClick={() => handleCategoryChange('all')} 
                  className="hover:text-red-600 ml-1"
                  aria-label="Remove aisle filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                Sub-Aisle: {subcategoryObject?.name || selectedSubcategory}
                <button 
                  onClick={() => handleSubcategoryChange('all')} 
                  className="hover:text-red-600 ml-1"
                  aria-label="Remove sub-aisle filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                Brand: {selectedBrand}
                <button 
                  onClick={() => handleBrandChange('all')} 
                  className="hover:text-red-600 ml-1"
                  aria-label="Remove brand filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                Price: {priceRange === 'under100' ? 'Under ₹100' : priceRange === '100to300' ? '₹100 - ₹300' : priceRange === '300to500' ? '₹300 - ₹500' : 'Above ₹500'}
                <button onClick={() => setPriceRange('all')} className="hover:text-red-600 ml-1" aria-label="Remove price filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="hover:text-red-600 ml-1" aria-label="Remove stock filter">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {querySearch && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-surface-border text-stone-800 text-[11px] font-medium shadow-2xs">
                Query: "{querySearch}"
                <button 
                  onClick={() => {
                    const newParams = Object.fromEntries(searchParams.entries());
                    delete newParams.q;
                    setSearchParams(newParams);
                  }} 
                  className="hover:text-red-600 ml-1"
                  aria-label="Remove search term"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] font-semibold text-brand-crimson hover:underline flex items-center gap-1 ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid with Sidebar + Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Sidebar — visible from md (tablet) up */}
        <aside className="hidden md:block md:col-span-3 space-y-6 sticky top-28">
          <div className="pb-3 border-b border-surface-border flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-obsidian flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-brand-crimson" />
              <span>Department Aisles</span>
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] text-brand-crimson font-medium hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Aisle Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search 32 departments..."
              value={aisleFilterSearch}
              onChange={(e) => setAisleFilterSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-surface-border rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-brand-crimson focus:bg-white transition-all"
            />
          </div>

          {/* Department selection list */}
          <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between",
                selectedCategory === 'all'
                  ? "bg-brand-crimson text-white font-bold shadow-xs"
                  : "text-stone-700 hover:bg-stone-100"
              )}
            >
              <span>All Provisions</span>
              <span className="text-[10px] opacity-75">{products.length}</span>
            </button>

            {displayedAisles.map((c) => {
              const isSelected = selectedCategory === c.slug;
              const count = products.filter(p => p.category === c.slug || p.subcategoryId === c.id).length;
              return (
                <div key={c.id} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(c.slug)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between",
                      isSelected
                        ? "bg-brand-crimson text-white font-bold shadow-xs"
                        : "text-stone-700 hover:bg-stone-100"
                    )}
                  >
                    <div className="flex items-center gap-1.5 truncate pr-1">
                      {c.icon && <span className="text-sm shrink-0">{c.icon}</span>}
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="text-[10px] opacity-75 shrink-0">{count}</span>
                  </button>

                  {/* Nested subcategories if active */}
                  {isSelected && availableSubcategories.length > 0 && (
                    <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-brand-crimson/20 ml-3">
                      <button
                        type="button"
                        onClick={() => handleSubcategoryChange('all')}
                        className={cn(
                          "w-full text-left px-2 py-1 rounded-md text-[11px] transition-colors truncate",
                          selectedSubcategory === 'all'
                            ? "font-bold text-brand-crimson bg-brand-crimson/10"
                            : "text-stone-600 hover:text-stone-900"
                        )}
                      >
                        • All {c.name}
                      </button>
                      {availableSubcategories.map(sub => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubcategoryChange(sub.slug)}
                          className={cn(
                            "w-full text-left px-2 py-1 rounded-md text-[11px] transition-colors truncate",
                            (selectedSubcategory === sub.slug || selectedSubcategory === sub.id)
                              ? "font-bold text-brand-crimson bg-brand-crimson/10"
                              : "text-stone-600 hover:text-stone-900"
                          )}
                        >
                          • {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Brand Filter (if brands are available) */}
          {availableBrands.length > 0 && (
            <div className="pt-4 border-t border-surface-border space-y-2">
              <span className="text-xs font-bold text-obsidian block">Brand</span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1 no-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => handleBrandChange('all')}
                  className={cn(
                    "w-full text-left px-2 py-1 rounded-lg transition-colors flex items-center justify-between text-xs",
                    selectedBrand === 'all' ? "font-bold text-brand-crimson" : "text-stone-600 hover:text-stone-900"
                  )}
                >
                  <span>All Brands</span>
                  {selectedBrand === 'all' && <Check className="w-3 h-3 text-brand-crimson" />}
                </button>
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBrandChange(b)}
                    className={cn(
                      "w-full text-left px-2 py-1 rounded-lg transition-colors flex items-center justify-between text-xs",
                      selectedBrand === b ? "font-bold text-brand-crimson" : "text-stone-600 hover:text-stone-900"
                    )}
                  >
                    <span className="truncate">{b}</span>
                    {selectedBrand === b && <Check className="w-3 h-3 text-brand-crimson shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="pt-4 border-t border-surface-border space-y-2">
            <span className="text-xs font-bold text-obsidian block">Price Range</span>
            <div className="space-y-1.5 text-xs text-stone-700">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under100', label: 'Under ₹100' },
                { id: '100to300', label: '₹100 – ₹300' },
                { id: '300to500', label: '₹300 – ₹500' },
                { id: 'above500', label: 'Above ₹500' },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-obsidian select-none">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === opt.id}
                    onChange={() => setPriceRange(opt.id as any)}
                    className="text-brand-crimson focus:ring-brand-crimson accent-brand-crimson"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-surface-border">
            <label className="flex items-center gap-2 text-xs text-stone-700 hover:text-obsidian cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-brand-crimson focus:ring-brand-crimson accent-brand-crimson"
              />
              <span>In Stock Only ({products.filter(p => p.inStock).length})</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-9 space-y-8">
          {paginatedProducts.length === 0 ? (
            <div className="rounded-3xl border border-surface-border bg-white p-8 sm:p-12 text-center space-y-5 shadow-subtle max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-brand-crimson flex items-center justify-center mx-auto shadow-inner">
                <PackageSearch className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-obsidian">
                  Aisle Restocking in Progress
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Our Madurai Central procurement team receives verified fresh batches every morning. We are currently replenishing provisions for this section.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-full sm:w-auto px-6 py-2.5 bg-brand-crimson text-white rounded-full text-xs font-bold hover:bg-brand-crimson-dark transition-colors shadow-sm"
                >
                  Browse All Provisions
                </button>
                <Link
                  to="/products?staple=true"
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 text-stone-800 rounded-full text-xs font-semibold hover:bg-stone-200 transition-colors"
                >
                  Explore Daily Staples
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
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
                      type="button"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-1.5 border border-surface-border rounded-full bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 font-medium transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCurrentPage(num)}
                        className={cn(
                          "w-8 h-8 rounded-full font-semibold flex items-center justify-center transition-colors",
                          currentPage === num 
                            ? "bg-brand-crimson text-white shadow-xs" 
                            : "bg-white border border-surface-border text-stone-700 hover:bg-stone-50"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
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
                    onClick={() => handleCategoryChange('all')}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all",
                      selectedCategory === 'all'
                        ? "border-brand-crimson bg-brand-crimson text-white font-bold shadow-xs"
                        : "border-surface-border bg-stone-50 text-stone-700"
                    )}
                  >
                    All Aisles ({products.length})
                  </button>
                  {mainCategories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCategoryChange(c.slug)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all truncate flex items-center gap-1.5",
                        selectedCategory === c.slug
                          ? "border-brand-crimson bg-brand-crimson text-white font-bold shadow-xs"
                          : "border-surface-border bg-stone-50 text-stone-700"
                      )}
                    >
                      {c.icon && <span className="text-sm shrink-0">{c.icon}</span>}
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories if category selected */}
              {selectedCategory !== 'all' && availableSubcategories.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-surface-border">
                  <label className="text-xs font-bold text-obsidian uppercase tracking-wider block">
                    Sub-Aisle Section
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSubcategoryChange('all')}
                      className={cn(
                        "px-3 py-1.5 rounded-full border transition-all",
                        selectedSubcategory === 'all'
                          ? "border-brand-crimson bg-brand-crimson text-white font-bold"
                          : "border-surface-border bg-stone-50 text-stone-700"
                      )}
                    >
                      All Sub-Aisles
                    </button>
                    {availableSubcategories.map(sub => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSubcategoryChange(sub.slug)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border transition-all flex items-center gap-1",
                          (selectedSubcategory === sub.slug || selectedSubcategory === sub.id)
                            ? "border-brand-crimson bg-brand-crimson text-white font-bold"
                            : "border-surface-border bg-stone-50 text-stone-700"
                        )}
                      >
                        {sub.icon && <span>{sub.icon}</span>}
                        <span>{sub.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-surface-border">
                  <label className="text-xs font-bold text-obsidian uppercase tracking-wider block">
                    Brand
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleBrandChange('all')}
                      className={cn(
                        "px-3 py-1.5 rounded-full border transition-all",
                        selectedBrand === 'all'
                          ? "border-brand-crimson bg-brand-crimson text-white font-bold"
                          : "border-surface-border bg-stone-50 text-stone-700"
                      )}
                    >
                      All Brands
                    </button>
                    {availableBrands.map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleBrandChange(b)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border transition-all",
                          selectedBrand === b
                            ? "border-brand-crimson bg-brand-crimson text-white font-bold"
                            : "border-surface-border bg-stone-50 text-stone-700"
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                    { id: '300to500', label: '₹300 – ₹500' },
                    { id: 'above500', label: 'Above ₹500' },
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
                    className="w-4 h-4 rounded text-brand-crimson focus:ring-brand-crimson accent-brand-crimson"
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
