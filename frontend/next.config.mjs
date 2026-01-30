/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // strict mode enabled
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
