import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy/" },
  openGraph: { url: "/privacy/" },
  title: "Privacy policy",
  description:
    "How Flowstate handles the information its automations use, including data accessed through Google accounts.",
};

/**
 * Google requires a public privacy policy on an authorised domain before an OAuth app
 * can be published (Google Auth Platform → Branding). The "Limited Use" paragraph is
 * Google's required disclosure for apps that use Google user data; keep it.
 */
const sections = [
  {
    h: "Who we are",
    p: [
      `Flowstate builds automation systems for New Zealand trade businesses. Flowstate is run by Ivan Barnett in Auckland. Contact: ${site.email}.`,
    ],
  },
  {
    h: "What our automations access",
    p: [
      "When a client connects a Google account to a system we build for them, the automation may read and send email in that Gmail account, create and delete drafts, read and update a Google Sheet, save files to Google Drive, and add or change events in Google Calendar. It only does this for the client's own business work, such as answering enquiries, filing documents and sending reminders the client has set up.",
    ],
  },
  {
    h: "How we use it",
    p: [
      "The information is used only to run the client's automation: to understand incoming emails, keep the client's job records up to date, file documents and prepare or send the messages the client has asked for. Email content may be processed by an AI service (Anthropic's Claude) for that purpose only; it is not used to train AI models.",
      "We do not sell personal information, use it for advertising, or share it with anyone except the service providers needed to run the automation (Google, our automation host and the AI service).",
    ],
  },
  {
    h: "Google user data",
    p: [
      "Flowstate's use and transfer of information received from Google APIs to any other app will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
    ],
  },
  {
    h: "Where it's stored and for how long",
    p: [
      "Records the automation keeps (such as job details and a log of what it did) are stored in the client's own Google Sheet and Drive, and in the automation accounts the client owns. We keep them for as long as the client uses the service, and delete them when the client asks or the service ends.",
    ],
  },
  {
    h: "Your choices",
    p: [
      "A client can disconnect their Google account at any time from their Google account settings (Security → Third-party connections). You can ask us what information we hold about you, ask us to correct it, or ask us to delete it, by emailing " +
        site.email +
        ". We follow the New Zealand Privacy Act 2020.",
    ],
  },
] as const;

export default function Privacy() {
  return (
    <>
      <SiteNav />

      <main id="main">
        <section className="shell pb-[clamp(3rem,6vw,5rem)] pt-[clamp(3rem,6vw,4.5rem)]">
          <p className="eyebrow mb-5 text-atlantic">Privacy</p>
          <h1 className="h-hero max-w-[18ch] text-ink">Privacy policy</h1>
          <p className="mt-4 text-mute">Last updated 12 October 2026</p>

          <div className="mt-10 max-w-[64ch] space-y-8">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-xl font-semibold text-ink">{s.h}</h2>
                <div className="mt-3 space-y-4 text-[1.0625rem] leading-relaxed text-mute">
                  {s.p.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
