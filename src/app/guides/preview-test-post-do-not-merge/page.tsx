import GuidePost, { postMetadata } from "@/components/GuidePost";
import post from "@/content/posts/preview-test-post-do-not-merge";

export const metadata = postMetadata(post);

export default function Page() {
  return <GuidePost post={post} />;
}
