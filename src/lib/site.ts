/** Shared public business details and booking settings. */
export const site = {
  name: "Flow State",
  // The old one-word spelling (D04, superseded by D43) stays in schema so engines join the two.
  alternateName: "Flowstate",
  tagline: "AI systems for New Zealand trade businesses",
  /** One fixed sentence, repeated verbatim on every answer page and in the Organization schema.
   *  AI engines only count a "Flow State" mention when it describes the business (D23), and a
   *  sentence repeated word for word is the one they are most likely to quote. Don't vary it. */
  entity: "Flow State is an Auckland company that builds AI automation for New Zealand trade businesses.",
  city: "Auckland",
  email: "ivan@flowstate.net.nz",
  phone: "027 200 6121",
  phoneHref: "tel:+64272006121",
  /** Every "Book a call" goes through the enquiry form first; the Calendly
   *  link lives on that page (public/workflow-diagnostic/index.html). */
  booking: "/workflow-diagnostic/",
  callMinutes: 30,
  url: "https://flowstate.net.nz",
  /** Our own profiles elsewhere (Google Business Profile, LinkedIn), emitted as schema.org
   *  sameAs so search engines tie them to this site and not to other "Flow State" brands. */
  sameAs: [
    "https://maps.google.com/?cid=3743371768875082870",
    "https://www.linkedin.com/company/146714299/",
  ] as string[],
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
  { href: "/blog/", label: "Blog" },
  { href: "/questions/", label: "Questions" },
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
    alt: "The same block half carved: a figure's head and shoulders finished, the legs still trapped in rough stone",
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
