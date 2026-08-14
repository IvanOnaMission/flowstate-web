"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { site } from "@/lib/site";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (o: { url: string }) => void };
  }
}

const CSS = "https://assets.calendly.com/assets/external/widget.css";
const JS = "https://assets.calendly.com/assets/external/widget.js";

/**
 * Opens Calendly in its popup when the widget has loaded, and falls back to a
 * plain new-tab link if it hasn't (or if a blocker ate it). The href is always
 * the real URL, so the button works with JS off and is a real link to crawlers.
 */
export default function CalendlyButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const asked = useRef(false);

  // Only pay for the widget once someone looks like they might book.
  const load = () => {
    if (asked.current) return;
    asked.current = true;

    if (!document.querySelector(`link[href="${CSS}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = CSS;
      document.head.appendChild(l);
    }
    if (window.Calendly) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = JS;
    s.async = true;
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  };

  useEffect(() => {
    // Warm it up when the browser is idle so the first click feels instant.
    const hasIdle = typeof requestIdleCallback === "function";
    const id = hasIdle
      ? requestIdleCallback(load)
      : window.setTimeout(load, 2500);
    return () => {
      if (hasIdle) cancelIdleCallback(id);
      else clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <a
      href={site.calendly}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onFocus={load}
      onMouseEnter={load}
      onClick={(e) => {
        if (ready && window.Calendly) {
          e.preventDefault();
          window.Calendly.initPopupWidget({ url: site.calendly });
        }
      }}
    >
      {children}
    </a>
  );
}
