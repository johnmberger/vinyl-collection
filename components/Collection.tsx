"use client";

import { useEffect, useMemo, useState } from "react";
import AlbumCard from "@/components/AlbumCard";
import AlbumModal from "@/components/AlbumModal";
import { ChevronDownIcon, SearchIcon, SortIcon } from "@/components/icons";
import { filterAndSortAlbums, type SortOption } from "@/lib/albums";
import { ABOVE_FOLD_COUNT } from "@/lib/images";
import type { Album } from "@/lib/discogs";

type CollectionProps = {
  albums: Album[];
  title: string;
  username: string;
};

function useHideOnScroll(disabled: boolean) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (disabled) {
      setHidden(false);
      return;
    }

    const topReveal = 48;
    const threshold = 14;
    const lockMs = 280;
    const ignoreJump = 100;

    let lastY = Math.max(0, window.scrollY);
    let accumulated = 0;
    let lockedUntil = 0;
    let isHidden = false;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const now = performance.now();
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY;
        lastY = y;

        if (now < lockedUntil) {
          accumulated = 0;
          return;
        }

        if (y <= topReveal) {
          accumulated = 0;
          if (isHidden) {
            isHidden = false;
            lockedUntil = now + lockMs;
            setHidden(false);
          }
          return;
        }

        if (Math.abs(delta) > ignoreJump) {
          accumulated = 0;
          return;
        }

        if ((accumulated > 0 && delta < 0) || (accumulated < 0 && delta > 0)) {
          accumulated = 0;
        }
        accumulated += delta;

        if (accumulated > threshold && !isHidden) {
          isHidden = true;
          accumulated = 0;
          lockedUntil = now + lockMs;
          setHidden(true);
        } else if (accumulated < -threshold && isHidden) {
          isHidden = false;
          accumulated = 0;
          lockedUntil = now + lockMs;
          setHidden(false);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [disabled]);

  return hidden;
}

export default function Collection({
  albums,
  title,
  username,
}: CollectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const toolbarHidden = useHideOnScroll(
    searchFocused || selectedAlbum !== null,
  );

  const visibleAlbums = useMemo(
    () => filterAndSortAlbums(albums, searchQuery, sortBy),
    [albums, searchQuery, sortBy]
  );

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-7xl px-4 pt-6 pb-4 sm:px-6 sm:pt-8 lg:px-8">
        <div>
          <h1 className="font-display text-4xl tracking-tight text-cream sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {albums.length} record{albums.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <div
        className={`sticky top-0 z-20 overflow-hidden bg-background/95 backdrop-blur-md transition-[max-height] duration-200 ease-out [transform:translateZ(0)] md:max-h-24 md:pointer-events-auto ${
          toolbarHidden
            ? "pointer-events-none max-h-0"
            : "max-h-44 sm:max-h-24"
        }`}
      >
        <div className="border-b border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:flex-row sm:gap-3 sm:px-6 lg:px-8">
            <div className="relative min-w-0 flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search collection"
                className="w-full cursor-text rounded-xl border border-white/10 bg-surface py-2.5 pr-4 pl-10 text-sm text-cream outline-none transition-colors placeholder:text-muted focus:border-accent/60"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <SortIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                aria-label="Sort collection"
                className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-surface py-2.5 pr-10 pl-10 text-sm text-cream outline-none transition-colors focus:border-accent/60 sm:w-auto sm:pr-10"
              >
                <option value="title-asc">Album A–Z</option>
                <option value="artist-asc">Artist A–Z</option>
                <option value="artist-desc">Artist Z–A</option>
                <option value="year-desc">Year (newest)</option>
                <option value="year-asc">Year (oldest)</option>
                <option value="added-desc">Recently added</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 lg:px-8">
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
                collection={albums}
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
          collection={albums}
          onSelect={setSelectedAlbum}
          onClose={() => setSelectedAlbum(null)}
        />
      ) : null}
    </div>
  );
}
