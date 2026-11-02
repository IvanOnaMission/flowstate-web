import { site } from "@/lib/site";

/**
 * The only conversion on the public site. Every instance points at the diagnostic
 * enquiry page, where a short form comes before the calendar, so there is one
 * thing to change if it ever moves.
 *
 * Deliberately a plain <a>, not next/link: /workflow-diagnostic/ is a static page in
 * public/, not an app route, so it needs a normal full-page navigation.
 */
export default function CallButton({
  tone = "sky",
  children = "Book a call",
  className = "",
}: {
  tone?: "sky" | "atlantic" | "ghost";
  children?: React.ReactNode;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full font-bold text-[0.95rem] " +
    "px-8 py-[1.0625rem] min-h-11 cursor-pointer transition-[transform,box-shadow,filter,background] " +
    "duration-200 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5";

  const gold =
    "bg-gold text-ink hover:bg-gold-hover hover:shadow-[0_16px_32px_-14px_rgba(245,204,71,.55)]";

  const tones = {
    sky: gold,
    atlantic: gold,
    ghost:
      "bg-white/[.08] text-white border border-white/30 backdrop-blur-[10px] hover:bg-white/[.17]",
  } as const;

  return (
    <a
      href={site.booking}
      className={`${base} ${tones[tone]} ${className}`}
    >
      {children}
    </a>
  );
}
