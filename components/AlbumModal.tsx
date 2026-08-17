"use client";

import { useEffect } from "react";
import Image from "next/image";
import Chip from "@/components/Chip";
import {
  CalendarIcon,
  CloseIcon,
  DiscIcon,
  ExternalIcon,
  HashIcon,
  TagIcon,
} from "@/components/icons";
import type { Album } from "@/lib/discogs";
import {
  editionTags,
  formatSummary,
  versionChip,
  versionsOf,
} from "@/lib/albums";
import { COVER_PLACEHOLDER, MODAL_IMAGE_SIZES } from "@/lib/images";

type AlbumModalProps = {
  album: Album;
  collection: Album[];
  onSelect: (album: Album) => void;
  onClose: () => void;
};

export default function AlbumModal({
  album,
  collection,
  onSelect,
  onClose,
}: AlbumModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const cover = album.coverUrl || album.thumbUrl;
  const discogsUrl = `https://www.discogs.com/release/${album.releaseId}`;
  const versions = versionsOf(album, collection);
  const siblings = versions.filter((item) => item.id !== album.id);
  const tags = editionTags(album);
  const format = formatSummary(album);

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-end justify-center bg-black/70 p-0 backdrop-blur-[2px] animate-backdrop-in sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="album-modal-title"
        className="relative w-full max-w-xl cursor-default overflow-hidden rounded-t-2xl bg-surface shadow-2xl animate-modal-in sm:max-w-2xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-cream"
          aria-label="Close album details"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row">
          <div className="relative aspect-square w-full bg-background sm:w-64 sm:shrink-0">
            {cover ? (
              <Image
                src={cover}
                alt={`${album.artist} - ${album.title}`}
                fill
                sizes={MODAL_IMAGE_SIZES}
                className="object-cover"
                quality={90}
                placeholder={COVER_PLACEHOLDER}
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                No cover
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-center gap-5 p-6 sm:p-7">
            <div className="pr-8">
              <p className="text-sm tracking-wide text-accent uppercase">
                {album.artist}
              </p>
              <h2
                id="album-modal-title"
                className="mt-1.5 font-display text-3xl leading-tight text-cream"
              >
                {album.title}
              </h2>
              {tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Chip key={tag} active>
                      {tag}
                    </Chip>
                  ))}
                </div>
              ) : null}
            </div>

            <dl className="space-y-2.5 text-sm">
              {album.year ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-muted">
                    <CalendarIcon />
                    Year
                  </dt>
                  <dd>{album.year}</dd>
                </div>
              ) : null}
              {format ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-muted">
                    <DiscIcon />
                    Format
                  </dt>
                  <dd className="text-right">{format}</dd>
                </div>
              ) : null}
              {album.label ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-muted">
                    <TagIcon />
                    Label
                  </dt>
                  <dd className="text-right">{album.label}</dd>
                </div>
              ) : null}
              {album.catno ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2 text-muted">
                    <HashIcon />
                    Catalog
                  </dt>
                  <dd className="text-right">{album.catno}</dd>
                </div>
              ) : null}
            </dl>

            {siblings.length > 0 ? (
              <div>
                <p className="text-[11px] tracking-wide text-muted uppercase">
                  Other versions
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {siblings.map((sibling) => (
                    <Chip
                      key={sibling.id}
                      onClick={() => onSelect(sibling)}
                    >
                      {versionChip(sibling, versions) ??
                        sibling.catno ??
                        String(sibling.year ?? "Version")}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : null}

            <a
              href={discogsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
            >
              View on Discogs
              <ExternalIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
