import type { Album } from "./discogs";

export type SortOption =
  | "artist-asc"
  | "artist-desc"
  | "title-asc"
  | "year-desc"
  | "year-asc"
  | "added-desc";

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
        return a.title.localeCompare(b.title);
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
