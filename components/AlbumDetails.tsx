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
    <div className="flex items-center justify-between gap-4">
      <dt className="flex items-center gap-2 text-muted">
        {icon}
        {label}
      </dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

export default function AlbumDetails({
  album,
  collection,
  onSelect,
}: AlbumDetailsProps) {
  const discogsUrl = `https://www.discogs.com/release/${album.releaseId}`;
  const versions = versionsOf(album, collection);
  const siblings = versions.filter((item) => item.id !== album.id);
  const tags = editionTags(album);
  const format = formatSummary(album);

  return (
    <div className="flex flex-col gap-5 p-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+100lvh-100svh))] sm:contents sm:p-0">
      <div className="flex flex-col gap-5 sm:justify-between sm:p-7 sm:pr-14">
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

        <dl className="space-y-2.5 text-sm">
          <Fact icon={<CalendarIcon />} label="Year" value={album.year} />
          <Fact icon={<DiscIcon />} label="Format" value={format} />
          <Fact icon={<TagIcon />} label="Label" value={album.label} />
          <Fact icon={<HashIcon />} label="Catalog" value={album.catno} />
        </dl>
      </div>

      <div className="flex flex-col gap-5 sm:col-span-2 sm:border-t sm:border-white/5 sm:px-7 sm:py-6">
        {siblings.length > 0 ? (
          <div>
            <p className="text-[11px] tracking-wide text-muted uppercase">
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

        <a
          href={discogsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        >
          View on Discogs
          <ExternalIcon />
        </a>
      </div>
    </div>
  );
}
