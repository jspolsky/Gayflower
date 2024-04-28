/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("bun:sqlite");
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
