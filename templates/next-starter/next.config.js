/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["personakit"],
  },
};

module.exports = nextConfig;
