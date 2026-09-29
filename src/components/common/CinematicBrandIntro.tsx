import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../../lib/motion';

interface CinematicBrandIntroProps {
  onComplete: () => void;
}

export const CinematicBrandIntro: React.FC<CinematicBrandIntroProps> = ({ onComplete }) => {
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Don't replay on every route change, only once per session
    const hasSeen = sessionStorage.getItem('bharathi_brand_intro_played');
    if (hasSeen || prefersReducedMotion()) {
      return false;
    }
    return true;
  });

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const emblemRef = useRef<HTMLImageElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!shouldRender) {
      onComplete();
      return;
    }

    const overlay = overlayRef.current;
    const emblem = emblemRef.current;
    const text = textRef.current;
    const tagline = taglineRef.current;
    const glow = glowRef.current;

    if (!overlay || !emblem || !text || !tagline) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          sessionStorage.setItem('bharathi_brand_intro_played', 'true');
          setShouldRender(false);
          onComplete();
        },
      });

      // 1. Initial State
      gsap.set(overlay, { opacity: 1 });
      gsap.set(emblem, { scale: 0.82, opacity: 0, y: 15 });
      gsap.set(text, { opacity: 0, y: 10 });
      gsap.set(tagline, { opacity: 0, y: 8 });
      if (glow) gsap.set(glow, { scale: 0.7, opacity: 0 });

      // 2. Emblem Entry with soft radial glow
      tl.to(emblem, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'back.out(1.4)',
      })
      .to(glow, {
        opacity: 0.6,
        scale: 1.1,
        duration: 0.5,
      }, '-=0.45')

      // 3. Wordmark Reveal
      .to(text, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      }, '-=0.25')

      // 4. Tagline Soft Fade
      .to(tagline, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power1.out',
      }, '-=0.2')

      // 5. Brief Cinematic Hold (200ms)
      .to({}, { duration: 0.25 })

      // 6. Refined Exit into Navbar Position
      .to([emblem, text, tagline, glow], {
        opacity: 0,
        y: -25,
        duration: 0.42,
        ease: 'power2.in',
        stagger: 0.04,
      })
      .to(overlay, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      }, '-=0.2');
    });

    return () => ctx.revert();
  }, [shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-label="Loading Bharathi Store"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-warm select-none"
    >
      {/* Ambient Crimson Radial Aura */}
      <div
        ref={glowRef}
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-brand-crimson/10 blur-3xl pointer-events-none"
      />

      <div className="relative flex flex-col items-center text-center px-4">
        {/* Official Bharathi Store 3D Cart Emblem */}
        <img
          ref={emblemRef}
          src="/bharathi-emblem-4k.png"
          alt="Bharathi Store"
          className="w-20 h-20 sm:w-28 sm:h-28 object-contain mb-4 drop-shadow-md"
        />

        {/* Wordmark */}
        <div ref={textRef} className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-wider text-obsidian uppercase">
            BHARATHI <span className="text-brand-crimson">STORE</span>
          </h1>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-stone-500"
        >
          Supermarket &bull; Daily Provisions &bull; Express EV Delivery
        </p>
      </div>

      {/* Subtle Skip button for keyboard accessibility or quick bypass */}
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem('bharathi_brand_intro_played', 'true');
          setShouldRender(false);
          onComplete();
        }}
        className="absolute bottom-6 right-6 text-[11px] font-semibold tracking-wider text-stone-400 hover:text-obsidian px-3 py-1.5 rounded-full border border-stone-200/80 bg-white/70 backdrop-blur-sm transition-colors"
      >
        Skip &rarr;
      </button>
    </div>
  );
};
