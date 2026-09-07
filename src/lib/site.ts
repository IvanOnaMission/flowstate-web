/** Shared public business details and booking settings. */
export const site = {
  name: "Flowstate",
  tagline: "AI systems for New Zealand trade businesses",
  city: "Auckland",
  email: "ivan@flowstate.net.nz",
  phone: "027 200 6121",
  phoneHref: "tel:+64272006121",
  calendly: "https://calendly.com/ivan-flowstate/30min",
  callMinutes: 30,
  url: "https://flowstate.net.nz",
} as const;

/**
 * The 25 Aug workshop. A one-off, so this is deliberately a single switch:
 * set `live: false` after it runs and the announcement bar disappears
 * sitewide. Nothing else needs touching.
 *
 * `url` still points at the Netlify address because the custom domain
 * (workshop.flowstate.net.nz) is waiting on a CNAME at GoDaddy. Swap it here
 * once that resolves — it is quoted in exactly one place.
 */
export const workshop = {
  live: false,
  name: "Train your AI apprentice",
  date: "Tue 25 Aug",
  time: "5:30pm",
  minutes: 90,
  price: "$120",
  url: "https://ai-for-sparkies-nz.netlify.app/",
} as const;

export const nav = [
  { href: "/ai-for-electricians/", label: "AI for electricians" },
  { href: "/services/", label: "How it works" },
  { href: "/guides/", label: "Guides" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

/** The proof line under the CTA. Kept in one place so it can't drift. */
export const callPromise = `Free · about ${site.callMinutes} minutes · no pitch deck`;

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
    title: "It holds the whole thing together",
    body:
      "By now it's in everything. Quotes, scheduling, follow-ups, and all the stuff that falls between people. It chases what went quiet, keeps jobs moving, and flags what needs you before it turns into a problem. The business runs tighter and earns better than it did when you were holding all of it yourself.",
    img: "/assets/ladder/03-foreman",
    alt: "The finished marble figure of a tradesman in overalls, tools set down, dust swept into a pile",
  },
] as const;
