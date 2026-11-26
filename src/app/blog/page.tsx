import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import CallButton from "@/components/CallButton";
import { nzDate } from "@/components/BlogPost";
import { authors } from "@/lib/post-rules";
import { posts, postPath } from "@/lib/posts";

export const metadata: Metadata = {
  alternates: { canonical: "/blog/" },
  openGraph: { url: "/blog/", images: ["/assets/hero/workshop-hook.jpg"] },
  title: "Blog: straight answers on AI for NZ tradies",
  description: "Straight answers from people in the trades on what AI can and can't do for an NZ trade business, from AI receptionists to quoting and admin.",
};

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell py-[clamp(3rem,6vw,5rem)]">
        <div className="max-w-[52rem]">
          <h1 className="h-hero max-w-[24ch] text-ink">{"Blog"}</h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{"Straight answers from people in the trades on what AI can and can't do for an NZ trade business."}</p>
          {posts.map((p) => (
            <article key={p.slug}>
              <h2 className="mt-10 text-2xl font-bold text-ink">
                <Link className="hover:text-atlantic" href={postPath(p.slug)}>{p.h1}</Link>
              </h2>
              <p className="mt-2 text-sm text-mute">
                {authors[p.author].name} · <time dateTime={p.published}>{nzDate(p.published)}</time>
              </p>
              <p className="mt-4 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">{p.card}</p>
              <p className="mt-5"><Link className="font-semibold text-atlantic underline underline-offset-4" href={postPath(p.slug)}>{"Read the post →"}</Link></p>
            </article>
          ))}
          <p className="mt-12 max-w-[65ch] text-[1.0625rem] leading-relaxed text-mute">
            {"Looking for step-by-step guides? See the "}
            <Link className="text-atlantic underline underline-offset-4" href="/guides/">{"guides"}</Link>
            {"."}
          </p>
          <div className="mt-7"><CallButton tone="atlantic" /></div>
        </div>
      </main>
    </>
  );
}
