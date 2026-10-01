import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  ArrowRight, 
  X, 
  Clock, 
  Sparkles, 
  Store, 
  SlidersHorizontal, 
  Tag, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { cn } from '../lib/utils';

const POPULAR_SEARCHES = [
  { tag: 'Country Tomatoes', icon: '🍅' },
  { tag: 'A2 Cow Ghee', icon: '🧈' },
  { tag: 'Salem Turmeric', icon: '🌿' },
  { tag: 'Basmati Rice', icon: '🌾' },
  { tag: 'Malai Paneer', icon: '🧀' },
  { tag: 'Filter Coffee', icon: '☕' },
  { tag: 'Whole Wheat Atta', icon: '🌾' },
  { tag: 'California Almonds', icon: '🥜' },
  { tag: 'Organic Honey', icon: '🍯' },
  { tag: 'Gingelly Oil', icon: '🫒' },
  { tag: 'Manapparai Murukku', icon: '🥨' },
];

const POPULAR_DEPARTMENTS = [
  { name: 'Fresh Fruits & Veg', slug: 'fruits-vegetables', icon: '🍏', aisle: 'Aisle 01' },
  { name: 'Daily Staples & Dals', slug: 'staples-grains', icon: '🍚', aisle: 'Aisle 03' },
  { name: 'Dairy & Farm Bakery', slug: 'dairy-bakery', icon: '🥛', aisle: 'Aisle 02' },
  { name: 'Spices & Salem Masalas', slug: 'spices-masalas', icon: '🌶️', aisle: 'Aisle 04' },
  { name: 'Snacks & Beverages', slug: 'snacks-beverages', icon: '☕', aisle: 'Aisle 05' },
  { name: 'Household & Cleaning', slug: 'household-cleaning', icon: '🧼', aisle: 'Aisle 06' },
  { name: 'Dry Fruits & Honey', slug: 'gourmet-organic', icon: '🌰', aisle: 'Aisle 07' },
  { name: 'Pooja & Spiritual', slug: 'pooja-spiritual-needs', icon: '🪔', aisle: 'Aisle 08' },
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';

  const { products, categories } = useStore();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(query);
  const [selectedCat, setSelectedCat] = useState(categoryFilter);
  const [sortBy, setSortBy] = useState(sortParam);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state when URL params change
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    setSelectedCat(categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    setSortBy(sortParam);
  }, [sortParam]);

  // Recent Searches synced with localStorage
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
      const updated = [trimmed, ...filtered].slice(0, 6);
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

  // Perform search query filtering
  const rawResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(lowerQuery);
      const matchBrand = p.brand && p.brand.toLowerCase().includes(lowerQuery);
      const matchDesc = p.description.toLowerCase().includes(lowerQuery);
      const matchCat = p.categoryName.toLowerCase().includes(lowerQuery);
      const matchSubcat = p.subcategoryName && p.subcategoryName.toLowerCase().includes(lowerQuery);
      const matchTag = p.tags && p.tags.some(t => t.toLowerCase().includes(lowerQuery));
      const matchOrigin = p.origin && p.origin.toLowerCase().includes(lowerQuery);

      const matchesText = matchName || matchBrand || matchDesc || matchCat || matchSubcat || matchTag || matchOrigin;
      const matchesCategory = selectedCat === 'all' || p.category === selectedCat;

      return matchesText && matchesCategory;
    });
  }, [products, query, selectedCat]);

  // Sort search results
  const searchResults = useMemo(() => {
    const items = [...rawResults];
    if (sortBy === 'price-low') {
      return items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      return items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      return items.sort((a, b) => {
        const discA = a.mrp > a.price ? (a.mrp - a.price) / a.mrp : 0;
        const discB = b.mrp > b.price ? (b.mrp - b.price) / b.mrp : 0;
        return discB - discA;
      });
    } else if (sortBy === 'name') {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    }
    return items;
  }, [rawResults, sortBy]);

  // Categories represented in the current search results
  const matchingCategories = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();
    // Departments that match either query or have matching products
    const catsWithResults = new Set(
      products
        .filter(p => p.name.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery))
        .map(p => p.category)
    );
    return categories.filter(c => catsWithResults.has(c.slug) || c.name.toLowerCase().includes(lowerQuery));
  }, [query, products, categories]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      saveRecentSearch(searchInput.trim());
      setSearchParams({ 
        q: searchInput.trim(),
        ...(selectedCat !== 'all' ? { category: selectedCat } : {}),
        ...(sortBy !== 'featured' ? { sort: sortBy } : {})
      });
    }
  };

  const handleExecuteSearch = (term: string) => {
    setSearchInput(term);
    saveRecentSearch(term);
    setSearchParams({
      q: term,
      ...(selectedCat !== 'all' ? { category: selectedCat } : {}),
      ...(sortBy !== 'featured' ? { sort: sortBy } : {})
    });
  };

  const handleCategoryFilterChange = (catSlug: string) => {
    setSelectedCat(catSlug);
    setSearchParams({
      q: query,
      ...(catSlug !== 'all' ? { category: catSlug } : {}),
      ...(sortBy !== 'featured' ? { sort: sortBy } : {})
    });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setSearchParams({
      q: query,
      ...(selectedCat !== 'all' ? { category: selectedCat } : {}),
      ...(newSort !== 'featured' ? { sort: newSort } : {})
    });
  };

  const handleClearFilters = () => {
    setSelectedCat('all');
    setSortBy('featured');
    setSearchParams({ q: query });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F1] py-5 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">

        {/* Search Header Container */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-surface-border shadow-xs space-y-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Link to="/" className="hover:text-brand-crimson">Home</Link>
            <span>/</span>
            <span className="text-brand-crimson font-semibold">Supermarket Search</span>
          </div>

          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian tracking-tight">
              {query ? `Search: “${query}”` : 'Find Fresh Groceries & Provisions'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Search across 32 supermarket departments, fresh farm harvest, and Madurai pantry provisions.
            </p>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search atta, biscuits, chocolates, badam, rice, ghee..."
                className="w-full pl-10 pr-9 py-3 text-xs sm:text-sm font-medium border border-stone-200/90 rounded-xl bg-[#F7F5F1] text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:bg-white focus:border-brand-crimson focus:ring-4 focus:ring-brand-crimson/15 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Department Filter Dropdown */}
            <select
              value={selectedCat}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="text-xs px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-800 font-semibold outline-none focus:ring-2 focus:ring-brand-crimson/20 cursor-pointer"
            >
              <option value="all">All 32 Departments</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-7 py-3 bg-gradient-to-r from-brand-crimson to-brand-crimson-dark hover:brightness-105 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow-md hover:shadow-brand-crimson/25 active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Provisions</span>
            </button>
          </form>

          {/* Active Query Matching Categories Pills (if searching) */}
          {query && matchingCategories.length > 0 && (
            <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
                Matching Departments:
              </span>
              <button
                type="button"
                onClick={() => handleCategoryFilterChange('all')}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                  selectedCat === 'all'
                    ? "bg-brand-crimson text-white shadow-2xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                )}
              >
                All Departments ({rawResults.length})
              </button>
              {matchingCategories.map((mc) => (
                <button
                  key={mc.id}
                  type="button"
                  onClick={() => handleCategoryFilterChange(mc.slug)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1",
                    selectedCat === mc.slug
                      ? "bg-brand-crimson text-white shadow-2xs"
                      : "bg-stone-50 text-stone-700 hover:bg-red-50 hover:text-brand-crimson border border-stone-200/80"
                  )}
                >
                  <span>{mc.name}</span>
                  {selectedCat === mc.slug && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              ))}
            </div>
          )}

          {/* Results Status Bar */}
          {query && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span>
                  Found <strong className="text-obsidian font-bold">{searchResults.length}</strong> items for <strong className="text-brand-crimson font-bold">&ldquo;{query}&rdquo;</strong>
                  {selectedCat !== 'all' && (
                    <span> in <span className="font-semibold text-stone-900">{categories.find(c => c.slug === selectedCat)?.name || selectedCat}</span></span>
                  )}
                </span>
                {(selectedCat !== 'all' || sortBy !== 'featured') && (
                  <button
                    onClick={handleClearFilters}
                    className="text-brand-crimson hover:underline text-[11px] font-semibold flex items-center gap-1 ml-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              {searchResults.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-[11px] font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="text-xs px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 font-semibold outline-none"
                  >
                    <option value="featured">Featured / Relevant</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Highest Discount %</option>
                    <option value="name">Alphabetical (A-Z)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 1. STATE: NO QUERY ENTERED — DISCOVERY DASHBOARD */}
        {!query && (
          <div className="space-y-6 animate-fadeIn">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-surface-border shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Your Recent Searches</span>
                  </span>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-xs font-semibold text-stone-400 hover:text-brand-crimson transition-colors"
                  >
                    Clear History
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      onClick={() => handleExecuteSearch(term)}
                      className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-50 hover:bg-red-50 hover:text-brand-crimson border border-stone-200/80 transition-all text-stone-700 cursor-pointer shadow-2xs active:scale-95"
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

            {/* Popular Supermarket Searches */}
            <div className="bg-white rounded-2xl p-5 border border-surface-border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-crimson inline-block animate-pulse" />
                  <span>Trending in Madurai Supermarket</span>
                </span>
                <span className="text-[11px] text-stone-400 font-medium">Daily Updated</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => handleExecuteSearch(item.tag)}
                    className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#F7F5F1] hover:bg-red-50 hover:text-brand-crimson border border-stone-200/80 transition-all text-stone-800 flex items-center gap-1.5 shadow-2xs active:scale-95"
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Explore by Supermarket Department */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-surface-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-obsidian">Explore by Department</h2>
                  <p className="text-xs text-stone-500">Quickly jump into any of our curated supermarket aisles</p>
                </div>
                <Link
                  to="/categories"
                  className="text-xs font-bold text-brand-crimson hover:underline flex items-center gap-1"
                >
                  <span>View All 32 Departments</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POPULAR_DEPARTMENTS.map((dept) => (
                  <Link
                    key={dept.slug}
                    to={`/products?category=${dept.slug}`}
                    className="p-3.5 bg-stone-50 hover:bg-red-50/60 rounded-xl border border-stone-200/70 hover:border-brand-crimson/30 transition-all group flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{dept.icon}</span>
                      <span className="text-[10px] font-mono text-stone-400 group-hover:text-brand-crimson font-medium">
                        {dept.aisle}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-bold text-stone-800 group-hover:text-brand-crimson transition-colors line-clamp-1">
                        {dept.name}
                      </p>
                      <span className="text-[10px] text-stone-400 group-hover:text-stone-600 flex items-center gap-0.5 mt-0.5 font-medium">
                        <span>Browse Aisle</span>
                        <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. STATE: QUERY ENTERED & NO RESULTS FOUND */}
        {query && searchResults.length === 0 && (
          <div className="bg-white rounded-2xl border border-surface-border p-10 sm:p-14 text-center space-y-4 shadow-subtle max-w-xl mx-auto animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-red-50 text-brand-crimson flex items-center justify-center mx-auto shadow-2xs">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-obsidian">No groceries found for &ldquo;{query}&rdquo;</h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
                We couldn&apos;t find any supermarket items matching that exact name. Try checking spelling, clearing filters, or browsing popular provisions.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearchParams({});
                }}
                className="px-4 py-2 bg-brand-crimson text-white rounded-full text-xs font-semibold shadow-xs"
              >
                Clear Search
              </button>
              <Link
                to="/products?category=fruits-vegetables"
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-semibold transition-colors"
              >
                Fresh Vegetables
              </Link>
              <Link
                to="/products?category=staples-grains"
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-semibold transition-colors"
              >
                Pantry Grains & Dals
              </Link>
            </div>
          </div>
        )}

        {/* 3. STATE: QUERY ENTERED & RESULTS FOUND */}
        {query && searchResults.length > 0 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchPage;
