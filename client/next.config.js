/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Try remotePatterns first (Next.js 13+)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
    // Fallback for older Next.js versions
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "via.placeholder.com",
      "picsum.photos",
    ],
  },
};

module.exports = nextConfig;
