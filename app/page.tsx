import type { Metadata } from "next";
import Collection from "@/components/Collection";
import SetupNotice from "@/components/SetupNotice";
import { getCollection, getDiscogsConfig } from "@/lib/discogs";
import { getSiteMetadata, getSiteTitle } from "@/lib/site";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata();
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
