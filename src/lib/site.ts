export const site = {
  name: "Flowstate",
  tagline: "AI systems for New Zealand trade businesses",
  city: "Auckland",
  email: "ivan@flowstate.net.nz",
  phone: "027 200 6121",
  phoneHref: "tel:+64272006121",
  calendly: "https://calendly.com/ivan-flowstate/30min",
  // The call length every page quotes. The Calendly slug stays /30min —
  // change the duration on that event, not the URL. Flip this to 30 to revert.
  callMinutes: 15,
} as const;

export const nav = [
  { href: "/about/", label: "About" },
  { href: "/services/", label: "How it works" },
  { href: "/contact/", label: "Contact" },
] as const;
