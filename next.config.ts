import type { NextConfig } from "next";

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
};

export default nextConfig;
