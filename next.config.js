/** @type {import('next').NextConfig} */

const nextConfig = {

  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

module.exports = nextConfig;
