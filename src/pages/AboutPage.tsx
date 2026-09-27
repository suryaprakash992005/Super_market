import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Brand Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[300px] flex items-center p-8 sm:p-12 shadow-card">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80"
            alt="Bharathi Store Supermarket"
            className="w-full h-full object-cover filter brightness-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-crimson text-white text-xs font-bold uppercase tracking-wider">
            <span>About Bharathi Store</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Your Trusted Digital & Physical Supermarket
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Serving households with high quality groceries, garden-fresh vegetables, dairy essentials, and authentic traditional spices under one roof.
          </p>
        </div>
      </div>

      {/* Brand Story & Philosophy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson">
            Supermarket Heritage
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian tracking-tight">
            Quality You Can Inspect, Freshness You Can Taste
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Bharathi Store was established to bring supermarket convenience together with the warmth and personal care of traditional Indian provision shops. We believe daily groceries shouldn't require compromising on grade, weight, or hygiene.
          </p>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Every batch of vegetables and fruits is graded every morning before store opening. Our pulses and grains are free from artificial cosmetic polishes, and our dairy products arrive fresh daily from verified regional farms.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-surface-border">
              <span className="font-bold text-obsidian block">Direct Sourcing</span>
              <span className="text-muted text-[11px]">Direct relationships with vegetable farming co-ops.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-surface-border">
              <span className="font-bold text-obsidian block">Certified Hygiene</span>
              <span className="text-muted text-[11px]">Sanitized bins, crates, and storage facilities.</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-surface-border shadow-subtle aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
            alt="Bharathi Store Aisles"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Physical Store Shopping Guide */}
      <section id="pickup" className="bg-white rounded-3xl p-6 sm:p-10 border border-surface-border shadow-subtle space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-crimson-tint text-brand-crimson text-xs font-bold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>Physical Store & Click-and-Collect</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian">
            Visit Our Supermarket in Person
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Experience complete supermarket aisles equipped with modern shopping trolleys, barcode checkouts, and customer assistance.
          </p>
        </div>

        {/* 3 Steps for Offline Store Purchase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 bg-surface-warm rounded-2xl border border-surface-border space-y-2">
            <span className="w-8 h-8 rounded-full bg-brand-crimson text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h3 className="font-bold text-sm text-obsidian">Walk-in or Reserve Online</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Walk into our air-conditioned supermarket anytime during business hours, or reserve your order online for in-store pickup.
            </p>
          </div>

          <div className="p-5 bg-surface-warm rounded-2xl border border-surface-border space-y-2">
            <span className="w-8 h-8 rounded-full bg-brand-crimson text-white font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h3 className="font-bold text-sm text-obsidian">Hand-Pick or Collect Packed</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Browse aisles freely with shopping carts, or proceed directly to our designated Click & Collect counter for packed pickup.
            </p>
          </div>

          <div className="p-5 bg-surface-warm rounded-2xl border border-surface-border space-y-2">
            <span className="w-8 h-8 rounded-full bg-brand-crimson text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h3 className="font-bold text-sm text-obsidian">Pay at Counter</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Settle your bill seamlessly via Cash, UPI (GPay, PhonePe, Paytm), or Debit/Credit card at the point of sale.
            </p>
          </div>
        </div>

        {/* Store Address & Hours Information */}
        <div className="p-6 bg-stone-900 text-white rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1.5">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-crimson-light" />
              <span>Store Address</span>
            </span>
            <p className="text-stone-200 leading-relaxed">{settings.storeAddress}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-crimson-light" />
              <span>Operational Hours</span>
            </span>
            <p className="text-stone-200">{settings.openingHours}</p>
            <p className="text-stone-400 text-[11px]">No weekly holiday • Open on all festival days</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-brand-crimson-light" />
              <span>Helpline & Inquiries</span>
            </span>
            <p className="text-stone-200">Phone: {settings.phone}</p>
            <p className="text-stone-200">Email: {settings.email}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center py-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-crimson hover:bg-brand-crimson-dark text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shadow-crimson"
        >
          <span>Shop Supermarket Catalog Online</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
