import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    // Project screenshots may be replaced without changing their public URL.
    minimumCacheTTL: 60,
  },
  allowedDevOrigins: ['192.168.1.4'],
};

export default nextConfig;
