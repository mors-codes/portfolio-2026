import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    // Project screenshots may be replaced without changing their public URL.
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
