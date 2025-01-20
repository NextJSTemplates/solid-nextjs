/** @type {import('next').NextConfig} */

const nextConfig = {

  reactStrictMode: true,
  swcMinify: true,
  // typescript: {
  // !! WARN !!
  // Dangerously allow production builds to successfully complete even if
  // your project has type errors.
  // !! WARN !!
  // ignoreBuildErrors: true,
  // },

  eslint: {
    ignoreDuringBuilds: true,
  },
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
