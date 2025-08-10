import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    domains: ['santonino-nz.org'],
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
