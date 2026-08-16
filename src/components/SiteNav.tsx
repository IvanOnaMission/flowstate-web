import Link from "next/link";
import { nav, site } from "@/lib/site";
import CallButton from "./CallButton";

/**
 * Two grounds, one component.
 *
 * `dark` is the home page, where the nav sits transparent over the full-bleed
 * hero. `light` is every other page, where it sits on white with a hairline
 * under it. The wordmark is set in type — there is no logo mark on the site
 * (spec §4.6); the locked SVG is for merch.
 */
export default function SiteNav({ ground = "light" }: { ground?: "light" | "dark" }) {
  const dark = ground === "dark";

  return (
    <header
      className={
        dark
          ? "relative z-20 on-dark"
          : "relative z-20 border-b border-hair bg-white"
      }
    >
      <div className="shell flex items-center justify-between gap-6 pb-3 pt-[1.375rem] md:pb-[1.375rem]">
        <Link
          href="/"
          className={`text-[1.0625rem] font-[750] tracking-[-0.015em] ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {site.name}
        </Link>

        {/* Desktop: links sit between the wordmark and the button. */}
        <nav aria-label="Main" className="hidden gap-7 text-[0.89rem] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={link(dark)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <CallButton
          tone={dark ? "sky" : "atlantic"}
          className="!px-[1.375rem] !py-3 !text-[0.85rem]"
        />
      </div>

      {/*
        Mobile: the same links on their own row, always visible.

        Deliberately not a hamburger. There are three links — hiding them
        behind a tap costs a discovery step and buys back a bit of tidiness,
        and it needs JS, focus management and a scroll lock to do properly.
        This works with JS off and nothing can get stuck open.
      */}
      <nav
        aria-label="Main"
        className="shell flex gap-6 pb-3 text-[0.85rem] md:hidden"
      >
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className={link(dark)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function link(dark: boolean) {
  return dark
    ? "text-white/75 transition-colors duration-200 hover:text-white"
    : "text-mute transition-colors duration-200 hover:text-ink";
}
