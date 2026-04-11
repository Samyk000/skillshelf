"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { Skill } from "@/types/skill";

interface HeroShowcaseProps {
  skills: Skill[];
}

export function HeroShowcase({ skills }: HeroShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const goToNext = useCallback(() => { 
    setCurrentIndex((prev) => (prev + 1) % skills.length); 
  }, [skills.length]);

  const goToPrev = useCallback(() => { 
    setCurrentIndex((prev) => (prev - 1 + skills.length) % skills.length); 
  }, [skills.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused || skills.length <= 1 || !isVisible) return;
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [isPaused, skills.length, isVisible, goToNext]);

  if (skills.length === 0) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center rounded-[2.5rem] border border-white/10 bg-[#080808]">
        <p className="text-white/20 text-xs font-mono uppercase tracking-widest">No Designs Found</p>
      </div>
    );
  }

  const currentSkill = skills[currentIndex];

  return (
    <div className="relative group/showcase" ref={containerRef}>
      {/* Subtle Atmosphere */}
      <div className="absolute -inset-10 z-0 rounded-full bg-primary/5 blur-[120px] opacity-10" />
      
      {/* Self-contained Workbench */}
      <div 
        className="relative z-10 w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#080808] transition-all duration-700"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Restored Full-size Art Viewport (16:10) */}
        <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
          {/* Surface Grid overlay */}
          <div className="absolute inset-0 z-30 pointer-events-none bg-grid opacity-[0.012]" />
          
          {/* Manual Control Suite */}
          <div className="absolute inset-x-6 top-1/2 z-40 flex -translate-y-1/2 justify-between pointer-events-none">
            <button 
              onClick={(e) => { e.preventDefault(); goToPrev(); }}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-white/50 transition-all hover:bg-white hover:text-black active:scale-95"
              aria-label="Previous Design"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                 <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); goToNext(); }}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-white/50 transition-all hover:bg-white hover:text-black active:scale-95"
              aria-label="Next Design"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                 <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Design Implementation Layers */}
          {skills.map((skill, index) => (
            <div 
              key={skill.id} 
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              {skill.cover_image_url ? (
                <div className="relative h-full w-full">
                  {/* Main Subject - Floating Zero-Crop */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <img 
                      src={skill.cover_image_url} 
                      alt={skill.title} 
                      className="max-h-full max-w-full w-auto h-auto block object-contain shadow-2xl rounded-lg" 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#090909]" />
              )}
            </div>
          ))}

          {/* ULTRA-THIN Metadata Footer (Reduced Height) */}
          <div className="absolute inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/85 backdrop-blur-3xl">
            <div className="px-6 py-3 md:px-8 md:py-3.5">
              <div className="flex items-center justify-between">
                
                {/* Clean Title Component */}
                <div className="text-[9px] font-bold text-white uppercase tracking-[0.2em] font-display truncate max-w-[70%]">
                  {currentSkill.title}
                </div>

                {/* Dashboard Navigation Line */}
                <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-[150px] md:max-w-xs scrollbar-hide">
                  {skills.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => goToSlide(index)}
                      className={`h-[3px] rounded-full shrink-0 transition-all duration-500 ${
                        index === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-white/10 hover:bg-white/20"
                      }`}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Activity Diver (Bottom Detail) */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/[0.05]">
           <div 
             className="h-full bg-primary/40 origin-left"
             style={{ 
               animation: `progressBar 6s linear`,
               animationPlayState: isPaused ? "paused" : "running",
               animationIterationCount: 1,
               animationFillMode: "forwards"
             }}
             key={`progress-${currentIndex}`}
           />
        </div>
        <style>{`
          @keyframes progressBar {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
