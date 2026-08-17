export const DEFAULT_SITE_TITLE = "John's Vinyl Collection";

export const NO_INDEX_ROBOTS =
  "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache, noai, noimageai";

export function getSiteTitle() {
  return process.env.SITE_TITLE?.trim() || DEFAULT_SITE_TITLE;
}
