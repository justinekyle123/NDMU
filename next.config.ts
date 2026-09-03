import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // GitHub Codespaces serves the dev server through a forwarded subdomain.
  ...(isDevelopment
    ? {
        allowedDevOrigins: ["*.app.github.dev"],
        experimental: {
          serverActions: {
            allowedOrigins: ["*.app.github.dev"],
          },
        },
      }
    : {}),
};

export default nextConfig;
