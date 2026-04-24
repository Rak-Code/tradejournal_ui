/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'vm-6oai6q8mu0s30vswqysixf53.vusercontent.net',
    'localhost',
    '127.0.0.1',
  ],
}

export default nextConfig
