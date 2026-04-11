"use client";

import Image from "next/image";
import Link from "next/link";
import type { Skill } from "@/types/skill";

interface HeroShowcaseProps {
  skills: Skill[];
}

export function HeroShowcase({ skills }: HeroShowcaseProps) {
  if (skills.length === 0) return null;

  // Duplicate skills to create a seamless loop
  const displaySkills = [...skills, ...skills, ...skills];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Marquee Container */}
      <div className="flex w-fit animate-marquee gap-8 py-10 px-4 hover:[animation-play-state:paused]">
        {displaySkills.map((skill, index) => (
          <Link
            key={`${skill.id}-${index}`}
            href={`/skills/${skill.slug}`}
            className="relative flex-none w-[280px] md:w-[420px] aspect-[16/10] group/card cursor-pointer"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] transition-all duration-700 ease-out group-hover/card:scale-110 group-hover/card:z-20 group-hover/card:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)]">
              {/* Image with High Clarity */}
              <div className="absolute inset-0 z-10">
                {skill.cover_image_url ? (
                  <Image
                    src={skill.cover_image_url}
                    alt={skill.title}
                    fill
                    sizes="(max-width: 768px) 280px, 420px"
                    className="object-contain"
                    priority={index < 5}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] font-mono text-white/10 uppercase tracking-widest">
                    {skill.title}
                  </div>
                )}
              </div>

              {/* Minimalist Title Overlay */}
              <div className="absolute inset-0 z-30 flex items-end justify-center p-8 opacity-0 group-hover/card:opacity-100 transition-all duration-500 bg-linear-to-t from-black/80 via-black/20 to-transparent">
                <span className="text-xs md:text-sm font-bold text-white tracking-[0.2em] uppercase translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500 ease-out">
                  {skill.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
