import type { Metadata } from "next";
import Collection from "@/components/Collection";
import SetupNotice from "@/components/SetupNotice";
import { getCollection, getDiscogsConfig } from "@/lib/discogs";
import { getSiteTitle, NO_INDEX_ROBOTS } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = getSiteTitle();

  return {
    title,
    description: "A personal vinyl record collection",
    robots: NO_INDEX_ROBOTS,
  };
}

export default async function Home() {
  const { isConfigured, username } = getDiscogsConfig();

  if (!isConfigured) {
    return <SetupNotice />;
  }

  const albums = await getCollection();
  const title = getSiteTitle();

  return (
    <Collection albums={albums} title={title} username={username} />
  );
}
