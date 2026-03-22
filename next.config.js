/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure only src/pages is used for routing
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // pdfkit is a Node.js-only module; exclude from browser bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
