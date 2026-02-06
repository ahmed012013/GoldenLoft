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
<<<<<<< HEAD
        port: "4000",
=======
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
>>>>>>> c7e00d1 (swap)
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
