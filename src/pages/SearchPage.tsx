import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronRight, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  
  const { products, categories } = useStore();
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCat, setSelectedCat] = useState(categoryFilter);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(lowerQuery);
      const matchDesc = p.description.toLowerCase().includes(lowerQuery);
      const matchCat = p.categoryName.toLowerCase().includes(lowerQuery);
      const matchTag = p.tags && p.tags.some(t => t.toLowerCase().includes(lowerQuery));
      const matchOrigin = p.origin.toLowerCase().includes(lowerQuery);

      const matchesText = matchName || matchDesc || matchCat || matchTag || matchOrigin;
      const matchesCategory = selectedCat === 'all' || p.category === selectedCat;

      return matchesText && matchesCategory;
    });
  }, [products, query, selectedCat]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ 
        q: searchInput.trim(),
        ...(selectedCat !== 'all' ? { category: selectedCat } : {}) 
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Search Header and Input */}
      <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-subtle space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search across all supermarket products, brands, groceries..."
              className="w-full pl-10 pr-4 py-3 text-sm font-medium border border-stone-200 rounded-xl bg-[#F7F5F1] text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:bg-white focus:border-brand-crimson focus:ring-4 focus:ring-brand-crimson/15 transition-all"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => {
              setSelectedCat(e.target.value);
              setSearchParams({
                q: query,
                ...(e.target.value !== 'all' ? { category: e.target.value } : {})
              });
            }}
            className="text-xs px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-800 font-semibold outline-none focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
          >
            <option value="all">All Departments</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-7 py-3 bg-gradient-to-r from-brand-crimson to-brand-crimson-dark hover:brightness-105 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow-md hover:shadow-brand-crimson/25 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Search</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-surface-border/60">
          <div>
            {query ? (
              <span>
                Found <strong className="text-obsidian">{searchResults.length}</strong> results for &ldquo;{query}&rdquo;
              </span>
            ) : (
              <span>Type a keyword above to find farm vegetables, dairy, or provisions.</span>
            )}
          </div>
          {query && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearchParams({});
              }}
              className="text-brand-crimson hover:underline text-[11px] font-semibold"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Results or Empty State */}
      {query && searchResults.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-4 shadow-subtle max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-lg font-bold text-obsidian">No products found for &ldquo;{query}&rdquo;</h2>
          <p className="text-xs text-muted leading-relaxed">
            We couldn't find any supermarket items matching that exact name. Try checking spelling or browsing popular departments.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <Link
              to="/products?category=fruits-vegetables"
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs"
            >
              Fresh Vegetables
            </Link>
            <Link
              to="/products?category=staples-grains"
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs"
            >
              Pantry Rice & Dals
            </Link>
            <Link
              to="/products?category=dairy-bakery"
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs"
            >
              Milk & Paneer
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
