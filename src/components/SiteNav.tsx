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
      <div className="shell flex items-center justify-between gap-6 py-[1.375rem]">
        <Link
          href="/"
          className={`text-[1.0625rem] font-[750] tracking-[-0.015em] ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden gap-7 text-[0.89rem] md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                dark
                  ? "text-white/70 transition-colors duration-200 hover:text-white"
                  : "text-mute transition-colors duration-200 hover:text-ink"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <CallButton
          tone={dark ? "sky" : "atlantic"}
          className="!px-[1.375rem] !py-3 !text-[0.85rem]"
        />
      </div>
    </header>
  );
}
