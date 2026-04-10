import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/speaking", destination: "/practice/speaking", permanent: false },
      { source: "/writing", destination: "/practice/writing", permanent: false },
      { source: "/reading", destination: "/practice/reading", permanent: false },
      { source: "/listening", destination: "/practice/listening", permanent: false },
      { source: "/grammar", destination: "/practice/grammar", permanent: false },
    ];
  },
};

export default nextConfig;
