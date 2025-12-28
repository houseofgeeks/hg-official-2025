import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // ensure Turbopack uses this project folder as the workspace root
    root: __dirname,
  },
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
