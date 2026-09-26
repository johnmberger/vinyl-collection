import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Collection from "@/components/Collection";
import SetupNotice from "@/components/SetupNotice";
import { loadCollectionPage } from "@/lib/collection-page";
import { getSiteMetadata } from "@/lib/site";
import { findAlbumBySlug } from "@/lib/slugs";

export const revalidate = 86400;

type AlbumPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const base = getSiteMetadata();
  const page = await loadCollectionPage();
  if (!page.configured) return base;

  const { slug } = await params;
  const album = findAlbumBySlug(slug, page.albums);
  if (!album) return base;

  const title = `${album.artist} – ${album.title}`;
  return {
    ...base,
    title,
    openGraph: {
      ...base.openGraph,
      title,
    },
    twitter: {
      ...base.twitter,
      title,
    },
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const page = await loadCollectionPage();

  if (!page.configured) {
    return <SetupNotice />;
  }

  const { slug } = await params;
  const album = findAlbumBySlug(slug, page.albums);
  if (!album) notFound();

  return (
    <Collection
      albums={page.albums}
      title={page.title}
      username={page.username}
      initialSlug={slug}
    />
  );
}
