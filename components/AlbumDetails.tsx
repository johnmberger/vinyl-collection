import type { ReactNode } from "react";
import Chip from "@/components/Chip";
import {
  CalendarIcon,
  DiscIcon,
  ExternalIcon,
  HashIcon,
  TagIcon,
} from "@/components/icons";
import type { Album } from "@/lib/discogs";
import {
  editionTags,
  formatSummary,
  moreByArtist,
  versionChip,
  versionsOf,
} from "@/lib/albums";

type AlbumDetailsProps = {
  album: Album;
  collection: Album[];
  onSelect: (album: Album) => void;
};

function Fact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | number | null;
}) {
  if (value == null || value === "") return null;

  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="flex items-center gap-2 text-muted">
        {icon}
        {label}
      </dt>
      <dd className="text-right text-cream">{value}</dd>
    </div>
  );
}

function formatDateAdded(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AlbumDetails({
  album,
  collection,
  onSelect,
}: AlbumDetailsProps) {
  const discogsUrl = `https://www.discogs.com/release/${album.releaseId}`;
  const versions = versionsOf(album, collection);
  const siblings = versions.filter((item) => item.id !== album.id);
  const related = moreByArtist(album, collection);
  const tags = editionTags(album);
  const format = formatSummary(album);
  const dateAdded = album.dateAdded ? formatDateAdded(album.dateAdded) : null;
  const hasRelated = siblings.length > 0 || related.length > 0;

  return (
    <div className="flex flex-col gap-6 p-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+100lvh-100svh))] sm:contents sm:p-0">
      <div className="flex flex-col gap-6 sm:p-7 sm:pr-12">
        <div>
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

        <dl className="space-y-2.5 border-t border-white/5 pt-5 text-sm">
          <Fact icon={<CalendarIcon />} label="Year" value={album.year} />
          <Fact icon={<DiscIcon />} label="Format" value={format} />
          <Fact icon={<TagIcon />} label="Label" value={album.label} />
          <Fact icon={<HashIcon />} label="Catalog" value={album.catno} />
        </dl>
      </div>

      <div className="border-t border-white/5 pt-5 sm:col-span-2 sm:px-7 sm:pt-6 sm:pb-7">
        {hasRelated ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              {siblings.length > 0 ? (
                <div>
                  <p className="text-[11px] leading-5 tracking-wide text-muted uppercase">
                    Other versions
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {siblings.map((sibling) => (
                      <Chip key={sibling.id} onClick={() => onSelect(sibling)}>
                        {versionChip(sibling, versions) ??
                          sibling.catno ??
                          String(sibling.year ?? "Version")}
                      </Chip>
                    ))}
                  </div>
                </div>
              ) : null}

              {related.length > 0 ? (
                <div>
                  <p className="text-[11px] leading-5 tracking-wide text-muted uppercase">
                    Other {album.artist} albums
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {related.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(item)}
                          className="group inline-flex max-w-full items-baseline gap-2 text-left text-sm leading-5 text-cream transition-colors hover:text-accent"
                        >
                          <span className="truncate underline decoration-cream/25 underline-offset-4 group-hover:decoration-accent/50">
                            {item.title}
                          </span>
                          {item.year ? (
                            <span className="shrink-0 text-muted no-underline">
                              {item.year}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              {dateAdded ? (
                <p className="text-[11px] leading-5 tracking-wide text-muted uppercase">
                  Added {dateAdded}
                </p>
              ) : null}
              <a
                href={discogsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm leading-5 text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              >
                View on Discogs
                <ExternalIcon />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline justify-between gap-4">
            {dateAdded ? (
              <p className="text-[11px] leading-5 tracking-wide text-muted uppercase">
                Added {dateAdded}
              </p>
            ) : (
              <span />
            )}
            <a
              href={discogsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm leading-5 text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
            >
              View on Discogs
              <ExternalIcon />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
