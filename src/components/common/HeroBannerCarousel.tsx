import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Leaf } from 'lucide-react';
import { Banner } from '../../types';
import { cn } from '../../lib/utils';
import { InfiniteSpiral, SpiralItem } from './InfiniteSpiral';

interface HeroBannerCarouselProps {
  banners: Banner[];
  className?: string;
}

const SLIDE_DURATION = 7000; // 7 seconds per slide

const spiralItems: SpiralItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    alt: 'Country Tomatoes',
    label: 'Country Tomatoes · ₹38',
    href: '/products?category=fruits-vegetables'
  },
  {
    src: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
    alt: 'Artisanal Malai Paneer',
    label: 'Malai Paneer · ₹95',
    href: '/products?category=dairy-bakery'
  },
  {
    src: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    alt: 'Aged Sona Masoori Rice',
    label: 'Sona Masoori Rice · ₹345',
    href: '/products?category=staples-grains'
  },
  {
    src: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    alt: 'Royal Blend Filter Coffee',
    label: 'Filter Coffee · ₹175',
    href: '/products?category=snacks-beverages'
  },
  {
    src: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
    alt: 'Shimla Royal Apples',
    label: 'Shimla Apples · ₹180',
    href: '/products?category=fruits-vegetables'
  },
  {
    src: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80',
    alt: 'Devgad Alphonso Mangoes',
    label: 'Alphonso Mangoes · ₹550',
    href: '/products?category=fruits-vegetables'
  },
  {
    src: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    alt: 'Salem Turmeric & Spices',
    label: 'Salem Spices · ₹65',
    href: '/products?category=spices-masalas'
  },
  {
    src: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    alt: 'Wild Forest Raw Honey',
    label: 'Raw Forest Honey · ₹280',
    href: '/products?category=gourmet-organic'
  },
  {
    src: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80',
    alt: 'Premium California Almonds',
    label: 'California Almonds · ₹340',
    href: '/products?category=gourmet-organic'
  },
  {
    src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    alt: 'Fresh Supermarket Greens & Vegetables',
    label: 'Farm Fresh Greens · ₹45',
    href: '/products?category=fruits-vegetables'
  }
];

