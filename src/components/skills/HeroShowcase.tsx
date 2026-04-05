"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { Skill } from "@/types/skill";

interface HeroShowcaseProps {
  skills: Skill[];
}

export function HeroShowcase({ skills }: HeroShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Pause rotation when carousel is not in viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
    },
    []
  );

  useEffect(() => {
    if (isPaused || skills.length <= 1 || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % skills.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, skills.length, isVisible]);

  if (skills.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-border bg-card">
        <div className="text-center">
          <p className="font-display text-lg font-bold tracking-wider text-muted-foreground">
            // NO SHOWCASE YET
          </p>
          <p className="mt-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
            Mark skills as featured to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Top Badge */}
      <div className="absolute -left-3 -top-4 z-30">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[11px] font-bold tracking-[0.2em] text-primary-foreground uppercase shadow-xl shadow-primary/20 transition-transform group-hover:scale-110">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          FEATURED
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-black shadow-2xl transition-all duration-500 hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        tabIndex={0}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onKeyDown={(e) => {
          if (skills.length <= 1) return;
          if (e.key === "ArrowLeft") {
            goToSlide((currentIndex - 1 + skills.length) % skills.length);
          } else if (e.key === "ArrowRight") {
            goToSlide((currentIndex + 1) % skills.length);
          }
        }}
      >
        {/* Slides */}
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <Link
              href={`/skills/${skill.slug}`}
              className="absolute inset-0 block overflow-hidden"
              aria-label={`View ${skill.title}`}
            >
              <div className="relative h-full w-full">
                {/* Image Focus - Contain ensures perfect visibility */}
                {skill.cover_image_url ? (
                  <img
                    src={skill.cover_image_url}
                    alt={skill.title}
                    className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-muted/40 p-12 text-center select-none">
                    <span className="border-4 border-primary/20 px-6 py-2 text-xs font-bold tracking-[0.3em] text-primary/60 uppercase">
                      {skill.category}
                    </span>
                    <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground/30">
                      {skill.title}
                    </h2>
                  </div>
                )}
              </div>
              
              {/* Subtle Bottom Scrim for text legibility */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
            </Link>

            {/* Info Overlay - Floating Glass Card */}
            <div className="absolute bottom-4 left-4 z-20 flex items-end">
              <div className="rounded-lg border border-white/10 bg-black/40 p-4 backdrop-blur-md max-w-[400px]">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase">
                      {skill.category}
                    </span>
                    <div className="h-2 w-px bg-white/20" />
                    <span className="text-[10px] font-medium text-white/40 tabular-nums">
                      {index + 1} / {skills.length}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors truncate">
                    {skill.title}
                  </h3>
                  <p className="line-clamp-1 text-xs text-white/60 tracking-wide">
                    {skill.short_description || `Premium ${skill.category} showcase.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Side Navigation Controls */}
        <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between p-4 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToSlide((currentIndex - 1 + skills.length) % skills.length);
            }}
            className="group flex h-10 w-10 pointer-events-auto items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/60 backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-90"
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToSlide((currentIndex + 1) % skills.length);
            }}
            className="group flex h-10 w-10 pointer-events-auto items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/60 backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-90"
            aria-label="Next slide"
          >
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/10">
          <div 
            className="h-full bg-primary transition-all duration-[5000ms] linear"
            style={{ 
              width: currentIndex === currentIndex ? '100%' : '0%',
              opacity: isPaused ? 0.5 : 1
            }}
            key={currentIndex}
          />
        </div>

        {/* Navigation Dots */}
        {skills.length > 1 && (
          <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
            {skills.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`group flex items-center gap-2 p-1`}
              >
                <div className={`h-1 transition-all duration-300 ${
                  index === currentIndex 
                    ? "w-8 bg-primary" 
                    : "w-4 bg-white/30 hover:bg-white/60"
                }`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
