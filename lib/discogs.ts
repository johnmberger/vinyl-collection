const DISCOGS_API = "https://api.discogs.com";
const USER_AGENT = "VinylCollection/1.0";
export const COLLECTION_REVALIDATE_SECONDS = 86400;

export type Album = {
  id: number;
  releaseId: number;
  title: string;
  artist: string;
  year: number | null;
  coverUrl: string | null;
  thumbUrl: string | null;
  format: string;
  formatName: string;
  formatDescriptions: string[];
  label: string;
  catno: string;
  dateAdded: string | null;
};

type DiscogsCollectionResponse = {
  pagination: {
    page: number;
    pages: number;
    items: number;
  };
  releases: DiscogsCollectionRelease[];
};

type DiscogsCollectionRelease = {
  id: number;
  instance_id?: number;
  date_added?: string;
  basic_information?: {
    id: number;
    title: string;
    year: number;
    cover_image?: string;
    thumb?: string;
    artists?: Array<{ name: string }>;
    labels?: Array<{ name: string; catno: string }>;
    formats?: Array<{
      name: string;
      qty?: string;
      descriptions?: string[];
    }>;
  };
};

export function getDiscogsConfig() {
  const username = process.env.DISCOGS_USERNAME ?? "";
  const token = process.env.DISCOGS_USER_TOKEN ?? "";

  return {
    username,
    token,
    isConfigured: Boolean(username && token),
  };
}

function cleanArtistName(name: string): string {
  return name.replace(/\s+\(\d+\)$/, "").trim();
}

function toAlbum(release: DiscogsCollectionRelease): Album | null {
  const info = release.basic_information;
  if (!info) return null;

  const artists = (info.artists ?? []).map((artist) =>
    cleanArtistName(artist.name)
  );
  const format = info.formats?.[0];
  const label = info.labels?.[0];

  return {
    id: release.instance_id ?? release.id,
    releaseId: info.id,
    title: info.title,
    artist: artists.join(", ") || "Unknown Artist",
    year: info.year || null,
    coverUrl: info.cover_image || info.thumb || null,
    thumbUrl: info.thumb || info.cover_image || null,
    format: format
      ? [format.name, ...(format.descriptions ?? [])].join(" · ")
      : "",
    formatName: format?.name ?? "",
    formatDescriptions: format?.descriptions ?? [],
    label: label?.name ?? "",
    catno: label?.catno ?? "",
    dateAdded: release.date_added ?? null,
  };
}

async function fetchCollectionPage(
  page: number
): Promise<DiscogsCollectionResponse> {
  const { username, token } = getDiscogsConfig();
  const url = new URL(
    `${DISCOGS_API}/users/${username}/collection/folders/0/releases`
  );
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", "100");
  url.searchParams.set("sort", "artist");
  url.searchParams.set("sort_order", "asc");

  const response = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${token}`,
      "User-Agent": USER_AGENT,
    },
    cache: "force-cache",
    next: {
      revalidate: COLLECTION_REVALIDATE_SECONDS,
      tags: ["discogs-collection"],
    },
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Discogs API error (${response.status})${details ? `: ${details}` : ""}`
    );
  }

  return response.json();
}

export async function getCollection(): Promise<Album[]> {
  const firstPage = await fetchCollectionPage(1);
  const releases = [...firstPage.releases];

  for (let page = 2; page <= firstPage.pagination.pages; page += 1) {
    const nextPage = await fetchCollectionPage(page);
    releases.push(...nextPage.releases);
  }

  return releases
    .map(toAlbum)
    .filter((album): album is Album => album !== null);
}
