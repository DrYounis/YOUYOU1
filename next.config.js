/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'export' to enable API routes
  // output: 'export',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'i.ytimg.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
