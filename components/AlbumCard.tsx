"use client";

import Image from "next/image";
import Chip from "@/components/Chip";
import type { Album } from "@/lib/discogs";
import { versionChip, versionsOf } from "@/lib/albums";
import {
  COVER_PLACEHOLDER,
  GRID_IMAGE_SIZES,
  prefetchCover,
} from "@/lib/images";

type AlbumCardProps = {
  album: Album;
  collection: Album[];
  priority?: boolean;
  onSelect: (album: Album) => void;
};

export default function AlbumCard({
  album,
  collection,
  priority = false,
  onSelect,
}: AlbumCardProps) {
  const image = album.coverUrl || album.thumbUrl;
  const versions = versionsOf(album, collection);
  const chip = versionChip(album, versions);

  return (
    <button
      type="button"
      onClick={() => onSelect(album)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && album.coverUrl) {
          prefetchCover(album.coverUrl);
        }
      }}
      className="group cursor-pointer text-left"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface shadow-lg ring-1 ring-white/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
        {image ? (
          <Image
            src={image}
            alt={`${album.artist} - ${album.title}`}
            fill
            sizes={GRID_IMAGE_SIZES}
            quality={90}
            placeholder={COVER_PLACEHOLDER}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover backface-hidden transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            No cover
          </div>
        )}
        {chip ? (
          <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)]">
            <Chip overlay>{chip}</Chip>
          </div>
        ) : null}
      </div>
      <div className="mt-2">
        <p className="truncate text-sm text-cream" title={album.title}>
          {album.title}
        </p>
        <p className="truncate text-xs text-muted" title={album.artist}>
          {album.artist}
          {album.year ? ` · ${album.year}` : ""}
        </p>
      </div>
    </button>
  );
}
