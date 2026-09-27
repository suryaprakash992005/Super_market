import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12 font-sans">
      {/* Editorial Header */}
      <div className="border-b border-surface-border pb-8">
        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-crimson block mb-2">
          Directory & Navigation
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-obsidian tracking-tight">
              Supermarket Departments
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl">
              Walk our digital supermarket aisles curated by provenance, freshness, and culinary tradition.
            </p>
          </div>
          <Link
            to="/products"
            className="px-6 py-2.5 bg-stone-900 hover:bg-brand-crimson text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-colors self-start md:self-auto shadow-xs"
          >
            Browse All Provisions ({products.length})
          </Link>
        </div>
      </div>

      {/* Editorial Asymmetric Aisle Layout */}
      <div className="space-y-12">
        {categories.map((cat, idx) => {
          const categoryProducts = products.filter(p => p.category === cat.slug);
          const isEven = idx % 2 === 0;

          return (
            <div 
              key={cat.id} 
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}
            >
              {/* Media Block (7 cols) */}
              <div className={`lg:col-span-7 relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[380px] bg-stone-900 group shadow-card ${isEven ? '' : 'lg:order-2'}`}>
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-mono tracking-wider uppercase">
                    Aisle 0{idx + 1}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                      Department
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                      {cat.name}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold bg-white/25 backdrop-blur-md px-3 py-1 rounded-full">
                    {categoryProducts.length} Items Available
                  </span>
                </div>
              </div>

              {/* Editorial Description & Sample Products (5 cols) */}
              <div className={`lg:col-span-5 space-y-6 ${isEven ? '' : 'lg:order-1'}`}>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl font-bold text-obsidian leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Sample items pill list */}
                {categoryProducts.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      Aisle Highlights:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {categoryProducts.slice(0, 4).map(p => (
                        <Link
                          key={p.id}
                          to={`/product/${p.slug || p.id}`}
                          className="px-3 py-1 bg-white border border-surface-border rounded-full text-xs text-stone-700 hover:border-brand-crimson hover:text-brand-crimson transition-colors"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-colors shadow-crimson group"
                  >
                    <span>Shop {cat.name}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
