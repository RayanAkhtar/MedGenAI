/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "3.8.163.207",
        port: "5328",
        pathname: "/api/images/**",
      },
      {
        protocol: "http",
        hostname: "3.10.53.122",
        port: "5328",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5328",
        pathname: "/api/images/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/api/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5328",
        pathname: "/api/images/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1", 
        port: "5328",
        pathname: "/admin/**",
      }
    ],
  },
  experimental: {
    serverActions: {}, // If you are using server actions, keep this
  },
  webpack: (config) => {
    return config; // Ensure Webpack is used explicitly
  },
};

module.exports = nextConfig;
