"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Skill } from "@/types/skill";

interface HeroShowcaseProps {
  skills: Skill[];
}

export function HeroShowcase({ skills }: HeroShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(
    () => new Set([0])
  );

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

  const addLoadedSlide = useCallback((index: number) => {
    setLoadedSlides((prev) => {
      const next = new Set(prev);
      next.add(index);
      // Keep only the current slide and 2 adjacent slides to limit memory
      // This ensures recent slides stay loaded while old ones are released
      if (next.size > 3) {
        for (const i of next) {
          if (
            i !== index &&
            Math.abs(((i - index + skills.length) % skills.length)) > 1
          ) {
            next.delete(i);
            break;
          }
        }
      }
      return next;
    });
  }, [skills.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      addLoadedSlide(index);
    },
    [addLoadedSlide]
  );

  useEffect(() => {
    if (isPaused || skills.length <= 1 || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % skills.length;
        addLoadedSlide(next);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, skills.length, addLoadedSlide, isVisible]);

  if (skills.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border-2 border-border bg-card">
        <div className="text-center">
          <p className="font-display text-lg font-bold tracking-wider text-muted-foreground">
            // NO SHOWCASE YET
          </p>
          <p className="mt-2 text-xs tracking-wider text-muted-foreground">
            Mark skills as featured to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Top Badge - Outside the box at top left */}
      <div className="absolute -left-3 -top-4 z-30">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] text-primary-foreground uppercase shadow-md">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          TOP
        </span>
      </div>

      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured skills showcase"
        className="relative h-[500px] overflow-hidden rounded-lg border-2 border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
        >
          {/* Preview Background */}
          <Link
            href={`/skills/${skill.slug}`}
            className="absolute inset-0"
            aria-label={`View ${skill.title}`}
          >
            {skill.cover_image_url ? (
              <img
                src={skill.cover_image_url}
                alt={skill.title}
                width={800}
                height={500}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            ) : skill.preview_html ? (
              <div className="h-full w-full bg-muted">
                {loadedSlides.has(index) ? (
                  <iframe
                    srcDoc={skill.preview_html}
                    sandbox="allow-scripts allow-popups"
                    title={`Preview: ${skill.title}`}
                    className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0 opacity-0 transition-opacity duration-300"
                    loading="lazy"
                    onLoad={(e) => {
                      e.currentTarget.classList.remove("opacity-0");
                      e.currentTarget.classList.add("opacity-100");
                    }}
                  />
                ) : (
                  <ShowcaseSlideSkeleton />
                )}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="font-display text-2xl font-bold tracking-wider text-muted-foreground">
                  // {skill.category.toUpperCase()}
                </span>
              </div>
            )}
          </Link>

          {/* Skill Info Overlay */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <Link href={`/skills/${skill.slug}`} className="block">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="border border-primary px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.1em] text-primary">
                  {skill.category.toUpperCase()}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold tracking-wide text-white">
                {skill.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm tracking-wider text-white/70">
                {skill.short_description}
              </p>
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      {skills.length > 1 && (
        <div className="absolute bottom-4 right-5 z-30 flex items-center gap-2.5">
          {skills.map((skill, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to ${skill.title}`}
              className={`h-4 w-4 border-2 transition-all duration-300 ${
                index === currentIndex
                  ? "border-primary bg-primary"
                  : "border-white/50 bg-transparent hover:border-white"
              }`}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for carousel slides before their iframe is loaded.
 */
function ShowcaseSlideSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-muted p-8">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="mt-4 h-48 w-3/4" />
      <Skeleton className="h-4 w-2/5" />
    </div>
  );
}
