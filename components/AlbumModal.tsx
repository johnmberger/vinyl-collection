"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Album } from "@/lib/discogs";
import { COVER_PLACEHOLDER, MODAL_IMAGE_SIZES } from "@/lib/images";

type AlbumModalProps = {
  album: Album;
  onClose: () => void;
};

export default function AlbumModal({ album, onClose }: AlbumModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="album-modal-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-surface shadow-2xl sm:max-h-[85vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square bg-background">
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

          <div className="flex flex-col p-6 sm:p-8">
            <button
              type="button"
              onClick={onClose}
              className="mb-6 self-end text-sm text-muted transition-colors hover:text-cream"
              aria-label="Close album details"
            >
              Close
            </button>

            <p className="text-sm tracking-wide text-accent uppercase">
              {album.artist}
            </p>
            <h2
              id="album-modal-title"
              className="mt-2 font-display text-3xl leading-tight text-cream"
            >
              {album.title}
            </h2>

            <dl className="mt-8 space-y-3 text-sm">
              {album.year ? (
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-muted">Year</dt>
                  <dd>{album.year}</dd>
                </div>
              ) : null}
              {album.format ? (
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-muted">Format</dt>
                  <dd className="text-right">{album.format}</dd>
                </div>
              ) : null}
              {album.label ? (
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-muted">Label</dt>
                  <dd className="text-right">{album.label}</dd>
                </div>
              ) : null}
              {album.catno ? (
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                  <dt className="text-muted">Catalog</dt>
                  <dd className="text-right">{album.catno}</dd>
                </div>
              ) : null}
            </dl>

            <a
              href={discogsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-auto pt-8 text-sm text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              View on Discogs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
