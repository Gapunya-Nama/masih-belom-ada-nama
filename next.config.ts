// next.config.ts
// import withBundleAnalyzer from '@next/bundle-analyzer';
import { NextConfig } from 'next';

// const bundleAnalyzer = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// });

const nextConfig: NextConfig = {
  // reactStrictMode: true,
  // webpack(config) {
  //   config.cache = false; // Keep cache disabled for now
  //   return config;
  // // },
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone"
};

export default nextConfig;