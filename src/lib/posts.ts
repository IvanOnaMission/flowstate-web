import { assertPosts, type Post } from "@/lib/post-rules";
import aiReceptionistForTradies from "@/content/posts/ai-receptionist-for-tradies";

/**
 * Every blog post, newest first. One list drives the /blog/ index, the /blog/<slug>/ pages
 * (src/app/blog/[slug]/page.tsx), each post's "More from the blog" links and the sitemap,
 * so a new post is never an orphan.
 *
 * To add a post, follow docs/sops/blog-posts.md (or run /seo-draft): write
 * src/content/posts/<slug>.ts and import it here, at the top.
 */
export const posts: readonly Post[] = [aiReceptionistForTradies];

/** The one place a post's URL is built. */
export const postPath = (slug: string) => `/blog/${slug}/`;

assertPosts(posts);
