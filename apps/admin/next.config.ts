import type { NextConfig } from "next";

// The admin panel is fully per-request (every page depends on the signed-in
// user), so it does not use Cache Components / static prerendering.
const nextConfig: NextConfig = {
  transpilePackages: ["@beautyup/types"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
