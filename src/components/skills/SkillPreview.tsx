"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillPreviewProps {
  previewHtml: string;
  title: string;
  slug: string;
}

/**
 * LocalStorage shim injected into the iframe's HTML.
 * Replaces the real localStorage with an in-memory fake so that
 * theme toggles inside the preview never touch the parent app's storage.
 * This is the same technique used by CodePen, JSFiddle, and StackBlitz.
 */
const STORAGE_SHIM = `<script data-preview-shim>
(function(){
  try {
    var _store = {};
    // Pre-populate from any existing values so the design's initial state works
    try { for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);_store[k]=localStorage.getItem(k);} } catch(e){}
    var fakeStorage = {
      getItem: function(k){ return _store.hasOwnProperty(k) ? _store[k] : null; },
      setItem: function(k,v){ _store[k] = String(v); },
      removeItem: function(k){ delete _store[k]; },
      clear: function(){ _store = {}; },
      key: function(i){ var keys = Object.keys(_store); return keys[i] || null; },
      get length(){ return Object.keys(_store).length; }
    };
    Object.defineProperty(window, 'localStorage', {
      value: fakeStorage,
      writable: false,
      configurable: true
    });
  } catch(e){}
})();
</script>`;

/**
 * Injects the storage shim as the very first script in the HTML,
 * BEFORE any other scripts run. This ensures the shim intercepts
 * all localStorage calls from the design's own code.
 */
function injectStorageShim(html: string): string {
  if (!html) return "";

  // Insert right after <head> or at the very start of the document
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${STORAGE_SHIM}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1>${STORAGE_SHIM}`);
  }
  // No head/html tag — just prepend
  return STORAGE_SHIM + html;
}

export function SkillPreview({ previewHtml, title, slug }: SkillPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [forceDesktop, setForceDesktop] = useState(true);

  // Create a Blob URL with the storage shim injected
  const blobUrl = useMemo(() => {
    const shimmedHtml = injectStorageShim(previewHtml);
    const blob = new Blob([shimmedHtml], { type: "text/html;charset=utf-8" });
    return URL.createObjectURL(blob);
  }, [previewHtml]);

  // Cleanup Blob URL on unmount
  useEffect(() => {
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  // Compute reactive scaling size to force "desktop" target resolution
  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = (entry: ResizeObserverEntry) => {
      // Don't force desktop scaling if the user is physically on a tablet/mobile.
      if (window.innerWidth < 1024) {
        setForceDesktop(false);
        setScale(1);
        return;
      }
      
      setForceDesktop(true);
      const rw = entry.contentRect.width;
      // 1440px is our target standard desktop "canvas" width
      if (rw > 0) setScale(rw / 1440);
    };

    const observer = new ResizeObserver((entries) => {
      if (entries.length) updateScale(entries[0]);
    });
    
    observer.observe(containerRef.current);
    
    const rw = containerRef.current.getBoundingClientRect().width;
    if (window.innerWidth < 1024) {
      setForceDesktop(false);
    } else if (rw > 0) {
      setScale(rw / 1440);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* Action Button Above Preview */}
      <div className="flex justify-end">
        <a
          href={`/preview/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          OPEN FULL PREVIEW
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Preview Area */}
        <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height: "480px" }}>
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-muted p-8">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-4 h-40 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        )}

        {/*
          Blob URL + allow-same-origin = full JS interactivity.
          The injected storage shim prevents localStorage writes from
          leaking into the parent app's theme state.
        */}
        <iframe
          src={blobUrl}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          title={`Preview: ${title}`}
          style={forceDesktop ? {
            width: "1440px",
            height: `${Math.round(480 / scale)}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left"
          } : {
            width: "100%",
            height: "100%"
          }}
          className={`absolute inset-0 border-none transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
        </div>
      </div>
    </div>
  );
}
