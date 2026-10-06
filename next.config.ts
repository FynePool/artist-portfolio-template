import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/config.yml', destination: '/admin/config.yml' },
    ]
  },
};

export default nextConfig;
