import Link from "next/link";
import { nav, site } from "@/lib/site";
import EmailSignup from "./EmailSignup";

export default function SiteFooter() {
  return (
    <footer className="border-t border-hair bg-sky-50">
      {/* Secondary to the call, deliberately. Someone who isn't ready to book
          can still leave an address instead of leaving. */}
      <div className="shell border-b border-hair py-12">
        <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center md:gap-14">
          <div>
            <h2 className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-extrabold leading-tight tracking-[-0.025em] text-ink">
              Not ready for a call?
            </h2>
            <p className="mt-3 max-w-[46ch] text-[1rem] leading-relaxed text-mute">
              I send the odd email about what I&apos;m actually building for
              trade businesses and what&apos;s working. No schedule, no fluff,
              unsubscribe whenever.
            </p>
          </div>
          <EmailSignup />
        </div>
      </div>

      <div className="shell flex flex-col gap-8 py-14 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[1.0625rem] font-[750] tracking-[-0.015em] text-ink">
            {site.name}
          </p>
          <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed text-mute">
            {site.tagline}. Based in {site.city}, working with electrical businesses
            across New Zealand.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-[0.95rem]">
          <p className="eyebrow text-mute">Pages</p>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-mute transition-colors duration-200 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 text-[0.95rem]">
          <p className="eyebrow text-mute">Get hold of me</p>
          <a
            href={`mailto:${site.email}`}
            className="text-mute transition-colors duration-200 hover:text-ink"
          >
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="text-mute transition-colors duration-200 hover:text-ink"
          >
            {site.phone}
          </a>
        </div>
      </div>

      <div className="shell border-t border-hair py-6">
        <p className="text-[0.82rem] text-mute">
          &copy; {new Date().getFullYear()} {site.name}. Built in {site.city}.
        </p>
      </div>
    </footer>
  );
}
