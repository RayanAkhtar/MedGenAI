/** @type {import('next').NextConfig} */
const nextConfig = Object.assign(
  {
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "3.8.163.207",
          port: "5328",
          pathname: "/api/images/**",
        },
      ],
    },
    async rewrites() {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
        },
      ];
    },
  }
);

module.exports = nextConfig;
