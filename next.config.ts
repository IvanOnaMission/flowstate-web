import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — Netlify serves the folder, no server runtime, and the
  // hand-written pages already in public/ (offer pages, audit tool) keep
  // their existing URLs untouched.
  output: "export",
  // Existing URLs are /about/, /services/, /contact/ — keep the slash so
  // nothing 404s and no redirects are needed.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
