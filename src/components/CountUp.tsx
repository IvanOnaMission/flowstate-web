"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

/**
 * Counts up to a number the first time it scrolls into view.
 *
 * Adapted from React Bits (reactbits.dev, MIT). Two changes from the original:
 * the final value is rendered server-side so the number is in the HTML for
 * crawlers and for anyone without JS, and prefers-reduced-motion skips
 * straight to the total instead of animating.
 */
export default function CountUp({
  to,
  from = 0,
  delay = 0,
  duration = 2,
  separator = "",
  className = "",
}: {
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  separator?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);

  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });

  const inView = useInView(ref, { once: true, margin: "0px" });

  const format = useCallback(
    (n: number) => {
      const s = Intl.NumberFormat("en-NZ", {
        useGrouping: !!separator,
        maximumFractionDigits: 0,
      }).format(n);
      return separator ? s.replace(/,/g, separator) : s;
    },
    [separator],
  );

  // Drop back to the starting value only once we know JS is driving it.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (ref.current) ref.current.textContent = format(from);
  }, [from, format]);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => motionValue.set(to), delay * 1000);
    return () => clearTimeout(id);
  }, [inView, motionValue, to, delay]);

  useEffect(() => {
    return springValue.on("change", (latest: number) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
  }, [springValue, format]);

  // Server-rendered with the real total — the animation overwrites it.
  return (
    <span ref={ref} className={className}>
      {format(to)}
    </span>
  );
}
