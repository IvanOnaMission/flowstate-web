import StructuredData from "./StructuredData";
import { site } from "@/lib/site";

export type Faq = { question: string; answer: string };

/**
 * Visible questions and FAQPage JSON-LD from the same strings, so the
 * schema cannot drift from the page.
 */
export default function FaqBlock({
  faqs,
  path,
  heading = "Frequently asked questions",
  accent = false,
}: {
  faqs: readonly Faq[];
  path: string;
  heading?: string;
  accent?: boolean;
}) {
  return (
    <section aria-labelledby="faq" className="mt-14 border-t border-hair pt-9">
      {accent ? <span className="mb-3 block h-1 w-10 bg-gold" aria-hidden="true" /> : null}
      <h2 id="faq" className="h-sec max-w-[24ch] text-ink">
        {heading}
      </h2>
      <div className="mt-6 max-w-[65ch]">
        {faqs.map((faq) => (
          <details key={faq.question} className="group border-b border-hair py-4">
            <summary className="cursor-pointer text-[1.0625rem] font-[750] tracking-[-0.015em] text-ink">
              {faq.question}
            </summary>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-mute">{faq.answer}</p>
          </details>
        ))}
      </div>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${site.url}${path}#faq`,
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
    </section>
  );
}
