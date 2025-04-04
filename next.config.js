/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true,
  },
  transpilePackages: ['@mui/material', '@mui/system', '@mui/icons-material'],
}

module.exports = nextConfig 