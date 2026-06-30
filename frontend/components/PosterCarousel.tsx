'use client';

import { useState, useEffect, useCallback } from 'react';

// ── Poster slides ──────────────────────────────────────────────────────────────
// Full-bleed farmer / agriculture photos (Pexels, free to use).
// Swap `image` with any other URL — an emerald overlay keeps text readable.
interface Slide {
  badge: string;
  titleLead: string;
  titleAccent: string;
  titleTail: string;
  subtitle: string;
  cta: string;
  image: string;
  imageAlt: string;
}

const SLIDES: Slide[] = [
  {
    badge: 'Farm Fresh',
    titleLead: 'From Our Farms',
    titleAccent: 'To Your',
    titleTail: 'Home',
    subtitle:
      'Curated, chemical-free produce sourced directly from verified Indian farmers — no middlemen.',
    cta: 'Shop All Products',
    image:
      'https://images.pexels.com/photos/20445181/pexels-photo-20445181.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: 'Indian farmer tending a green wheat field',
  },
  {
    badge: 'Shree Anna',
    titleLead: 'Pure & Unpolished',
    titleAccent: 'Super',
    titleTail: 'Millets',
    subtitle:
      'Foxtail, Ragi, Bajra & more — naturally grown and packed straight from verified FPOs.',
    cta: 'Explore Millets',
    image:
      'https://images.pexels.com/photos/10738421/pexels-photo-10738421.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: 'Pearl millet crop ripening in a field',
  },
  {
    badge: "Nature's Best",
    titleLead: 'Cold-Pressed Oils',
    titleAccent: '& Forest',
    titleTail: 'Honey',
    subtitle:
      'Wood-pressed oils and wild-harvested honey with zero additives or preservatives.',
    cta: 'View Collection',
    image:
      'https://images.pexels.com/photos/13246534/pexels-photo-13246534.jpeg?auto=compress&cs=tinysrgb&w=1600',
    imageAlt: 'Jars of natural forest honey on a wooden surface',
  },
];

const AUTOPLAY_MS = 4500;

export default function PosterCarousel() {
  const count = SLIDES.length;
  const [index, setIndex] = useState(0); // 0..count (count = clone of first)
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  // ── Autoplay: always advances left ──────────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  // ── Seamless infinite loop: when we land on the cloned slide, snap back ──────
  const handleTransitionEnd = useCallback(() => {
    if (index >= count) {
      setAnimate(false);
      setIndex(0);
    }
  }, [index, count]);

  // Re-enable the transition on the next frame after an instant snap-back
  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true)),
    );
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const goTo = (i: number) => {
    setAnimate(true);
    setIndex(i);
  };
  const prev = () => {
    setAnimate(true);
    setIndex((i) => (i <= 0 ? count - 1 : i - 1));
  };
  const next = () => {
    setAnimate(true);
    setIndex((i) => i + 1);
  };

  const slides = [...SLIDES, SLIDES[0]]; // append clone for seamless wrap
  const activeDot = index % count;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional posters"
    >
      {/* Sliding track */}
      <div
        className="flex w-full h-60 sm:h-72 md:h-80 lg:h-88"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: animate
            ? 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative min-w-full h-full overflow-hidden">
            {/* Background photo */}
            <img
              src={slide.image}
              alt={slide.imageAlt}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.background =
                  'linear-gradient(135deg,#065f46,#064e3b)';
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Emerald overlay — dark on the left for legible text, clear on the right */}
            <div className="absolute inset-0 bg-linear-to-r from-emerald-950/90 via-emerald-900/55 to-emerald-900/10" />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

            {/* Text */}
            <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-7 sm:px-10 md:px-14">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm ring-1 ring-white/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {slide.badge}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl">
                {slide.titleLead}{' '}
                <span className="text-emerald-300">{slide.titleAccent}</span>{' '}
                {slide.titleTail}
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/85 drop-shadow sm:text-base">
                {slide.subtitle}
              </p>
              <a
                href="#marketplace"
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-800 shadow-lg transition-all hover:gap-3 hover:bg-emerald-50"
              >
                {slide.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous poster"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/25 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button
        onClick={next}
        aria-label="Next poster"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/25 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to poster ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              activeDot === i ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
