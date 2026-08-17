"use client";

import { useMemo, useState } from "react";
import AlbumCard from "@/components/AlbumCard";
import AlbumModal from "@/components/AlbumModal";
import { filterAndSortAlbums, type SortOption } from "@/lib/albums";
import { ABOVE_FOLD_COUNT } from "@/lib/images";
import type { Album } from "@/lib/discogs";

type CollectionProps = {
  albums: Album[];
  title: string;
  username: string;
};

export default function Collection({
  albums,
  title,
  username,
}: CollectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const visibleAlbums = useMemo(
    () => filterAndSortAlbums(albums, searchQuery, sortBy),
    [albums, searchQuery, sortBy]
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-4xl tracking-tight text-cream sm:text-5xl">
              {title}
            </h1>
            <p className="pb-1 text-sm text-muted">
              {albums.length} record{albums.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search artist, album, label, or year"
                className="w-full cursor-text rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-muted focus:border-accent/60"
              />
            </div>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="cursor-pointer rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-sm text-cream outline-none transition-colors focus:border-accent/60"
            >
              <option value="title-asc">Album A–Z</option>
              <option value="artist-asc">Artist A–Z</option>
              <option value="artist-desc">Artist Z–A</option>
              <option value="year-desc">Year (newest)</option>
              <option value="year-asc">Year (oldest)</option>
              <option value="added-desc">Recently added</option>
            </select>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {visibleAlbums.length === 0 ? (
          <p className="py-20 text-center text-muted">
            No records match that search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {visibleAlbums.map((album, index) => (
              <AlbumCard
                key={album.id}
                album={album}
                priority={index < ABOVE_FOLD_COUNT}
                onSelect={setSelectedAlbum}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted">
          Collection synced from{" "}
          <a
            href={`https://www.discogs.com/user/${username}/collection`}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent cursor-pointer"
          >
            Discogs
          </a>
        </p>
      </footer>

      {selectedAlbum ? (
        <AlbumModal
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
        />
      ) : null}
    </div>
  );
}
