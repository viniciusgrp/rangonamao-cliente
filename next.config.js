/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
  reactStrictMode: false,
  experimental: {
    optimizeCss: true,
    serverActions: true,
    serverComponentsExternalPackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 