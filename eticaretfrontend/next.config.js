/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SERVICE_ID: process.env.NEXT_PUBLIC_SERVICE_ID,
    TEMPLATE_ID: process.env.NEXT_PUBLIC_TEMPLATE_ID,
    PUBLIC_KEY: process.env.NEXT_PUBLIC_PUBLIC_KEY,
  },
}

module.exports = nextConfig
