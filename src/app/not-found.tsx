import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import { nav, site } from "@/lib/site";

/**
 * A 404 that still does the one job. Someone who mistypes a URL — or follows
 * an old link from before the rebuild — gets a way back and a way to book,
 * not a dead end.
 */
export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(4rem,10vw,7rem)]">
        <p className="eyebrow mb-5 text-atlantic">404</p>
        <h1 className="h-hero max-w-[16ch] text-ink">
          That page isn&apos;t here.{" "}
          <span className="text-atlantic">Everything else still is.</span>
        </h1>
        <p className="mt-7 max-w-[46ch] text-[1.1rem] leading-relaxed text-mute">
          You&apos;ve either followed an old link or I&apos;ve moved something.
          Either way, here&apos;s where to go.
        </p>

        <div className="mt-9 flex flex-wrap gap-6">
          <Link
            href="/"
            className="text-[1.0625rem] font-semibold text-ink underline decoration-hair underline-offset-4 transition-colors duration-200 hover:decoration-atlantic"
          >
            Home
          </Link>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[1.0625rem] font-semibold text-ink underline decoration-hair underline-offset-4 transition-colors duration-200 hover:decoration-atlantic"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-hair pt-9">
          <CallButton tone="atlantic" />
          <span className="text-[0.85rem] text-mute">
            Or email {site.email}
          </span>
        </div>
      </main>
    </>
  );
}
