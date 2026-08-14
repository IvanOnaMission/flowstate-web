import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Tone = "ember" | "atlantic" | "sky" | "quiet" | "quiet-dark";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans text-[0.9375rem] " +
  "font-medium tracking-[-0.01em] px-7 py-3.5 transition-all duration-300 " +
  "[transition-timing-function:var(--fs-ease)] will-change-transform " +
  "hover:-translate-y-0.5 active:translate-y-0";

const tones: Record<Tone, string> = {
  // The only warm thing on the page. Reserved for the one action that matters.
  ember:
    "bg-ember text-white shadow-[0_1px_2px_rgba(11,27,38,.16)] " +
    "hover:bg-ember-deep hover:shadow-[0_10px_24px_-8px_rgba(194,65,12,.55)]",
  atlantic:
    "bg-atlantic text-white hover:bg-atlantic-deep " +
    "hover:shadow-[0_10px_24px_-8px_rgba(15,75,112,.5)]",
  // For use on the deep Atlantic field, where ember drops below AA.
  sky:
    "bg-sky text-atlantic-deep hover:bg-sky-deep " +
    "hover:shadow-[0_10px_24px_-10px_rgba(196,248,255,.6)]",
  quiet:
    "border border-line-strong text-ink hover:border-atlantic hover:text-atlantic",
  "quiet-dark":
    "border border-white/25 text-sky hover:border-sky hover:bg-white/5",
};

export function Btn({
  href,
  tone = "ember",
  children,
  className = "",
  ...rest
}: { href: string; tone?: Tone; children: ReactNode; className?: string } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children"
>) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const cls = `${base} ${tones[tone]} ${className}`;

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
