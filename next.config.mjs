/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*"
      }
    ]
  }
};

export default nextConfig;
