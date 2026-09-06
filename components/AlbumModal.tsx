"use client";

import type { TransitionEvent as ReactTransitionEvent } from "react";
import Image from "next/image";
import AlbumDetails from "@/components/AlbumDetails";
import { CloseIcon } from "@/components/icons";
import { useSheetDismiss } from "@/hooks/useSheetDismiss";
import type { Album } from "@/lib/discogs";
import { COVER_PLACEHOLDER, MODAL_IMAGE_SIZES } from "@/lib/images";

const SHEET_EASE = "320ms cubic-bezier(0.32, 0.72, 0, 1)";

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
  const {
    sheetRef,
    closing,
    dragging,
    entered,
    dragOffset,
    dragProgress,
    usingDragMotion,
    requestClose,
    handlePointer,
    coverPointer,
    markEntered,
    finishSettling,
  } = useSheetDismiss(onClose);

  const cover = album.coverUrl || album.thumbUrl;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-lvh flex-col pt-[calc(env(safe-area-inset-top,0px)+2.75rem)] sm:inset-0 sm:h-auto sm:items-center sm:justify-center sm:p-6">
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
                transition: dragging ? "none" : `opacity ${SHEET_EASE}`,
              }
            : undefined
        }
        onClick={requestClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="album-modal-title"
        className={`relative z-10 flex min-h-0 w-full max-w-xl flex-1 flex-col overflow-hidden rounded-t-2xl bg-surface shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:flex-none sm:overflow-y-auto sm:rounded-2xl ${
          usingDragMotion
            ? ""
            : closing
              ? "animate-sheet-out sm:animate-modal-out"
              : entered
                ? ""
                : "animate-sheet-in sm:animate-modal-in"
        }`}
        style={{
          transform: usingDragMotion
            ? `translateY(${dragOffset}px)`
            : undefined,
          transition: dragging
            ? "none"
            : usingDragMotion
              ? `transform ${SHEET_EASE}`
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
          markEntered();
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
          finishSettling();
        }}
      >
        <button
          type="button"
          onClick={requestClose}
          className="absolute top-3 right-3 z-10 hidden cursor-pointer rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-cream sm:block"
          aria-label="Close album details"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div
          className="flex min-h-14 shrink-0 touch-none items-center justify-center bg-surface py-4 sm:hidden"
          aria-label="Drag down to close"
          {...handlePointer}
        >
          <div
            className={`h-1.5 w-14 rounded-full transition-colors ${
              dragging ? "bg-white/55" : "bg-white/30"
            }`}
            aria-hidden
          />
        </div>

        <div
          ref={sheetRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain sm:min-h-min sm:flex-none sm:overflow-visible"
        >
          <div className="grid sm:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]">
            <div
              className={`cursor-grab select-none sm:cursor-default sm:touch-auto sm:select-auto sm:active:cursor-default ${
                dragging ? "touch-none active:cursor-grabbing" : "touch-pan-y"
              }`}
              {...coverPointer}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-background sm:rounded-tl-2xl">
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

            <AlbumDetails
              album={album}
              collection={collection}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
