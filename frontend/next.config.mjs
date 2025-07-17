/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/api/photos/**",
      },
      // {
      //   protocol: "https",
      //   hostname: "fullstack-app-jhxjzbofyq-ey.a.run.app",
      //   pathname: "/api/photos/**",
      // },
      {
        protocol: "https",
        hostname: "heymano.com",
        pathname: "/api/photos/**",
      },
    ],
  },
};

export default nextConfig;
