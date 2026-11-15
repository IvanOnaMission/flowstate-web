/**
 * Everything about Jordan's live session that may change: date, copy, video.
 * Netlify form names match netlify/lib/live-session.mjs.
 */
export const FORM_NAME = "live-session";
export const ANSWERS_FORM = "live-session-answers";
export const OFFER = "Live session";
export const CAMPAIGN = "live-session";

/** The VSL. Empty shows a placeholder until the final cut is in public/assets/live/. */
export const VIDEO = "";
export const VIDEO_POSTER = "";

export const SESSION = {
  headline: "A free live session for electrical business owners",
  day: "Tuesday 24 November",
  time: "10am NZ time",
  where: "Live online, hosted by Jordan from Conduction Company",
  priceNote: "Free this time. Future sessions will be around $200.",
  doneNote: "Your spot's saved. The joining link comes by email before Tuesday.",
  title: "Free live session for electrical business owners",
  calendarNote: "Live session with Jordan from Conduction Company. The joining link comes by email.",
  // 10am NZDT (UTC+13) on Tue 24 Nov 2026. One hour is a guess for the calendar entry.
  startUtc: "2026-11-23T21:00:00Z",
  endUtc: "2026-11-23T22:00:00Z",
};
