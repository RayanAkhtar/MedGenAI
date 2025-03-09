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
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5328',
        pathname: '/api/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5328',
        pathname: '/api/images/**',
      }
    ],
  },
}

module.exports = nextConfig 