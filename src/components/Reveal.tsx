"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Fade-and-rise on scroll.
 *
 * The important property: THE CONTENT IS NEVER HIDDEN BY JAVASCRIPT.
 * The hidden state lives in CSS behind a `.js` class that an inline script in
 * <head> adds synchronously. So if the bundle fails, is slow, or is blocked,
 * every word still renders — which matters on a page whose only job is a
 * booking. Reduced-motion is handled in CSS for the same reason.
 *
 * This component only ever ADDS the `.in` class. It cannot make text vanish.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
