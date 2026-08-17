import type { Metadata } from "next";

export const DEFAULT_SITE_TITLE = "John's Vinyl Collection";
export const DEFAULT_SITE_URL = "https://vinyl.johnberger.dev";
export const SITE_DESCRIPTION = "A personal vinyl record collection";

export const NO_INDEX_ROBOTS =
  "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache, noai, noimageai";

export function getSiteTitle() {
  return process.env.SITE_TITLE?.trim() || DEFAULT_SITE_TITLE;
}

export function getSiteUrl() {
  const url = process.env.SITE_URL?.trim() || DEFAULT_SITE_URL;
  return url.replace(/\/$/, "");
}

export function getSiteHost() {
  const url = getSiteUrl();
  if (!url) return "";

  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

export function getSiteMetadata(): Metadata {
  const title = getSiteTitle();
  const url = getSiteUrl();

  return {
    title,
    description: SITE_DESCRIPTION,
    robots: NO_INDEX_ROBOTS,
    ...(url ? { metadataBase: new URL(url) } : {}),
    openGraph: {
      title,
      description: SITE_DESCRIPTION,
      type: "website",
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: SITE_DESCRIPTION,
    },
  };
}
