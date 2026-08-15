import { site } from "@/lib/site";

/**
 * The only conversion on the public site. Every instance points at the same
 * Calendly URL, so there is one thing to change if it ever moves.
 *
 * Deliberately a plain link, not a JS popup widget: it works with JS off, it
 * survives the static export, and it doesn't drag a third-party script onto
 * every page for one button.
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

  const tones = {
    sky: "bg-sky text-atlantic hover:brightness-107 hover:shadow-[0_16px_34px_-14px_rgba(196,248,255,.6)]",
    atlantic:
      "bg-atlantic text-white hover:brightness-112 hover:shadow-[0_16px_32px_-14px_rgba(15,75,112,.6)]",
    ghost:
      "bg-white/[.08] text-white border border-white/30 backdrop-blur-[10px] hover:bg-white/[.17]",
  } as const;

  return (
    <a
      href={site.calendly}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${tones[tone]} ${className}`}
    >
      {children}
    </a>
  );
}
