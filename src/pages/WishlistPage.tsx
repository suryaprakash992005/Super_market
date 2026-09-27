import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, moveToCartFromWishlist, toggleWishlist } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-surface-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-brand-crimson fill-current" />
            <span>My Saved Wishlist ({wishlistedProducts.length})</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            Items you have saved for your recurring grocery trips and future supermarket orders.
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <Link
            to="/products"
            className="text-xs font-semibold text-brand-crimson hover:underline"
          >
            Continue Browsing Supermarket
          </Link>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center space-y-4 shadow-subtle max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-lg font-bold text-obsidian">Your wishlist is currently empty</h2>
          <p className="text-xs text-muted">
            Tap the heart icon on any product to save it here for fast reordering and price monitoring.
          </p>
          <Link
            to="/products"
            className="px-5 py-2.5 bg-brand-crimson text-white rounded-lg text-xs font-semibold hover:bg-brand-crimson-dark inline-block shadow-sm"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
