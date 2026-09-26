import { getCollection, getDiscogsConfig } from "@/lib/discogs";
import { getSiteTitle } from "@/lib/site";

export async function loadCollectionPage() {
  const { isConfigured, username } = getDiscogsConfig();

  if (!isConfigured) {
    return { configured: false as const };
  }

  const albums = await getCollection();

  return {
    configured: true as const,
    albums,
    username,
    title: getSiteTitle(),
  };
}
