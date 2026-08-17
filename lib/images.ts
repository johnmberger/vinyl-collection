import { getImageProps } from "next/image";

export const GRID_IMAGE_SIZES =
  "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 256px";

export const MODAL_IMAGE_SIZES = "(max-width: 640px) 100vw, 320px";

export const ABOVE_FOLD_COUNT = 6;

export const COVER_PLACEHOLDER =
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="100%" height="100%" fill="#1a1714"/></svg>'
  )}` as `data:image/${string}`;

const prefetchedCovers = new Set<string>();

export function prefetchCover(src: string) {
  if (prefetchedCovers.has(src) || typeof window === "undefined") return;
  prefetchedCovers.add(src);

  const { props } = getImageProps({
    src,
    alt: "",
    width: 768,
    height: 768,
    quality: 90,
  });

  const image = new window.Image();
  image.src = props.src;
}
