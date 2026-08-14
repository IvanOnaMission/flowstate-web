"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import CalendlyButton from "./CalendlyButton";

export default function SiteNav() {
  const path = usePathname();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Never leave the mobile sheet open across a navigation.
  useEffect(() => setOpen(false), [path]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 [transition-timing-function:var(--fs-ease)] ${
        stuck
          ? "border-b border-line bg-white/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="fs-shell flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="fs-display text-[1.375rem] text-atlantic"
          aria-label={`${site.name} — home`}
        >
          Flow<span className="text-ember">state</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {nav.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`fs-label transition-colors hover:text-atlantic ${
                  active ? "text-atlantic" : ""
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <CalendlyButton className="rounded-full bg-ember px-5 py-2.5 font-sans text-[0.875rem] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-deep">
            Book a call
          </CalendlyButton>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 p-2 md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="block h-4 w-6">
            <span
              className={`block h-px w-6 bg-ink transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`mt-[6px] block h-px w-6 bg-ink transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`mt-[6px] block h-px w-6 bg-ink transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-white md:hidden"
      >
        <div className="fs-shell flex flex-col gap-1 py-4">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="fs-label py-3 hover:text-atlantic"
            >
              {l.label}
            </Link>
          ))}
          <CalendlyButton className="mt-3 inline-flex justify-center rounded-full bg-ember px-6 py-3 font-sans text-[0.9375rem] font-medium text-white">
            Book a call
          </CalendlyButton>
        </div>
      </div>
    </header>
  );
}
