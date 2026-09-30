import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Eye, Compass, ArrowRight, Play, Pause, MousePointer } from 'lucide-react';
import FlexCarousel, { BendPreset, CarouselIntro, FlexCarouselItem, DEFAULT_FLEX_ITEMS } from './FlexCarousel';
import { cn } from '../../lib/utils';

const HARVEST_COLLECTION: FlexCarouselItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&q=80&auto=format&fit=crop',
    alt: 'Fresh Farm Produce from Nilgiris and Dindigul',
    title: '5:00 AM Direct Farm Harvest',
    subtitle: 'Direct from Nilgiris & Dindigul Orchards'
  },
  {
    src: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80&auto=format&fit=crop',
    alt: 'Salem High-Curcumin Turmeric & Handpicked Spices',
    title: 'Salem High-Curcumin Turmeric',
    subtitle: 'Unadulterated Single-Origin Spices'
  },
  {
    src: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&q=80&auto=format&fit=crop',
    alt: 'Pure Desi Cow Milk and Country Dairy',
    title: 'Fresh Desi A2 Cow Milk',
    subtitle: 'Delivered Fresh Each Morning'
  },
  {
    src: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&q=80&auto=format&fit=crop',
    alt: 'Unpolished Native Dals and Grains',
    title: 'Unpolished Toor & Urad Dals',
    subtitle: 'Zero Synthetic Buffing · Retains Natural Bran'
  },
  {
    src: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1200&q=80&auto=format&fit=crop',
    alt: 'Wood-Pressed Marachekku Gingelly and Groundnut Oils',
    title: 'Cold-Pressed Marachekku Oils',
    subtitle: 'Traditional Wooden Cold-Press Extraction'
  },
  {
    src: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=1200&q=80&auto=format&fit=crop',
    alt: 'Gourmet Cashews and Raw Forest Honey',
    title: 'W240 Cashews & Raw Forest Honey',
    subtitle: 'Hand-Selected Dry Fruits & Preserves'
  },
  {
    src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80&auto=format&fit=crop',
    alt: 'Artisan Bakery and Daily Loaves',
    title: 'Artisan Sourdough & Fresh Loaves',
    subtitle: 'Baked Before Dawn with Heritage Grains'
  },
  {
    src: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80&auto=format&fit=crop',
    alt: 'Traditional Madurai Filter Coffee',
    title: 'Madurai Peaberry Coffee Blend',
    subtitle: '80:20 Roasted Chicory Specialty Roast'
  }
];

export const FlexShowcaseSection: React.FC<{ className?: string }> = ({ className }) => {
  const [preset, setPreset] = useState<BendPreset>('liquid');
  const [intro, setIntro] = useState<CarouselIntro>('rise');
  const [collection, setCollection] = useState<'harvest' | 'demo'>('harvest');
  const [autoplay, setAutoplay] = useState(false);
  const [followCursor, setFollowCursor] = useState(true);
  const [activeItem, setActiveItem] = useState<FlexCarouselItem>(HARVEST_COLLECTION[0]);

  const items = collection === 'harvest' ? HARVEST_COLLECTION : DEFAULT_FLEX_ITEMS;

  const presets: { id: BendPreset; label: string; desc: string }[] = [
    { id: 'liquid', label: 'Liquid Glass', desc: 'Fluid 62° refractive bend' },
    { id: 'ribbon', label: 'Ribbon', desc: 'Harmonic flat sweep' },
    { id: 'vortex', label: 'Vortex', desc: 'Dynamic 30° spiral spin' },
    { id: 'arch', label: 'Arch', desc: 'Ascending parabolic curl' },
  ];

  const intros: CarouselIntro[] = ['rise', 'bloom', 'spin', 'deal'];

  return (
    <section className={cn('relative max-w-7xl mx-auto px-4 sm:px-6 my-12 sm:my-20', className)}>
      {/* Container with sleek dark styling */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-950 via-[#141212] to-[#1e080b] border border-stone-800/80 shadow-2xl p-5 sm:p-8 lg:p-10 text-white">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-crimson/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-crimson/20 border border-brand-crimson/30 text-amber-300 text-[11px] font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>React Bits WebGL Refraction</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Fluid Lens Provisions Showcase
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Explore our hand-sorted supermarket collections rendered through a liquid-glass chromatic lens shader. Drag horizontally, scroll vertically, or click any card to zoom into focus.
            </p>
          </div>

          {/* Quick Collection Toggle */}
          <div className="flex items-center gap-2 bg-stone-900/90 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shrink-0">
            <button
              onClick={() => setCollection('harvest')}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                collection === 'harvest'
                  ? 'bg-brand-crimson text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              )}
            >
              Farm Harvest
            </button>
            <button
              onClick={() => setCollection('demo')}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                collection === 'demo'
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              )}
            >
              React Bits Demo
            </button>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4">
          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Lens:
            </span>
            {presets.map(p => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                title={p.desc}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                  preset === p.id
                    ? 'bg-white text-stone-950 border-white shadow-lg shadow-white/10 scale-105'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-white/10'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Feature toggles */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Intro animation selector */}
            <div className="flex items-center gap-1.5 bg-stone-900/80 border border-white/10 px-2.5 py-1 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-stone-400">Intro:</span>
              <select
                value={intro}
                onChange={e => setIntro(e.target.value as CarouselIntro)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                {intros.map(opt => (
                  <option key={opt} value={opt} className="bg-stone-900 text-white">
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Follow Cursor toggle */}
            <button
              onClick={() => setFollowCursor(!followCursor)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors',
                followCursor
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-stone-900/80 border-white/10 text-stone-400 hover:text-white'
              )}
              title="Lens drifts with mouse movement"
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>Follow Cursor</span>
            </button>

            {/* Autoplay toggle */}
            <button
              onClick={() => setAutoplay(!autoplay)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors',
                autoplay
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-stone-900/80 border-white/10 text-stone-400 hover:text-white'
              )}
            >
              {autoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoplay ? 'Playing' : 'Autoplay'}</span>
            </button>
          </div>
        </div>

        {/* 3D WebGL Carousel Viewport */}
        <div className="relative z-10 mt-6 w-full h-[460px] sm:h-[560px] rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl backdrop-blur-sm">
          <FlexCarousel
            key={`${collection}-${intro}-${preset}`}
            items={items}
            preset={preset}
            intro={intro}
            cardHeight={0.52}
            gap={14}
            radius={18}
            squeeze={0.22}
            focusOnClick
            followCursor={followCursor}
            autoplay={autoplay}
            interval={3.5}
            captions
            captureWheel
            onChange={(_idx, item) => setActiveItem(item)}
            className="w-full h-full text-white"
          />

          {/* Quick HUD overlay in corner */}
          <div className="pointer-events-none absolute bottom-3 right-4 hidden sm:flex items-center gap-2 bg-stone-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-stone-400">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Click card to inspect in full view</span>
          </div>
        </div>

        {/* Bottom Interactive Bar */}
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-xs text-stone-400 flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>
              Currently viewing: <strong className="text-white">{activeItem?.title || activeItem?.alt || 'Provisions'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-crimson hover:bg-[#a80d25] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <span>Explore All Provisions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FlexShowcaseSection;
