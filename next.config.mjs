/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for Docker optimization
  output: 'standalone',
};

export default nextConfig;
