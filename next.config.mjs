import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  images: {
    qualities: [75, 88, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  output: "standalone",
  serverExternalPackages: ["@takumi-rs/core"],
  reactStrictMode: true,
};

export default withMDX(config);