export const HeroBannerCarousel: React.FC<HeroBannerCarouselProps> = ({
  banners,
  className,
}) => {
  const activeBanners = banners.filter((b) => b.isActive);
  const total = activeBanners.length;

  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning || idx === activeIdx) return;
      setPrevIdx(activeIdx);
      setActiveIdx(idx);
      setIsTransitioning(true);
      setProgress(0);
      progressRef.current = 0;
      lastTickRef.current = null;
      setTimeout(() => {
        setIsTransitioning(false);
        setPrevIdx(null);
      }, 900); // transition duration
    },
    [activeIdx, isTransitioning]
  );

  const next = useCallback(() => {
    goTo((activeIdx + 1) % total);
  }, [activeIdx, total, goTo]);

  const prev = useCallback(() => {
    goTo((activeIdx - 1 + total) % total);
  }, [activeIdx, total, goTo]);

  // Auto-advance with requestAnimationFrame for smooth progress
  useEffect(() => {
    if (isPaused || isTransitioning || total <= 1) return;

    const tick = (timestamp: number) => {
      if (lastTickRef.current === null) lastTickRef.current = timestamp;
      const elapsed = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;

      progressRef.current = Math.min(progressRef.current + (elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(progressRef.current);

      if (progressRef.current >= 100) {
        // trigger next slide
        setActiveIdx((prev) => {
          const next = (prev + 1) % total;
          setPrevIdx(prev);
          setIsTransitioning(true);
          setTimeout(() => {
            setIsTransitioning(false);
            setPrevIdx(null);
          }, 900);
          return next;
        });
        progressRef.current = 0;
        lastTickRef.current = null;
        setProgress(0);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPaused, isTransitioning, total, activeIdx]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  if (!activeBanners.length) return null;

  const current = activeBanners[activeIdx];
  const paddedTotal = String(total).padStart(2, '0');

  // Preload adjacent slides
  const preloadIdxs = [(activeIdx + 1) % total, (activeIdx - 1 + total) % total];

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-stone-950 select-none',
        'h-[540px] sm:h-[580px] lg:h-[640px] xl:h-[680px]',
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Campaign carousel"
      role="region"
    >
      {/* Preload hidden images */}
      <div className="sr-only" aria-hidden>
        {preloadIdxs.map((i) => (
          <img
            key={activeBanners[i].id}
            src={activeBanners[i].imageUrl}
            alt=""
          />
        ))}
      </div>

      {/* Slides */}
      {activeBanners.map((banner, idx) => {
        const isActive = idx === activeIdx;
        const isPrev = idx === prevIdx;
        if (!isActive && !isPrev) return null;

        return (
          <div
            key={banner.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-[900ms] ease-in-out',
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
            aria-hidden={!isActive}
          >
            {/* Background image with Ken Burns */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className={cn(
                  'w-full h-full object-cover object-center',
                  isActive && !isTransitioning
                    ? 'animate-[kenBurnsSlide_16s_ease-in-out_forwards]'
                    : ''
                )}
                style={{
                  filter: 'brightness(0.55)',
                  transform: isActive ? undefined : 'scale(1.04)',
                }}
              />
            </div>

            {/* Layered overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex items-center">
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 max-w-2xl xl:max-w-3xl">
                  {/* Campaign label */}
                  <div
                    className={cn(
                      'mb-5 transition-all duration-700',
                      isActive
                        ? 'opacity-100 translate-y-0 delay-[100ms]'
                        : 'opacity-0 translate-y-3'
                    )}
                  >
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-stone-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" />
                      {banner.badge}
                    </span>
                  </div>

                  {/* Headline */}
                  <h1
                    className={cn(
                      'font-serif font-bold text-white leading-[1.1] tracking-tight transition-all duration-700',
                      'text-3xl sm:text-4xl lg:text-5xl xl:text-[56px]',
                      isActive
                        ? 'opacity-100 translate-y-0 delay-[180ms]'
                        : 'opacity-0 translate-y-4'
                    )}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {banner.title}
                  </h1>

                  {/* Subtitle */}
                  <p
                    className={cn(
                      'mt-4 text-stone-300 leading-relaxed transition-all duration-700',
                      'text-sm sm:text-base lg:text-[17px] max-w-xl',
                      isActive
                        ? 'opacity-100 translate-y-0 delay-[260ms]'
                        : 'opacity-0 translate-y-4'
                    )}
                  >
                    {banner.subtitle}
                  </p>

                  {/* Description (optional) */}
                  {banner.description && (
                    <p
                      className={cn(
                        'mt-2 text-stone-400 text-xs sm:text-sm leading-relaxed transition-all duration-700 max-w-lg',
                        isActive
                          ? 'opacity-100 translate-y-0 delay-[320ms]'
                          : 'opacity-0 translate-y-4'
                      )}
                    >
                      {banner.description}
                    </p>
                  )}

                  {/* CTAs */}
                  <div
                    className={cn(
                      'mt-7 flex flex-wrap items-center gap-3 transition-all duration-700',
                      isActive
                        ? 'opacity-100 translate-y-0 delay-[380ms]'
                        : 'opacity-0 translate-y-4'
                    )}
                  >
                    <Link
                      to={banner.ctaLink}
                      id={`hero-cta-${banner.id}`}
                      className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-crimson hover:bg-[#a80d25] text-white text-sm font-semibold rounded-full tracking-wide uppercase transition-all duration-200 shadow-lg shadow-brand-crimson/30 active:scale-95"
                    >
                      <span>{banner.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {banner.secondaryCtaText && banner.secondaryCtaLink && (
                      <Link
                        to={banner.secondaryCtaLink}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-full tracking-wide uppercase transition-all duration-200 active:scale-95"
                      >
                        {banner.secondaryCtaText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── PERSISTENT 3D INFINITE SPIRAL HELIX (Desktop) ── */}
      <div className="hidden lg:flex absolute inset-0 z-20 pointer-events-none max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 items-center justify-end">
        <div className="w-[420px] xl:w-[460px] h-[480px] xl:h-[520px] flex flex-col items-center justify-center relative pointer-events-auto">
          {/* Top Badge */}
          <div className="absolute top-2 z-20 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium tracking-wide shadow-lg select-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>3D Freshness Helix · Drag or Scroll</span>
          </div>

          {/* InfiniteSpiral 3D Stage Container */}
          <div className="w-full h-full relative overflow-hidden rounded-3xl">
            <InfiniteSpiral
              items={spiralItems}
              animationMode="all"
              speed={0.55}
              radius={160}
              cardWidth={112}
              cardHeight={112}
              verticalSpacing={56}
              perspective={950}
              cardRadius={16}
              centerScale={1.22}
              edgeBlur={4}
              cardsPerTurn={7}
              pauseOnHover={true}
            />
          </div>

          {/* Bottom floating editorial context pill */}
          <div className="absolute bottom-2 left-4 z-20 pointer-events-none bg-stone-900/90 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-white/15 max-w-[240px] animate-float-slow select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-crimson/20 text-brand-crimson flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-brand-crimson uppercase tracking-wider block">Live 3D Supermarket</span>
                <p className="text-[11px] font-semibold text-stone-200 truncate">Harvest & Daily Provisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTROLS ── */}

      {/* Progress bar — thin line at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[3px] bg-white/10">
        <div
          className="h-full bg-brand-crimson transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom-right: counter + arrows */}
      <div className="absolute bottom-5 right-5 sm:right-8 z-30 flex items-center gap-3">
        {/* Slide counter */}
        <span className="text-white/70 text-[11px] font-mono tracking-widest tabular-nums">
          {String(activeIdx + 1).padStart(2, '0')}&nbsp;/&nbsp;{paddedTotal}
        </span>

        {/* Arrow buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            id="hero-carousel-prev"
            aria-label="Previous slide"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            id="hero-carousel-next"
            aria-label="Next slide"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pause indicator when hovered */}
      {isPaused && total > 1 && (
        <div className="absolute top-5 right-5 z-30 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/60 text-[10px] font-medium tracking-wider pointer-events-none">
          PAUSED
        </div>
      )}
    </section>
  );
};

// Mobile version of the carousel — compact, portrait-friendly
export const MobileHeroBannerCarousel: React.FC<HeroBannerCarouselProps> = ({
  banners,
}) => {
  const activeBanners = banners.filter((b) => b.isActive);
  const total = activeBanners.length;

  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((idx: number) => {
    setActiveIdx(idx);
    setProgress(0);
    progressRef.current = 0;
    lastTickRef.current = null;
  }, []);

  const next = useCallback(() => goTo((activeIdx + 1) % total), [activeIdx, total, goTo]);
  const prev = useCallback(() => goTo((activeIdx - 1 + total) % total), [activeIdx, total, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    const tick = (timestamp: number) => {
      if (lastTickRef.current === null) lastTickRef.current = timestamp;
      const elapsed = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;
      progressRef.current = Math.min(progressRef.current + (elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(progressRef.current);
      if (progressRef.current >= 100) {
        setActiveIdx((p) => (p + 1) % total);
        progressRef.current = 0;
        lastTickRef.current = null;
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [total, activeIdx]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!activeBanners.length) return null;
  const current = activeBanners[activeIdx];

  return (
    <div
      className="relative mx-4 rounded-2xl overflow-hidden bg-stone-950 text-white shadow-xl"
      style={{ minHeight: 210 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image */}
      <img
        src={current.mobileImageUrl || current.imageUrl}
        alt={current.title}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: 'brightness(0.55)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end p-5 min-h-[210px]">
        <span className="inline-flex items-center gap-1.5 mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-stone-300">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" />
          {current.badge}
        </span>

        <h2
          className="font-serif text-xl font-bold text-white leading-tight"
          style={{ whiteSpace: 'pre-line' }}
        >
          {current.title.replace(/\n/g, ' ')}
        </h2>
        <p className="mt-1 text-[11px] text-stone-300 line-clamp-2">{current.subtitle}</p>

        <div className="mt-3 flex items-center justify-between">
          <Link
            to={current.ctaLink}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-crimson active:bg-[#a80d25] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow transition-all active:scale-95"
          >
            <span>{current.ctaText}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {/* Progress dots replaced by thin bar + counter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/50 tabular-nums">
              {String(activeIdx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={prev} aria-label="Previous" className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={next} aria-label="Next" className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div className="h-full bg-brand-crimson" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
