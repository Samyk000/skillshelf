"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Initial reveal for existing elements
    const revealElements = () => {
      const elements = document.querySelectorAll(".reveal");
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
            }
          });
        },
        { 
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into view
        }
      );

      elements.forEach((el) => observer.observe(el));
      
      return observer;
    };

    const observer = revealElements();

    // Re-run when DOM changes (e.g., after client-side navigation or suspense resolution)
    const mutationObserver = new MutationObserver(() => {
      // Re-observe all reveals to catch new ones
      document.querySelectorAll(".reveal:not(.active)").forEach((el) => {
        observer.observe(el);
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
