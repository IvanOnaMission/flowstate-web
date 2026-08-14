"use client";

import { useEffect, useRef } from "react";

/**
 * The Flowstate motif: laminar streamlines running off the right edge.
 * Canvas rather than SVG because it's a generative curve redrawn each frame —
 * hand-authored path data would be the wrong tool.
 *
 * Pauses when scrolled out of view and honours prefers-reduced-motion (it
 * still draws one static frame, so the mark is never simply missing).
 */
export default function FlowField({
  stroke = "15, 75, 112",
  lines = 46,
  maxAlpha = 0.3,
  speed = 0.006,
  className = "",
}: {
  stroke?: string;
  lines?: number;
  maxAlpha?: number;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let still = motion.matches;
    let raf: number | null = null;
    let visible = true;
    let t = 0;
    let w = 0;
    let h = 0;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      for (let i = 0; i < lines; i++) {
        const p = i / (lines - 1); // 0 at top, 1 at bottom
        const base = p * h;
        // Fastest mid-channel, slack at the banks — the lines stay roughly
        // parallel so it reads as a current, not a knot.
        const centre = 1 - Math.abs(p - 0.5) * 2;
        const amp = 8 + centre * 26;
        const alpha = (maxAlpha * 0.28 + centre * maxAlpha).toFixed(3);

        ctx.strokeStyle = `rgba(${stroke}, ${alpha})`;
        ctx.beginPath();
        for (let x = -20; x <= w + 20; x += 6) {
          const k = x / w;
          const y =
            base +
            Math.sin(k * 2.2 + t + i * 0.3) * amp +
            Math.sin(k * 4.9 - t * 0.55 + i * 0.17) * amp * 0.34 +
            Math.sin(k * 1.1 + t * 0.28) * 6;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const loop = () => {
      t += speed;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !still && visible) loop();
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    size();
    draw();
    start();

    const ro = new ResizeObserver(() => {
      size();
      draw();
    });
    ro.observe(cv);

    const io = new IntersectionObserver(
      (es) => {
        visible = es[0].isIntersecting;
        visible ? start() : stop();
      },
      { threshold: 0 },
    );
    io.observe(cv);

    const onMotion = (e: MediaQueryListEvent) => {
      still = e.matches;
      still ? stop() : start();
    };
    motion.addEventListener("change", onMotion);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      motion.removeEventListener("change", onMotion);
    };
  }, [stroke, lines, maxAlpha, speed]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
