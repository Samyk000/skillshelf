/**
 * Preview thumbnail utilities for SkillCard and HeroShowcase.
 *
 * Prepares raw preview HTML for thumbnail rendering by:
 * 1. Injecting CSS that forces scroll-reveal animations to be immediately visible
 * 2. Injecting a script that handles inline style="opacity: 0" edge cases
 * 3. Overriding the viewport meta to enforce a desktop-width viewport
 *
 * ONLY used for thumbnail previews (SkillCard, HeroShowcase).
 * Full-page previews (/preview/[slug]) use the raw HTML untouched.
 *
 * Security: All injected content is hardcoded constants (no user data
 * interpolation), maintaining the existing sandbox isolation model.
 */

/** Virtual viewport width for desktop preview thumbnails (px). */
export const PREVIEW_VIRTUAL_WIDTH = 1280;

/**
 * CSS overrides that force scroll-reveal elements to be visible immediately.
 * Targets all major animation libraries and common custom patterns.
 */
const OVERRIDE_STYLES = `<style data-thumbnail-override>
.reveal,.reveal.visible,.reveal-d1,.reveal-d2,.reveal-d3,.reveal-d4,
.fade-in,.fade-up,.fade-down,.fade-left,.fade-right,
.slide-in,.slide-up,.slide-down,.slide-left,.slide-right,
.scroll-animate,.scroll-reveal,.scroll-fade,
.gsap-hidden,.is-hidden,.will-animate,.lazy-animate,
[data-aos],[data-sal],[data-animate],[data-scroll],
[data-reveal],[data-motion],[data-inview],
[class*="animate-on-scroll"],[class*="scroll-trigger"]{
  opacity:1 !important;
  transform:none !important;
  visibility:visible !important;
  clip-path:none !important;
}
*,*::before,*::after{
  transition-duration:0s !important;
  transition-delay:0s !important;
  animation-duration:0s !important;
  animation-delay:0s !important;
  animation-play-state:paused !important;
}
</style>`;

/**
 * Script that handles inline style overrides that CSS can't directly
 * target (e.g., Framer Motion, GSAP-set inline opacity).
 * Runs immediately and again after short delays to catch late JS.
 */
const OVERRIDE_SCRIPT = `<script data-thumbnail-override>
(function(){
  function f(){
    document.querySelectorAll('[style]').forEach(function(e){
      if(e.style.opacity==='0'||e.style.opacity==='0.0')e.style.opacity='1';
      if(e.style.visibility==='hidden')e.style.visibility='visible';
    });
    document.querySelectorAll('.reveal').forEach(function(e){
      e.classList.add('visible');
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',f)}
  else{f()}
  setTimeout(f,100);setTimeout(f,500);
})();
</script>`;

/**
 * Injects thumbnail rendering overrides into preview HTML.
 *
 * @param html - Raw preview HTML string from the database
 * @returns Modified HTML ready for thumbnail iframe rendering
 */
export function injectPreviewThumbnailOverrides(html: string): string {
  if (!html || typeof html !== "string") return "";

  let result = html;

  // 1. Override or inject viewport meta for desktop-width rendering
  const desktopViewport =
    '<meta name="viewport" content="width=1280,initial-scale=1">';
  const viewportRegex = /<meta\s+name=["']viewport["'][^>]*>/i;

  if (viewportRegex.test(result)) {
    result = result.replace(viewportRegex, desktopViewport);
  } else if (/<\/head>/i.test(result)) {
    result = result.replace(/<\/head>/i, `${desktopViewport}\n</head>`);
  } else if (/<body/i.test(result)) {
    result = result.replace(/<body/i, `${desktopViewport}\n<body`);
  } else {
    result = `${desktopViewport}\n${result}`;
  }

  // 2. Inject override styles and script
  const overrides = `${OVERRIDE_STYLES}\n${OVERRIDE_SCRIPT}`;

  if (/<\/head>/i.test(result)) {
    result = result.replace(/<\/head>/i, `${overrides}\n</head>`);
  } else if (/<body([^>]*)>/i.test(result)) {
    result = result.replace(/<body([^>]*)>/i, `<body$1>${overrides}`);
  } else {
    result = `${overrides}\n${result}`;
  }

  return result;
}
