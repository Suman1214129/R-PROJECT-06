import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@perawallet/connect", "algosdk"],
};

export default nextConfig;
