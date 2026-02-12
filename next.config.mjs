/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
