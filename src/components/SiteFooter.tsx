import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="bg-atlantic-deep text-sky">
      <div className="fs-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="fs-display text-[1.5rem] text-white">
            Flow<span className="text-ember-lift">state</span>
          </span>
          <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-sky/70">
            {site.tagline}. Built by someone who has stood at the switchboard as
            well as the spreadsheet.
          </p>
        </div>

        <nav aria-label="Footer">
          <span className="fs-label text-sky/50">Pages</span>
          <ul className="mt-4 space-y-2.5">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.9375rem] text-sky/80 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <span className="fs-label text-sky/50">Get in touch</span>
          <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-sky/80 transition-colors hover:text-white"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.phoneHref}
                className="text-sky/80 transition-colors hover:text-white"
              >
                {site.phone}
              </a>
            </li>
            <li className="text-sky/60">{site.city}, New Zealand</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="fs-shell flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="fs-label text-sky/45">
            {site.name} · {site.tagline}
          </span>
          <span className="fs-label text-sky/45">Auckland, Aotearoa</span>
        </div>
      </div>
    </footer>
  );
}
