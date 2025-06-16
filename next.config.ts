/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "my-bucket.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
      },
    ],
  },
};

module.exports = nextConfig;
