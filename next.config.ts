// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer';
import { NextConfig } from 'next';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    return config;
  },
};

export default bundleAnalyzer(nextConfig);
