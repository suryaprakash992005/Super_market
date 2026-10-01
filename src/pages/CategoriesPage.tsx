import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Check, 
  X,
  Store,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import { cn } from '../lib/utils';

export const CategoriesPage: React.FC = () => {
  const { categories, products, getMainCategories, getSubcategories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);

  // Top-level main departments
  const mainCategories = useMemo(() => {
    return getMainCategories();
  }, [categories, getMainCategories]);

  // Group filter tags for rapid scanning
  const departmentGroups = [
    { id: 'all', label: 'All Departments' },
    { id: 'fresh-staples', label: 'Fresh & Daily Staples' },
    { id: 'snacks-beverages', label: 'Snacks & Beverages' },
    { id: 'personal-home', label: 'Personal & Home Care' },
    { id: 'specials', label: 'Pooja, Organic & Specials' },
  ];

  // Filter categories by search term and selected group
  const filteredCategories = useMemo(() => {
    return mainCategories.filter((cat) => {
      // Group filtering
      if (selectedGroup === 'fresh-staples') {
        const matchesGroup = ['fruits-vegetables', 'rice-atta-grains', 'dals-pulses-legumes', 'cooking-oils-ghee', 'dairy-bakery', 'sugar-salt-sweeteners'].includes(cat.slug);
        if (!matchesGroup) return false;
      } else if (selectedGroup === 'snacks-beverages') {
        const matchesGroup = ['snacks-beverages', 'biscuits-cookies-bakery', 'chocolates-candies-sweets', 'chips-snacks-namkeen', 'cold-drinks-juices', 'breakfast-cereals', 'noodles-pasta-instant-foods', 'sauces-pickles-condiments'].includes(cat.slug);
        if (!matchesGroup) return false;
      } else if (selectedGroup === 'personal-home') {
        const matchesGroup = ['personal-care', 'hair-care', 'oral-care', 'skin-care-beauty', 'feminine-hygiene', 'baby-infant-care', 'laundry-fabric-care', 'household-cleaning', 'paper-tissue-disposables', 'kitchen-dining-essentials'].includes(cat.slug);
        if (!matchesGroup) return false;
      } else if (selectedGroup === 'specials') {
        const matchesGroup = ['gourmet-organic', 'pooja-spiritual-needs', 'stationery-school-essentials', 'pet-care', 'organic-healthy-foods', 'seasonal-special-collections', 'frozen-foods-ice-cream'].includes(cat.slug);
        if (!matchesGroup) return false;
      }

      // Keyword search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = cat.name.toLowerCase().includes(q);
      const descMatch = cat.description?.toLowerCase().includes(q);
      const subMatch = cat.subcategories?.some(s => s.name.toLowerCase().includes(q));
      return nameMatch || descMatch || subMatch;
    });
  }, [mainCategories, selectedGroup, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7F5F1] py-5 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">

        {/* Page Breadcrumb & Header */}
        <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                <Link to="/" className="hover:text-brand-crimson">Home</Link>
                <span>/</span>
                <span className="text-brand-crimson font-semibold">All Supermarket Categories</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-obsidian tracking-tight">
                Supermarket Aisle Directory
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                Browse our complete grocery catalogue across {mainCategories.length} dedicated departments, from farm harvest to pantry staples.
              </p>
            </div>

            {/* Total catalog items pill */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="px-3.5 py-1.5 bg-red-50 text-brand-crimson font-bold rounded-full text-xs border border-red-100 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                <span>32 Departments Active</span>
              </span>
              <Link
                to="/products"
                className="px-4 py-2 bg-obsidian hover:bg-brand-crimson text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-colors shadow-2xs"
              >
                All Products ({products.length})
              </Link>
            </div>
          </div>

          {/* Category Search Field */}
          <div className="mt-5 relative">
            <div className="flex items-center h-11 sm:h-12 bg-stone-50 rounded-xl border border-stone-200/90 px-3.5 focus-within:border-brand-crimson focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-crimson/15 transition-all">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments or subcategories (e.g. Atta, Dals, Spices, Dairy, Soaps)..."
                className="w-full bg-transparent px-3 text-xs sm:text-sm text-obsidian placeholder:text-stone-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-stone-400 hover:text-stone-700"
                  aria-label="Clear category search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Department Filter Chips */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
            {departmentGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0",
                  selectedGroup === group.id
                    ? "bg-brand-crimson text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900"
                )}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid (2 cols on mobile, 3 cols on tablet, 4 cols on desktop) */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredCategories.map((cat, idx) => {
              const subcats = cat.subcategories || [];
              const categoryProductCount = products.filter(p => p.category === cat.slug).length;
              const isExpanded = expandedCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={cn(
                    "bg-white rounded-2xl border border-surface-border overflow-hidden transition-all duration-200 flex flex-col justify-between group shadow-subtle hover:shadow-card hover:border-stone-300",
                    isExpanded && "ring-2 ring-brand-crimson/30 border-brand-crimson"
                  )}
                >
                  <div>
                    {/* Category Image Header */}
                    <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      
                      {/* Aisle Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs text-[10px] font-mono text-white tracking-wider">
                        Aisle {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </span>

                      {/* Item Count Tag */}
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-stone-800 shadow-2xs">
                        {categoryProductCount > 0 ? `${categoryProductCount} in stock` : 'Aisle Ready'}
                      </span>

                      {/* Title Overlay at bottom of image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <h2 className="font-serif font-bold text-sm sm:text-base leading-tight drop-shadow-xs line-clamp-1">
                          {cat.name}
                        </h2>
                      </div>
                    </div>

                    {/* Content & Description */}
                    <div className="p-3.5 space-y-2">
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>

                      {/* Subcategories Preview Pills */}
                      {subcats.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-stone-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                            Sub-Aisles ({subcats.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {subcats.slice(0, 3).map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                                className="px-2 py-0.5 bg-stone-50 hover:bg-red-50 hover:text-brand-crimson text-stone-600 rounded text-[10px] font-medium border border-stone-100 transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                            {subcats.length > 3 && (
                              <button
                                onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                                className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded text-[10px] font-semibold"
                              >
                                +{subcats.length - 3} more
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Expanded Subcategories Grid */}
                      {isExpanded && subcats.length > 3 && (
                        <div className="p-2.5 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200/80 animate-fadeIn">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                            All {cat.name} Aisles:
                          </span>
                          <div className="grid grid-cols-1 gap-1">
                            {subcats.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                                className="flex items-center justify-between px-2.5 py-1.5 bg-white hover:bg-red-50 rounded-lg text-[11px] font-medium text-stone-700 hover:text-brand-crimson transition-colors"
                              >
                                <span>{sub.name}</span>
                                <ChevronRight className="w-3 h-3 text-stone-400" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="p-3 pt-0">
                    <Link
                      to={`/products?category=${cat.slug}`}
                      className="w-full py-2 bg-stone-100 hover:bg-brand-crimson hover:text-white text-stone-800 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 active:scale-98 shadow-2xs"
                    >
                      <span>Shop Aisle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-brand-crimson flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-obsidian">No Departments Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn&apos;t find any department matching &ldquo;{searchQuery}&rdquo;. Try another staple term or view all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
              }}
              className="px-4 py-2 bg-brand-crimson text-white rounded-full text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
