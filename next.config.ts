import type { NextConfig } from "next";
import { NO_INDEX_ROBOTS } from "./lib/site";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.discogs.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.discogs.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "st.discogs.com",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    imageSizes: [192, 256, 384, 512],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  async headers() {
    const robotsHeader = {
      key: "X-Robots-Tag",
      value: NO_INDEX_ROBOTS,
    };

    return [
      { source: "/", headers: [robotsHeader] },
      { source: "/:path*", headers: [robotsHeader] },
    ];
  },
};

export default nextConfig;
