/**
 * Everything about Jordan's live session that may change: date, copy, video.
 * Netlify form names match netlify/lib/live-session.mjs.
 */
export const FORM_NAME = "live-session";
export const ANSWERS_FORM = "live-session-answers";
export const OFFER = "Live session";
export const CAMPAIGN = "live-session";

/** The VSL. Empty shows a placeholder until the final cut is in public/assets/live/. */
export const VIDEO = "/assets/live/jordan-live-session-vsl-tuesday.mp4";
export const VIDEO_POSTER = "/assets/live/jordan-live-session-thumbnail-4.jpg";

export const SESSION = {
  eyebrow: "Free live session for electrical business owners",
  // The highlighter-pen word sits on `mark`, like the Quote Machine page.
  headline: { before: "AI took over ", mark: "most of the work", after: " in my electrical business" },
  watch: "Watch the 45-second video from Jordan.",
  subhead:
    "I'm Jordan from Conduction Company. I'll show you exactly what AI does in our business and the lessons I learned the hard way. You don't need to be technical, just bring your questions.",
  day: "Tuesday",
  time: "10am NZ time",
  where: "Live online",
  priceNote: "Free. Just bring your questions.",
  doneNote: "Your spot's saved. The Google Meet link is on its way by email, and it's in the calendar invite below.",
  calendly: "https://calendly.com/ivan-flowstate/30min?utm_source=flowstate&utm_medium=direct-booking&utm_campaign=live-session",
  faq: [
    { q: "Is it really free?", a: "Yes, it's free." },
    { q: "Do I need to be technical?", a: "No. Jordan keeps it practical. Just bring your questions." },
    { q: "How do I join?", a: "It's on Google Meet. You'll get the link by email as soon as you sign up." },
  ],
  title: "Free live session for electrical business owners",
  meet: "https://meet.google.com/don-dfiw-qam",
  calendarNote: "Live session with Jordan from Conduction Company. Join on Google Meet: https://meet.google.com/don-dfiw-qam",
  // 10am NZDT (UTC+13) on Tue 1 Dec 2026. One hour is a guess for the calendar entry.
  startUtc: "2026-11-30T21:00:00Z",
  endUtc: "2026-11-30T22:00:00Z",
};
