/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["https://i.stack.imgur.com"]
  }
}

module.exports = nextConfig
