import type { Album } from "./discogs";

export type SortOption =
  | "artist-asc"
  | "artist-desc"
  | "title-asc"
  | "year-desc"
  | "year-asc"
  | "added-desc";

const GENERIC_FORMAT = new Set([
  "vinyl",
  "cd",
  "cassette",
  "file",
  "dvd",
  "sacd",
  "minidisc",
  "lp",
  "ep",
  "single",
  "album",
  "maxi-single",
  "mini-album",
  "compilation",
  "mixtape",
  "mixed",
  "stereo",
  "mono",
  '7"',
  '10"',
  '12"',
  "45 rpm",
  "33 ⅓ rpm",
  "33 1/3 rpm",
  "78 rpm",
]);

export function versionKey(album: Album): string {
  return `${album.artist.trim().toLowerCase()}::${album.title.trim().toLowerCase()}`;
}

export function versionsOf(album: Album, collection: Album[]): Album[] {
  const key = versionKey(album);
  return collection
    .filter((item) => versionKey(item) === key)
    .sort(
      (a, b) =>
        (a.year ?? 0) - (b.year ?? 0) ||
        a.catno.localeCompare(b.catno) ||
        a.id - b.id
    );
}

export function editionTags(album: Album): string[] {
  return album.formatDescriptions.filter(
    (description) => !GENERIC_FORMAT.has(description.toLowerCase())
  );
}

export function formatSummary(album: Album): string {
  const generic = album.formatDescriptions.filter((description) =>
    GENERIC_FORMAT.has(description.toLowerCase())
  );
  return [album.formatName, ...generic].filter(Boolean).join(" · ");
}

export function versionChip(album: Album, versions: Album[]): string | null {
  const others = versions.filter((item) => item.id !== album.id);
  const tags = editionTags(album);
  const otherTags = new Set(
    others.flatMap(editionTags).map((tag) => tag.toLowerCase())
  );
  const unique = tags.filter((tag) => !otherTags.has(tag.toLowerCase()));

  if (unique[0]) return unique[0];
  if (tags[0]) return tags[0];

  if (others.length === 0) return null;

  if (album.year && others.some((item) => item.year !== album.year)) {
    return String(album.year);
  }
  if (album.catno && others.some((item) => item.catno !== album.catno)) {
    return album.catno;
  }

  return album.catno || (album.year ? String(album.year) : "Alt version");
}

export function filterAndSortAlbums(
  albums: Album[],
  searchQuery: string,
  sortBy: SortOption
): Album[] {
  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? albums.filter((album) => {
        return (
          album.artist.toLowerCase().includes(query) ||
          album.title.toLowerCase().includes(query) ||
          album.label.toLowerCase().includes(query) ||
          album.format.toLowerCase().includes(query) ||
          album.catno.toLowerCase().includes(query) ||
          String(album.year ?? "").includes(query)
        );
      })
    : albums;

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "artist-desc":
        return (
          b.artist.localeCompare(a.artist) || a.title.localeCompare(b.title)
        );
      case "title-asc":
        return (
          a.title.localeCompare(b.title) ||
          a.artist.localeCompare(b.artist) ||
          (a.year ?? 0) - (b.year ?? 0) ||
          a.catno.localeCompare(b.catno)
        );
      case "year-desc":
        return (b.year ?? 0) - (a.year ?? 0);
      case "year-asc":
        return (a.year ?? 0) - (b.year ?? 0);
      case "added-desc":
        return (b.dateAdded ?? "").localeCompare(a.dateAdded ?? "");
      case "artist-asc":
      default:
        return (
          a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title)
        );
    }
  });
}
