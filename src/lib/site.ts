/** Shared public business details and booking settings. */
export const site = {
  name: "Flowstate",
  tagline: "Workflow diagnostic and AI partner for NZ electrical businesses",
  city: "Auckland",
  email: "ivan@flowstate.net.nz",
  phone: "027 200 6121",
  phoneHref: "tel:+64272006121",
  /** Every "Book a call" goes through the diagnostic enquiry form first; the Calendly
   *  link lives on that page (public/workflow-diagnostic/index.html). */
  booking: "/workflow-diagnostic/",
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
  { href: "/services/", label: "Diagnostic & AI partner" },
  { href: "/guides/", label: "Guides" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

/** The proof line under the CTA. Kept in one place so it can't drift. */
export const callPromise = `Introductory call: free · about ${site.callMinutes} minutes · diagnostic quoted separately`;

/** The ladder describes gradual adoption, with expansion based on tested value. */
export const rungs = [
  {
    n: "01",
    rung: "Apprentice",
    title: "Learns your business.",
    body:
      "Your processes, knowledge and ways of working.",
    img: "/assets/ladder/01-apprentice",
    alt: "A raw, uncarved block of marble on a workbench, chisel and mallet unused beside it",
  },
  {
    n: "02",
    rung: "Qualified",
    title: "Takes on useful work.",
    body:
      "Handles agreed tasks, with your team checking the results.",
    img: "/assets/ladder/02-qualified",
    alt: "The same block half carved — a figure's head and shoulders finished, the legs still trapped in rough stone",
  },
  {
    n: "03",
    rung: "Foreman",
    title: "Connects the wider business.",
    body:
      "Helps work and information move between your people and systems.",
    img: "/assets/ladder/03-foreman",
    alt: "The finished marble figure of a tradesman in overalls, tools set down, dust swept into a pile",
  },
] as const;
