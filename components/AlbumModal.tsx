"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
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
  const [closing, setClosing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [entered, setEntered] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    pending: false,
    startY: 0,
    lastY: 0,
    lastT: 0,
    y: 0,
    velocity: 0,
    lockEl: null as HTMLElement | null,
  });

  const isMobileSheet = () =>
    window.matchMedia("(max-width: 639px)").matches;

  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setDragging(false);
    setDragOffset((current) => {
      if (current <= 0) return current;
      return Math.max(current, window.innerHeight);
    });
  }, [closing]);

  const startDismiss = (
    event: ReactPointerEvent<HTMLElement>,
    startY: number,
  ) => {
    drag.current.active = true;
    drag.current.pending = false;
    drag.current.startY = startY;
    drag.current.lastY = event.clientY;
    drag.current.lastT = performance.now();
    drag.current.y = Math.max(0, event.clientY - startY);
    drag.current.velocity = 0;
    setSettling(false);
    setEntered(true);
    setDragging(true);
    setDragOffset(drag.current.y);
    event.preventDefault();
    event.currentTarget.style.touchAction = "none";
    drag.current.lockEl = event.currentTarget;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateDragOffset = (event: ReactPointerEvent<HTMLElement>) => {
    const next = Math.max(0, event.clientY - drag.current.startY);
    const now = performance.now();
    const elapsed = now - drag.current.lastT;
    if (elapsed > 0) {
      drag.current.velocity = (event.clientY - drag.current.lastY) / elapsed;
    }
    drag.current.lastY = event.clientY;
    drag.current.lastT = now;
    drag.current.y = next;
    setDragOffset(next);
  };

  const onHandlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (closing || !isMobileSheet()) return;
    event.stopPropagation();
    event.preventDefault();
    startDismiss(event, event.clientY);
  };

  const onCoverPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (closing || !isMobileSheet()) return;
    drag.current = {
      active: false,
      pending: true,
      startY: event.clientY,
      lastY: event.clientY,
      lastT: performance.now(),
      y: 0,
      velocity: 0,
      lockEl: null,
    };
  };

  const onCoverPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current.active) {
      updateDragOffset(event);
      return;
    }
    if (!drag.current.pending) return;

    const dy = event.clientY - drag.current.startY;
    if (Math.abs(dy) < 10) return;

    const atTop = (sheetRef.current?.scrollTop ?? 0) <= 1;
    if (dy > 0 && atTop) {
      startDismiss(event, drag.current.startY);
      return;
    }

    drag.current.pending = false;
  };

  const onHandlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    updateDragOffset(event);
  };

  const endDrag = () => {
    drag.current.pending = false;
    drag.current.lockEl?.style.removeProperty("touch-action");
    drag.current.lockEl = null;
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);

    const shouldClose = drag.current.velocity > 0.45 || drag.current.y > 110;
    if (shouldClose) {
      requestClose();
      return;
    }

    setSettling(true);
    setDragOffset(0);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [requestClose]);

  const cover = album.coverUrl || album.thumbUrl;
  const discogsUrl = `https://www.discogs.com/release/${album.releaseId}`;
  const versions = versionsOf(album, collection);
  const siblings = versions.filter((item) => item.id !== album.id);
  const tags = editionTags(album);
  const format = formatSummary(album);

  const dragProgress = Math.min(dragOffset / 360, 1);
  const usingDragMotion = dragging || dragOffset > 0 || settling;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-lvh items-end justify-center sm:inset-0 sm:h-auto sm:items-center sm:p-6">
      <div
        className={`absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-[2px] ${
          usingDragMotion
            ? ""
            : closing
              ? "animate-backdrop-out"
              : "animate-backdrop-in"
        }`}
        style={
          usingDragMotion
            ? {
                opacity: Math.max(0, 1 - dragProgress * 0.85),
                transition: dragging
                  ? "none"
                  : "opacity 320ms cubic-bezier(0.32, 0.72, 0, 1)",
              }
            : undefined
        }
        onClick={requestClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="album-modal-title"
        className={`relative z-10 flex h-[calc(100lvh-0.75rem)] max-h-[calc(100lvh-0.75rem)] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-surface shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-2xl sm:overflow-y-auto sm:rounded-2xl ${
          usingDragMotion
            ? ""
            : closing
              ? "animate-sheet-out sm:animate-modal-out"
              : entered
                ? ""
                : "animate-sheet-in sm:animate-modal-in"
        }`}
        style={{
          transform: usingDragMotion ? `translateY(${dragOffset}px)` : undefined,
          transition: dragging
            ? "none"
            : usingDragMotion
              ? "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)"
              : undefined,
          willChange: usingDragMotion ? "transform" : undefined,
        }}
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (closing) {
            onClose();
            return;
          }
          setEntered(true);
        }}
        onTransitionEnd={(event: ReactTransitionEvent<HTMLDivElement>) => {
          if (
            event.target !== event.currentTarget ||
            event.propertyName !== "transform"
          ) {
            return;
          }
          if (closing) {
            onClose();
            return;
          }
          setSettling(false);
        }}
      >
        <button
          type="button"
          onClick={requestClose}
          className="absolute top-3 right-3 z-10 hidden rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-cream sm:block"
          aria-label="Close album details"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div
          className="flex shrink-0 touch-none items-center justify-center bg-surface py-3 sm:hidden"
          aria-label="Drag down to close"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
        >
          <div
            className={`h-1.5 w-12 rounded-full transition-colors ${
              dragging ? "bg-white/55" : "bg-white/30"
            }`}
            aria-hidden
          />
        </div>

        <div
          ref={sheetRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain sm:min-h-min sm:flex-none sm:overflow-visible"
        >
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div
            className={`cursor-grab select-none sm:w-[min(20rem,46%)] sm:cursor-default sm:touch-auto sm:select-auto sm:shrink-0 sm:active:cursor-default ${
              dragging ? "touch-none active:cursor-grabbing" : "touch-pan-y"
            }`}
            onPointerDown={onCoverPointerDown}
            onPointerMove={onCoverPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
          >
            <div className="relative aspect-square w-full overflow-hidden bg-background">
              {cover ? (
                <Image
                  src={cover}
                  alt={`${album.artist} - ${album.title}`}
                  fill
                  sizes={MODAL_IMAGE_SIZES}
                  className="pointer-events-none object-cover"
                  quality={90}
                  placeholder={COVER_PLACEHOLDER}
                  loading="eager"
                  fetchPriority="high"
                  draggable={false}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  No cover
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-5 p-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+100lvh-100svh))] sm:p-7">
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
    </div>
  );
}
