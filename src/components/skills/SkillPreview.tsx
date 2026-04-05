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
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Header Bar */}
      <div className="flex h-10 items-center justify-between border-b border-border bg-muted/40 px-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20" />
          </div>
          <div className="h-3.5 w-px bg-border/60" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase">
            // PREVIEW
          </span>
        </div>

        <a
          href={`/preview/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          OPEN FULL PREVIEW
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </div>

      {/* Preview Area — 480px original working height */}
      <div className="relative w-full overflow-hidden" style={{ height: "480px" }}>
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
          ref={iframeRef}
          src={blobUrl}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          title={`Preview: ${title}`}
          className={`absolute inset-0 h-full w-full border-none transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
}
