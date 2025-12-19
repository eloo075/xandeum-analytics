/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const externals = config.externals || [];
      config.externals = [
        ...externals,
        ({ request }, callback) => {
          if (request === 'geoip-lite') {
            return callback(null, 'commonjs geoip-lite');
          }
          callback();
        },
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
