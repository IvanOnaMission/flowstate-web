import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import StructuredData from "@/components/StructuredData";
import { site, callPromise } from "@/lib/site";
import { answerPages, answersPublished } from "@/lib/answers";

export type Answer = { q: string; a: readonly string[] };

type Props = {
  title: string;
  description: string;
  path: string;
  sections: readonly Answer[];
};

const image = "/assets/hero/workshop-hook.jpg";

/** Page metadata in the same shape as the guides: a page's openGraph replaces the layout's, so images go in every time. */
export function answerMetadata({ title, description, path }: Pick<Props, "title" | "description" | "path">): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [image] },
  };
}

const date = new Date(`${answersPublished}T00:00:00+13:00`).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" });

/**
 * A page that answers a few customer questions in Ivan's words. Each H2 is the question as a
 * customer (or an AI assistant) would ask it, so the answer under it can be quoted on its own.
 */
export default function AnswerPage({ title, description, path, sections }: Props) {
  const related = answerPages.filter((p) => p.href !== path);
  return (
    <>
      <SiteNav />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${site.url}${path}#article`,
        headline: title,
        description,
        datePublished: answersPublished,
        author: { "@type": "Person", name: "Ivan Barnett", url: `${site.url}/about/` },
        publisher: { "@id": `${site.url}/#organization` },
        mainEntityOfPage: `${site.url}${path}`,
        image: `${site.url}${image}`,
      }} />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <h1 className="h-hero max-w-[24ch] text-ink">{title}</h1>
          <p className="mt-6 text-sm text-mute">By Ivan Barnett · {date}</p>
          <p className="mt-6 max-w-[65ch] text-[1.0625rem] font-semibold leading-relaxed text-ink">{site.entity}</p>
          <p className="mt-4 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{description}</p>
          {sections.map((s) => (
            <section key={s.q}>
              <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{s.q}</h2>
              {s.a.map((p) => (
                <p key={p} className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{p}</p>
              ))}
            </section>
          ))}
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <CallButton tone="atlantic" />
            <a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">See how getting started works</a>
          </div>
          <p className="mt-3 text-sm text-mute">{callPromise}</p>
          <h2 className="mt-14 border-t border-hair pt-9 text-xl font-bold text-ink">More answers</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <li><Link className="font-semibold text-atlantic underline underline-offset-4" href="/questions/">All questions tradies ask about AI →</Link></li>
            {related.map((p) => (
              <li key={p.href}><Link className="font-semibold text-atlantic underline underline-offset-4" href={p.href}>{p.label} →</Link></li>
            ))}
          </ul>
        </article>
      </main>
    </>
  );
}
