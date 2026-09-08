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

/** The ladder describes gradual adoption, with expansion based on tested value. */
export const rungs = [
  {
    n: "01",
    rung: "Apprentice",
    title: "It learns your business.",
    body:
      "We give the AI the relevant business knowledge and instructions: how your team works, where information lives and what a good result looks like. That gives it a foundation for the work you want it to help with.",
    img: "/assets/ladder/01-apprentice",
    alt: "A raw, uncarved block of marble on a workbench, chisel and mallet unused beside it",
  },
  {
    n: "02",
    rung: "Qualified",
    title: "It takes on useful work.",
    body:
      "We build and test a first workflow around a real business need. The AI follows your process, works with the agreed tools and brings back anything that needs your judgement. Your team checks the results and helps refine how it works.",
    img: "/assets/ladder/02-qualified",
    alt: "The same block half carved — a figure's head and shoulders finished, the legs still trapped in rough stone",
  },
  {
    n: "03",
    rung: "Foreman",
    title: "It supports the wider operation.",
    body:
      "As useful workflows prove themselves, we connect more of the work across your people, information and systems. The AI helps coordinate handovers, surface missing information and keep agreed processes moving—with clear responsibilities for what it handles and what stays with your team.",
    img: "/assets/ladder/03-foreman",
    alt: "The finished marble figure of a tradesman in overalls, tools set down, dust swept into a pile",
  },
] as const;
