import type { Metadata } from "next";
import Collection from "@/components/Collection";
import SetupNotice from "@/components/SetupNotice";
import { loadCollectionPage } from "@/lib/collection-page";
import { getSiteMetadata } from "@/lib/site";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata();
}

export default async function Home() {
  const page = await loadCollectionPage();

  if (!page.configured) {
    return <SetupNotice />;
  }

  return (
    <Collection
      albums={page.albums}
      title={page.title}
      username={page.username}
    />
  );
}
