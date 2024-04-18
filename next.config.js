/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack(config) {
    config.module.rules.push({
      test: /\.(svg|jpe?g|png)$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },  

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_IMG_RESOURCES_ADDRESS, 
        port: process.env.NEXT_PUBLIC_IM_RESOURCES_PORT,
        pathname: "/**"
      },
    ],

  },
};

module.exports = nextConfig;
