"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Skill } from "@/types/skill";

interface HeroShowcaseProps {
  skills: Skill[];
}

export function HeroShowcase({ skills }: HeroShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (isPaused || skills.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % skills.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, skills.length]);

  if (skills.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center border-2 border-border bg-card">
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
    <div
      className="relative h-[500px] overflow-hidden border-2 border-border bg-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
                className="h-full w-full object-cover"
              />
            ) : skill.preview_html ? (
              <div className="h-full w-full bg-white">
                <iframe
                  srcDoc={skill.preview_html}
                  sandbox="allow-scripts"
                  title={`Preview: ${skill.title}`}
                  className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-0"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="font-display text-2xl font-bold tracking-wider text-muted-foreground">
                  // {skill.category.toUpperCase()}
                </span>
              </div>
            )}
          </Link>

          {/* Featured Badge */}
          <div className="absolute -left-1 -top-1 z-30 -rotate-12">
            <span className="bg-primary px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] text-primary-foreground uppercase shadow-md">
              Featured
            </span>
          </div>

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
          {skills.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 w-2.5 border transition-all duration-300 ${
                index === currentIndex
                  ? "border-primary bg-primary"
                  : "border-white/50 bg-transparent hover:border-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
