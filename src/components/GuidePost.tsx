import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import StructuredData from "@/components/StructuredData";
import { site, callPromise } from "@/lib/site";
import { authors, type Block, type Post } from "@/lib/post-rules";
import { posts } from "@/lib/posts";

const fallbackImage = "/assets/hero/workshop-hook.jpg";
const p = "mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute";

/** "2026-06-15" -> "15 June 2026". Read as a calendar date in UTC, so the day never shifts with the NZ daylight-saving offset. */
const nzDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Metadata for a post page: a page's openGraph replaces the layout's, so the image goes in every time. */
export function postMetadata(post: Post): Metadata {
  const path = `/guides/${post.slug}/`;
  return {
    // absolute: the layout's "%s | Flow State" template would push the rendered title past the 50 to 60 rule.
    title: { absolute: post.metaTitle },
    description: post.description,
    alternates: { canonical: path },
    openGraph: { type: "article", title: post.metaTitle, description: post.description, url: path, images: [post.image?.src ?? fallbackImage] },
  };
}

function Blocks({ blocks }: { blocks: readonly Block[] }) {
  return blocks.map((b, i) =>
    typeof b === "string" ? (
      <p key={i} className={p}>{b}</p>
    ) : (
      <ul key={i} className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute">
        {b.list.map((li) => <li key={li}>{li}</li>)}
      </ul>
    ),
  );
}

/**
 * A blog post laid out to playbook section 6.1: H1, byline with visible dates, the direct
 * answer, one H2 per searched question, "In short", FAQ, sources, one call to action.
 * The BlogPosting and FAQPage schema are built from the same data as the visible text,
 * so they can't drift apart.
 */
export default function GuidePost({ post }: { post: Post }) {
  const path = `/guides/${post.slug}/`;
  const url = `${site.url}${path}`;
  const author = authors[post.author];
  const related = posts.filter((x) => x.slug !== post.slug).slice(0, 4);
  return (
    <>
      <SiteNav />
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.h1,
        description: post.description,
        datePublished: post.published,
        dateModified: post.updated ?? post.published,
        author: { "@type": "Person", name: author.name, jobTitle: author.role, url: `${site.url}${author.url}` },
        publisher: { "@id": `${site.url}/#organization` },
        mainEntityOfPage: url,
        image: `${site.url}${post.image?.src ?? fallbackImage}`,
      }} />
      {post.faq.length > 0 && (
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }} />
      )}
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <h1 className="h-hero max-w-[24ch] text-ink">{post.h1}</h1>
          <p className="mt-6 text-sm text-mute">
            {author.name}, {author.role} · <time dateTime={post.published}>{nzDate(post.published)}</time>
            {post.updated && <> · Updated <time dateTime={post.updated}>{nzDate(post.updated)}</time></>}
          </p>
          <p className="mt-6 max-w-[65ch] border-l-4 border-atlantic pl-5 text-[1.125rem] font-semibold leading-relaxed text-ink">{post.directAnswer}</p>
          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
            <img className="mt-10 w-full rounded-lg" src={post.image.src} alt={post.image.alt} width={post.image.width} height={post.image.height} />
          )}
          {post.sections.map((s) => (
            <section key={s.q}>
              <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">{s.q}</h2>
              <Blocks blocks={s.a} />
            </section>
          ))}
          <section>
            <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">In short</h2>
            <p className={p}>{post.inShort}</p>
          </section>
          {post.faq.length > 0 && (
            <section>
              <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">FAQ</h2>
              {post.faq.map((f) => (
                <div key={f.q}>
                  <h3 className="mt-8 text-lg font-bold text-ink">{f.q}</h3>
                  <p className={p}>{f.a}</p>
                </div>
              ))}
            </section>
          )}
          {post.sources && post.sources.length > 0 && (
            <>
              <h2 className="mt-14 border-t border-hair pt-9 text-xl font-bold text-ink">Sources</h2>
              <ul className="mt-5 grid gap-2">
                {post.sources.map((s) => (
                  <li key={s.href}><a className="text-atlantic underline underline-offset-4" href={s.href} rel="noopener">{s.label}</a></li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <CallButton tone="atlantic" />
            <a className="font-semibold text-atlantic underline underline-offset-4" href="/workflow-diagnostic/">See how getting started works</a>
          </div>
          <p className="mt-3 text-sm text-mute">{callPromise}</p>
          <h2 className="mt-14 border-t border-hair pt-9 text-xl font-bold text-ink">More guides</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <li><Link className="font-semibold text-atlantic underline underline-offset-4" href="/guides/">All guides →</Link></li>
            <li><Link className="font-semibold text-atlantic underline underline-offset-4" href="/questions/">Questions tradies ask about AI →</Link></li>
            {related.map((r) => (
              <li key={r.slug}><Link className="font-semibold text-atlantic underline underline-offset-4" href={`/guides/${r.slug}/`}>{r.h1} →</Link></li>
            ))}
          </ul>
        </article>
      </main>
    </>
  );
}
