import { assertPosts, type Post } from "@/lib/post-rules";
import previewTest from "@/content/posts/preview-test-post-do-not-merge";

/**
 * Every blog post, newest first. One list drives the /guides/ index, each post's
 * "More guides" links and the sitemap, so a new post is never an orphan.
 *
 * To add a post, follow docs/sops/blog-posts.md (or run /seo-draft): write
 * src/content/posts/<slug>.ts, add src/app/guides/<slug>/page.tsx, and import it here.
 */
export const posts: readonly Post[] = [previewTest];

assertPosts(posts);
