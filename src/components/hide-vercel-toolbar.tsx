"use client";

import { useEffect } from "react";

const TOOLBAR_SELECTORS = [
  "vercel-live-feedback",
  "#vercel-live-feedback",
  '[data-vercel-toolbar]',
  '[data-vercel-toolbar-rel]',
  'iframe[src*="vercel.live"]',
  'script[src*="vercel.live"]',
].join(",");

function stripToolbar() {
  document.querySelectorAll(TOOLBAR_SELECTORS).forEach((el) => el.remove());
}

/** Removes the platform-injected Vercel Toolbar / feedback circle if it appears. */
export function HideVercelToolbar() {
  useEffect(() => {
    stripToolbar();
    const observer = new MutationObserver(stripToolbar);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
