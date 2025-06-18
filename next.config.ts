import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Enable experimental features for faster builds
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
  },
};

export default withNextIntl(nextConfig);
