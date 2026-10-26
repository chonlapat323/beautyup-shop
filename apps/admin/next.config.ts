import type { NextConfig } from "next";

const webOrigin = (process.env.WEB_URL || process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const apiOrigin = (process.env.API_URL || "http://localhost:4000/api").replace(/\/api\/?$/, "");

// The admin panel is fully per-request (every page depends on the signed-in
// user), so it does not use Cache Components / static prerendering.
const nextConfig: NextConfig = {
  transpilePackages: ["@beautyup/types"],
  async rewrites() {
    return [
      { source: "/uploads/:path*", destination: `${apiOrigin}/uploads/:path*` },
      { source: "/slides/:path*", destination: `${webOrigin}/slides/:path*` },
      { source: "/cards/:path*", destination: `${webOrigin}/cards/:path*` },
      { source: "/brands/:path*", destination: `${webOrigin}/brands/:path*` },
      { source: "/products/:path*", destination: `${webOrigin}/products/:path*` },
      { source: "/categories/:path*", destination: `${webOrigin}/categories/:path*` },
      { source: "/ambassadors/:path*", destination: `${webOrigin}/ambassadors/:path*` },
      { source: "/founder.png", destination: `${webOrigin}/founder.png` },
      { source: "/logo.png", destination: `${webOrigin}/logo.png` },
    ];
  },
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
