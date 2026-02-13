/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // strict mode enabled
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "13.62.223.35",
        port: "3002",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
