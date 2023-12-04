/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.edede.ca",
        port: "",
        pathname: "/",
      },
    ],
  },
};

module.exports = nextConfig;
