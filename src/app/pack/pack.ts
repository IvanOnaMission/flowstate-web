/**
 * Everything about the free pack waitlist that may change: copy, cover, links.
 * Netlify form names match netlify/lib/pack-waitlist.mjs.
 */
export const FORM_NAME = "pack-waitlist";
export const ANSWERS_FORM = "pack-waitlist-answers";
export const OFFER = "Pack waitlist";
export const CAMPAIGN = "pack-waitlist";

/** Cover of Jordan's Pack Catalogue (page 1 of the PDF). */
export const COVER = "/assets/pack/pack-cover.jpg";

export const PACK = {
  // The highlighter-pen word sits on `mark`, like the /live/ and Quote Machine pages.
  headline: { before: "", mark: "127 AI systems", after: " running inside an Auckland electrical business" },
  subhead:
    "What each one does, what it fixes and which ones to set up first. It's free. It's not quite ready yet, so put your name down and I'll email it to you the day it is.",
  facts: ["127 systems", "13 areas of the business", "Free"],
  formTitle: "Get on the list",
  button: "Put me on the list",
  consent: "We'll email you the pack when it's ready, plus the odd email about AI in your business. Unsubscribe any time.",
  saved:
    "You're on the list. Before you go, can you answer a few questions? It helps me point you to the systems that suit your business. All optional.",
  doneNote: "I'll email the pack to you the day it's ready.",
  // Shown after the questions while Jordan's live session (src/app/live/session.ts) is still ahead.
  liveOffer: {
    saved: "Thanks, that's everything for the pack.",
    title: "Hang on, sign up for this as well",
    body: "Jordan owns an Auckland electrical business and runs it with AI. He's doing a free live session showing what AI actually does in his business. Watch the short video.",
    yes: "Save my spot",
    no: "No thanks",
    done: "You're also booked in for the live session on Tuesday at 10am. The Meet link is in your email.",
  },
  calendly: "https://calendly.com/ivan-flowstate/30min?utm_source=flowstate&utm_medium=direct-booking&utm_campaign=pack-waitlist",
  faq: [
    { q: "Is it free?", a: "Yes, it's free." },
    { q: "When will I get it?", a: "As soon as it's ready. It goes out by email to everyone on the list." },
    { q: "Do I need to be technical?", a: "No. Each system is explained in plain words, what it does and what it fixes." },
  ],
};
