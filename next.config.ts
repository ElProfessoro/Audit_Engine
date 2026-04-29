import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  // Le scanner Playwright tourne côté server uniquement
  serverExternalPackages: ["playwright", "playwright-core"],
};

export default nextConfig;
