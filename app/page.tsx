import type { Metadata } from "next";
import Collection from "@/components/Collection";
import SetupNotice from "@/components/SetupNotice";
import { getCollection, getDiscogsConfig } from "@/lib/discogs";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const title = process.env.SITE_TITLE || "Vinyl Collection";

  return {
    title,
    description: "A personal vinyl record collection",
  };
}

export default async function Home() {
  const { isConfigured, username } = getDiscogsConfig();

  if (!isConfigured) {
    return <SetupNotice />;
  }

  const albums = await getCollection();
  const title = process.env.SITE_TITLE || "Vinyl Collection";

  return (
    <Collection albums={albums} title={title} username={username} />
  );
}
