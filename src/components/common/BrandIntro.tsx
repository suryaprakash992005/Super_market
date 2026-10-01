import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '../../lib/utils';

interface BrandIntroProps {
  onComplete?: () => void;
}

export const BrandIntro: React.FC<BrandIntroProps> = ({ onComplete }) => {
  // Check if intro has already been shown in this browser session
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return true;
      // Do not show on non-home routes (e.g. direct links to products, categories, search)
      if (window.location.pathname !== '/') return true;
      // Check reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      // Check session storage
      return sessionStorage.getItem('bharathi_intro_shown') === 'true';
    } catch {
      return true;
    }
  });

  // Animation stage: 0 = pre-init, 1 = emblem reveal, 2 = brand name & tagline, 3 = transition into website, 'done' = unmounted
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 'done'>(0);
  const timersRef = useRef<number[]>([]);

  const handleFinish = useCallback(() => {
    try {
      sessionStorage.setItem('bharathi_intro_shown', 'true');
    } catch {}
    document.body.style.overflow = '';
    setStage('done');
    setIsDismissed(true);
    onComplete?.();
  }, [onComplete]);

  // Clean exit with transition
  const handleTransitionOut = useCallback(() => {
    setStage(3);
    const finishTimer = window.setTimeout(() => {
      handleFinish();
    }, 600);
    timersRef.current.push(finishTimer);
  }, [handleFinish]);

  // Instant skip (on click, tap, or Escape)
  const handleSkip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    handleTransitionOut();
  }, [handleTransitionOut]);

  useEffect(() => {
    if (isDismissed) return;

    // Lock body scroll during intro
    document.body.style.overflow = 'hidden';

    // Keyboard listener for Escape key to skip immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Hard fallback safety timer (maximum 2.4s total under all network/device conditions)
    const fallbackTimer = window.setTimeout(() => {
      handleFinish();
    }, 2400);

    // Stage 1: Brand emblem reveal (0ms - 600ms)
    const t1 = window.setTimeout(() => {
      setStage(1);
    }, 60);

    // Stage 2: Brand name, subtitle, and tagline reveal (600ms - 1300ms)
    const t2 = window.setTimeout(() => {
      setStage(2);
    }, 600);

    // Stage 3: Smooth cinematic transition into live website (1350ms - 1950ms)
    const t3 = window.setTimeout(() => {
      handleTransitionOut();
    }, 1350);

    timersRef.current.push(fallbackTimer, t1, t2, t3);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      timersRef.current.forEach(clearTimeout);
    };
  }, [isDismissed, handleFinish, handleSkip, handleTransitionOut]);

  if (isDismissed || stage === 'done') {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Welcome to Bharathi Store"
      onClick={handleSkip}
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center select-none cursor-pointer overflow-hidden transition-all duration-600 ease-out",
        // Background transition: Pristine off-white with subtle crimson radial aura
        stage === 3 
          ? "opacity-0 pointer-events-none scale-102" 
          : "opacity-100 bg-[#FAFAF9]"
      )}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 45%, rgba(200, 16, 46, 0.05) 0%, rgba(250, 250, 249, 0.98) 72%)`,
      }}
    >
      {/* Decorative ambient corner glow */}
      <div 
        className={cn(
          "absolute -top-32 -left-32 w-80 h-80 rounded-full bg-brand-crimson/5 blur-3xl pointer-events-none transition-opacity duration-700",
          stage >= 1 ? "opacity-100" : "opacity-0"
        )} 
      />
      <div 
        className={cn(
          "absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-brand-crimson/5 blur-3xl pointer-events-none transition-opacity duration-700",
          stage >= 1 ? "opacity-100" : "opacity-0"
        )} 
      />

      {/* Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase text-stone-400 hover:text-stone-800 bg-stone-200/50 hover:bg-stone-200/80 backdrop-blur-xs transition-all z-20 active:scale-95"
        aria-label="Skip brand intro"
      >
        <span>Skip</span>
      </button>

      {/* Main Cinematic Brand Presentation Container */}
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center text-center px-6 max-w-lg mx-auto transition-all duration-650 ease-out",
          stage === 3 && "scale-90 -translate-y-8 opacity-0"
        )}
      >
        {/* Stage 1: Official Bharathi 3D Shopping Cart Emblem Icon */}
        <div className="relative mb-5 sm:mb-6">
          {/* Subtle warm halo behind emblem */}
          <div 
            className={cn(
              "absolute inset-0 -m-3 rounded-full bg-gradient-to-tr from-brand-crimson/15 to-amber-500/10 blur-xl transition-all duration-700",
              stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )} 
          />

          <img
            src="/bharathi-emblem-4k.png"
            alt="Bharathi Store Official Emblem"
            className={cn(
              "relative w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-md transition-all duration-700 ease-out",
              stage >= 1 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-85 translate-y-3"
            )}
            style={{ imageRendering: '-webkit-optimize-contrast' }}
            onError={() => {
              // Fail-safe: If logo fails to load, gracefully transition immediately
              handleFinish();
            }}
          />
        </div>

        {/* Stage 2: Official Typography Reveal */}
        <div className="space-y-2.5 sm:space-y-3">
          {/* Brand Name */}
          <div className="overflow-hidden">
            <h1 
              className={cn(
                "font-serif text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-wider transition-all duration-600 ease-out",
                stage >= 2 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-5"
              )}
            >
              <span className="text-brand-crimson">BHARATHI</span>{' '}
              <span className="text-stone-900">STORE</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="overflow-hidden">
            <p 
              className={cn(
                "text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-stone-500 transition-all duration-600 delay-100 ease-out",
                stage >= 2 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-3"
              )}
            >
              SUPERMARKET &amp; PROVISIONS
            </p>
          </div>

          {/* Subtle Divider Line */}
          <div 
            className={cn(
              "w-12 h-0.5 bg-gradient-to-r from-transparent via-brand-crimson to-transparent mx-auto transition-all duration-500 delay-150",
              stage >= 2 ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )} 
          />

          {/* Tagline */}
          <div className="overflow-hidden pt-0.5">
            <p 
              className={cn(
                "text-[10px] sm:text-[11.5px] font-semibold uppercase tracking-[0.22em] text-stone-600 transition-all duration-600 delay-200 ease-out flex items-center justify-center gap-2",
                stage >= 2 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-3"
              )}
            >
              <span>EVERYDAY ESSENTIALS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson inline-block" />
              <span>A BETTER TOMORROW</span>
            </p>
          </div>
        </div>

        {/* Madurai Central Heritage Sub-badge */}
        <div 
          className={cn(
            "mt-8 sm:mt-10 transition-all duration-500 delay-300",
            stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <span className="px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-mono font-medium text-stone-500 tracking-wider uppercase">
            MADURAI CENTRAL • ESTD 2024
          </span>
        </div>
      </div>

      {/* Tap anywhere hint */}
      <div 
        className={cn(
          "absolute bottom-6 left-0 right-0 text-center text-[10px] text-stone-400 font-medium tracking-wider transition-opacity duration-300",
          stage >= 2 && stage !== 3 ? "opacity-75" : "opacity-0"
        )}
      >
        Tap anywhere to enter store
      </div>
    </div>
  );
};

export default BrandIntro;
