/**
 * Every fact the pages quote lives here once.
 *
 * The call length is the one that bites: the Calendly slug is still /30min
 * because changing the URL breaks links already sitting in inboxes. Ivan
 * changes the DURATION on the Calendly event instead. Flip callMinutes to 30
 * to revert the copy if that ever changes back.
 */
export const site = {
  name: "Flowstate",
  tagline: "AI systems for New Zealand trade businesses",
  city: "Auckland",
  email: "ivan@flowstate.net.nz",
  phone: "027 200 6121",
  phoneHref: "tel:+64272006121",
  calendly: "https://calendly.com/ivan-flowstate/30min",
  callMinutes: 15,
  url: "https://flowstate.net.nz",
} as const;

export const nav = [
  { href: "/services/", label: "How it works" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

/** The proof line under the CTA. Kept in one place so it can't drift. */
export const callPromise = `Free · ${site.callMinutes} min · no pitch deck`;

/**
 * The ladder. Used on the home page and again on /services/.
 *
 * The honesty constraint is deliberate and load-bearing: rung 01 is proven
 * (Bryce, 3,623 emails classified), rung 02 is harder than it sounds (0 of 63
 * drafts adopted), rung 03 is not proven at all. The copy presents 02 and 03
 * as where this goes, never as a three-week guarantee.
 */
export const rungs = [
  {
    n: "01",
    rung: "Apprentice",
    title: "It learns how you work",
    body:
      "Everything about how you work goes in. Your pricing, your process, the way you talk to a customer. It isn't useful yet. Neither was your first apprentice.",
    img: "/assets/ladder/01-apprentice",
    alt: "A raw, uncarved block of marble on a workbench, chisel and mallet unused beside it",
  },
  {
    n: "02",
    rung: "Qualified",
    title: "It starts pulling its weight",
    body:
      "The day-to-day, done properly. It sorts what comes in, tells you what actually matters, and takes on the stuff you've been doing at nine at night. You still check its work.",
    img: "/assets/ladder/02-qualified",
    alt: "The same block half carved — a figure's head and shoulders finished, the legs still trapped in rough stone",
  },
  {
    n: "03",
    rung: "Foreman",
    title: "It runs ahead of you",
    body:
      "Chases the quote that went quiet. Keeps jobs moving. Flags what needs you before it turns into a problem. You stop being the thing everything waits on.",
    img: "/assets/ladder/03-foreman",
    alt: "The finished marble figure of a tradesman in overalls, tools set down, dust swept into a pile",
  },
] as const;
