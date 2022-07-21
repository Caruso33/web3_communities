/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "https://ipfs.dweb.link",
      "https://ipfs.io",
      "https://ipfs.infura.io/ipfs/",
    ],
  },
}

module.exports = nextConfig
