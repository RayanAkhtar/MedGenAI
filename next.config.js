/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '3.8.163.207',
        port: '5328',
        pathname: '/api/images/**',
      },
    ],
  },
}

module.exports = nextConfig 