import { workshop } from "@/lib/site";

/**
 * A slim announcement bar for the 25 Aug workshop, above the nav on every page.
 *
 * Why a bar and not a section: the home page has one job — book the 15-minute
 * call — and a second full-width CTA competes with it. A bar sits outside that
 * argument, and it comes off in one boolean when the workshop has run
 * (`workshop.live` in lib/site.ts).
 *
 * It renders nothing when the workshop is over, so the switch is safe to flip
 * and forget.
 */
export default function WorkshopBar() {
  if (!workshop.live) return null;

  return (
    <aside className="bg-atlantic on-dark">
      <a
        href={workshop.url}
        className="shell flex items-center justify-center gap-x-3 gap-y-1 py-[0.6875rem] text-center text-[0.8125rem] leading-tight text-white/95 transition-colors hover:text-white max-sm:flex-col sm:text-[0.875rem]"
      >
        <span>
          <span className="font-[750] text-sky">Live workshop</span>
          <span className="px-2 text-white/45" aria-hidden="true">
            ·
          </span>
          {workshop.name}: {workshop.date}, {workshop.minutes} min,{" "}
          {workshop.price}
        </span>
        <span className="whitespace-nowrap font-[650] text-sky underline decoration-sky/40 underline-offset-4">
          Grab a seat
          <span aria-hidden="true"> &rarr;</span>
        </span>
      </a>
    </aside>
  );
}
