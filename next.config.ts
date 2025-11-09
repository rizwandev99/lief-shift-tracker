import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@auth0/nextjs-auth0'],
  /* config options here */
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store, no-cache, must-revalidate",
        },
      ],
    },
  ],
};

export default nextConfig;