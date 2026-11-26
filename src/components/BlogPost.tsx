import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import StructuredData from "@/components/StructuredData";
import { site, callPromise } from "@/lib/site";
import { authors, linkPattern, plain, type Author, type Block, type Post } from "@/lib/post-rules";
import { posts, postPath } from "@/lib/posts";

const fallbackImage = "/assets/hero/workshop-hook.jpg";
const p = "mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute";
const a = "text-atlantic underline underline-offset-4";

/** "2026-06-15" -> "15 June 2026". Read as a calendar date in UTC, so the day never shifts with the NZ daylight-saving offset. */
export const nzDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Metadata for a post page: a page's openGraph replaces the layout's, so the image goes in every time. */
export function postMetadata(post: Post): Metadata {
  const path = postPath(post.slug);
  return {
    // absolute: the layout's "%s | Flow State" template would push the rendered title past the 50 to 60 rule.
    title: { absolute: post.metaTitle },
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.description,
      url: path,
      images: [post.image?.src ?? fallbackImage],
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: [authors[post.author].name],
    },
  };
}

/** Renders [text](href) links inside a string. Links to our own domain become site paths. */
function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(new RegExp(linkPattern.source, "g"))) {
    const [all, label, raw] = m;
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const href = raw.startsWith(site.url) ? raw.slice(site.url.length) || "/" : raw;
    out.push(
      href.startsWith("/") ? (
        <Link key={i} className={a} href={href}>{label}</Link>
      ) : (
        <a key={i} className={a} href={href} rel="noopener">{label}</a>
      ),
    );
    last = i + all.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function Blocks({ blocks }: { blocks: readonly Block[] }) {
  return blocks.map((b, i) =>
    typeof b === "string" ? (
      <p key={i} className={p}><Rich text={b} /></p>
    ) : "list" in b ? (
      <ul key={i} className="mt-5 max-w-[65ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-relaxed text-mute">
        {b.list.map((li) => <li key={li}><Rich text={li} /></li>)}
      </ul>
    ) : (
      <h3 key={i} className="mt-9 text-lg font-bold text-ink">{b.h3}</h3>
    ),
  );
}

function AuthorBox({ author }: { author: Author }) {
  if (!author.bio) return null;
  return (
    <section aria-labelledby="about-author" className="mt-14 border-t border-hair pt-9">
      <h2 id="about-author" className="text-xl font-bold text-ink">About the author</h2>
      <div className="mt-6 flex items-start gap-5">
        {author.photo && (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
          <img className="h-28 w-24 shrink-0 rounded-lg object-cover sm:h-36 sm:w-28" src={author.photo.src} alt={author.photo.alt} width={author.photo.width} height={author.photo.height} />
        )}
        <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed text-mute">{author.bio}</p>
      </div>
    </section>
  );
}

/**
 * A blog post laid out to playbook section 6.1: H1, byline with visible dates, the direct
 * answer, one H2 per searched question, "In short", FAQ, sources, one call to action, then the
 * author box and related posts. The BlogPosting and FAQPage schema are built from the same data
 * as the visible text, so they can't drift apart.
 */
export default function BlogPost({ post }: { post: Post }) {
  const path = postPath(post.slug);
  const url = `${site.url}${path}`;
  const author: Author = authors[post.author];
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
        author: {
          "@type": "Person",
          name: author.name,
          jobTitle: author.title,
          url: `${site.url}${author.url}`,
          ...(author.photo ? { image: `${site.url}${author.photo.src}` } : {}),
          worksFor: { "@id": `${site.url}/#organization` },
        },
        publisher: { "@id": `${site.url}/#organization` },
        mainEntityOfPage: url,
        image: `${site.url}${post.image?.src ?? fallbackImage}`,
      }} />
      {post.faq.length > 0 && (
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
        }} />
      )}
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <article className="max-w-[52rem]">
          <p className="text-sm font-semibold text-atlantic"><Link href="/blog/">Blog</Link></p>
          <h1 className="h-hero mt-3 max-w-[24ch] text-ink">{post.h1}</h1>
          <p className="mt-6 text-sm text-mute">
            By <Link className="font-semibold text-ink" href={author.url}>{author.name}</Link>, {author.title} at Flow State
            <br />
            Published <time dateTime={post.published}>{nzDate(post.published)}</time>
            {post.updated && <> · Updated <time dateTime={post.updated}>{nzDate(post.updated)}</time></>}
          </p>
          {post.intro && <p className={p}><Rich text={post.intro} /></p>}
          <p className="mt-6 max-w-[65ch] border-l-4 border-atlantic pl-5 text-[1.125rem] font-semibold leading-relaxed text-ink"><Rich text={post.directAnswer} /></p>
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
            <p className={p}><Rich text={post.inShort} /></p>
          </section>
          {post.faq.length > 0 && (
            <section>
              <h2 className="h-sec mb-3 mt-14 max-w-[30ch] border-t border-hair pt-9 text-ink">FAQ</h2>
              {post.faq.map((f) => (
                <div key={f.q}>
                  <h3 className="mt-8 text-lg font-bold text-ink">{f.q}</h3>
                  <p className={p}><Rich text={f.a} /></p>
                </div>
              ))}
            </section>
          )}
          {post.sources && post.sources.length > 0 && (
            <>
              <h2 className="mt-14 border-t border-hair pt-9 text-xl font-bold text-ink">Sources</h2>
              <ul className="mt-5 grid gap-2">
                {post.sources.map((s) => (
                  <li key={s.href}><a className={a} href={s.href} rel="noopener">{s.label}</a></li>
                ))}
              </ul>
            </>
          )}
          {post.closing && <p className={`${p} mt-12`}><Rich text={post.closing} /></p>}
          <div className={`${post.closing ? "mt-7" : "mt-12"} flex flex-wrap items-center gap-6`}>
            <CallButton tone="atlantic" />
            <a className={`font-semibold ${a}`} href="/workflow-diagnostic/">See how getting started works</a>
          </div>
          <p className="mt-3 text-sm text-mute">{callPromise}</p>
          <AuthorBox author={author} />
          <h2 className="mt-14 border-t border-hair pt-9 text-xl font-bold text-ink">More from the blog</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <li><Link className={`font-semibold ${a}`} href="/blog/">All posts →</Link></li>
            <li><Link className={`font-semibold ${a}`} href="/questions/">Questions tradies ask about AI →</Link></li>
            {related.map((r) => (
              <li key={r.slug}><Link className={`font-semibold ${a}`} href={postPath(r.slug)}>{r.h1} →</Link></li>
            ))}
          </ul>
        </article>
      </main>
    </>
  );
}
