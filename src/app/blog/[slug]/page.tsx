import type { Metadata } from "next";
import BlogPost, { postMetadata } from "@/components/BlogPost";
import { posts } from "@/lib/posts";

// Static export: every post is built at build time, and any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => {
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error(`No post with slug "${slug}"`);
  return post;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return postMetadata(find((await params).slug));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogPost post={find((await params).slug)} />;
}
