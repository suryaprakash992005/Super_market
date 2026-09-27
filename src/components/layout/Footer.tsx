import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-24 md:pb-12 border-t border-stone-800/80 font-sans">
      {/* 1. Value Narrative Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-stone-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-brand-crimson-light uppercase block">
              SPEED & FRESHNESS
            </span>
            <h3 className="font-serif text-lg font-bold text-white">2-Hour Express Delivery</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Hand-picked from refrigerated supermarket counters and dispatched in temperature-safe totes.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-brand-crimson-light uppercase block">
              PROVENANCE
            </span>
            <h3 className="font-serif text-lg font-bold text-white">Direct Farm Partnerships</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Sourced from dedicated farmer producer organizations in Dindigul, Nilgiris, and Salem.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-brand-crimson-light uppercase block">
              CONFIDENCE
            </span>
            <h3 className="font-serif text-lg font-bold text-white">Instant Freshness Guarantee</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              If an item does not meet your personal standard, receive immediate credit or replacement.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-brand-crimson-light uppercase block">
              ACCOUNTABILITY
            </span>
            <h3 className="font-serif text-lg font-bold text-white">Physical Store Pickup</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Walk into our Madurai Central supermarket anytime or collect your online order packed in 15 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand & Address (4 cols) */}
        <div className="md:col-span-4 space-y-5">
          <Link to="/" className="inline-flex items-center gap-2.5 p-2.5 rounded-xl bg-white shadow-md group transition-transform duration-200 hover:scale-[1.02]" aria-label="Bharathi Store">
            <img 
              src="/bharathi-emblem-4k.png" 
              alt="Bharathi Store Emblem" 
              className="h-10 sm:h-11 w-auto object-contain shrink-0"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
            <img 
              src="/bharathi-brand-header-4k.png" 
              srcSet="/bharathi-brand-header-4k.png 2x, /bharathi-brand-header-4k.png 3x"
              alt="Bharathi Store - Supermarket & Provisions" 
              className="h-9 sm:h-10 w-auto object-contain"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </Link>

          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Bharathi Store provides households with pure provisions, daily farm harvest, A2 cow milk, and freshly ground traditional spices.
          </p>

          <div className="space-y-2 text-xs text-stone-300 pt-1">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-crimson shrink-0 mt-0.5" />
              <span>{settings.storeAddress}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-brand-crimson shrink-0" />
              <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                {settings.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-brand-crimson shrink-0" />
              <span>{settings.openingHours}</span>
            </div>
          </div>
        </div>

        {/* Supermarket Aisles (3 cols) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Aisles & Departments</h4>
          <ul className="space-y-2 text-xs text-stone-400">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.slug}`} className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>{c.name}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
            <li>
              <Link to="/categories" className="text-brand-crimson-light hover:underline font-semibold text-xs pt-1 inline-block">
                View All Departments &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care (2 cols) */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <Link to="/orders" className="hover:text-white transition-colors">
                Track Deliveries
              </Link>
            </li>
            <li>
              <Link to="/about#pickup" className="hover:text-white transition-colors">
                In-Store Pickup
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-white transition-colors">
                Saved Wishlist
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-white transition-colors">
                My Addresses
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                Store Help & Hours
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Gateways (3 cols) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Verified Gateways</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            All online transactions are protected with direct PCI-DSS compliant banking connections.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] text-stone-300">
              Razorpay
            </span>
            <span className="px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] text-stone-300">
              PhonePe
            </span>
            <span className="px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] text-stone-300">
              Paytm UPI
            </span>
            <span className="px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] text-stone-300">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
        <div>
          © {new Date().getFullYear()} Bharathi Store. All rights reserved. GSTIN: {settings.gstin}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/about" className="hover:text-white">Store Policies</Link>
          <span>•</span>
          <Link to="/about" className="hover:text-white">Terms of Supply</Link>
          <span>•</span>
          <Link to="/about" className="hover:text-white">Privacy Protection</Link>
        </div>
      </div>
    </footer>
  );
};
