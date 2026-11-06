import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    // Verificamos tipado durante pipeline y tsc
    ignoreBuildErrors: false,
  },
  eslint: {
    // Ignorar warnings leves en lint durante build de vercel si no hay eslintrc
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
