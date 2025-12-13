import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone', 
  images: {
    domains: ["m.media-amazon.com", "covers.openlibrary.org"],
  },
  devIndicators: false,
};
export default nextConfig;
