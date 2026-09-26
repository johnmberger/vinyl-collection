import type { Album } from "@/lib/discogs";

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function albumBaseSlug(album: Album): string {
  const artist = slugify(album.artist);
  const title = slugify(album.title);
  return [artist, title].filter(Boolean).join("-");
}

export function albumSlug(album: Album, collection: Album[]): string {
  const base = albumBaseSlug(album);
  const collisions = collection.filter(
    (item) => albumBaseSlug(item) === base,
  );

  if (collisions.length <= 1) return base;
  return `${base}-${album.releaseId}`;
}

export function albumPath(album: Album, collection: Album[]): string {
  return `/album/${albumSlug(album, collection)}`;
}

export function albumSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/album\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function findAlbumBySlug(
  slug: string,
  collection: Album[],
): Album | null {
  const decoded = decodeURIComponent(slug);

  const exact = collection.find(
    (album) => albumSlug(album, collection) === decoded,
  );
  if (exact) return exact;

  const byBase = collection.filter(
    (album) => albumBaseSlug(album) === decoded,
  );
  if (byBase.length === 1) return byBase[0];
  if (byBase.length > 1) {
    return [...byBase].sort((a, b) =>
      (b.dateAdded ?? "").localeCompare(a.dateAdded ?? ""),
    )[0];
  }

  const releaseMatch = decoded.match(/-(\d+)$/);
  if (!releaseMatch) return null;

  const releaseId = Number(releaseMatch[1]);
  return collection.find((album) => album.releaseId === releaseId) ?? null;
}
