/** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = nextConfig


const nextConfig = {
    images: {
      domains: ['localhost'], // Add your localhost hostname here
    },
    server: {
      port: 3000, // or your preferred port
    },
  }
  
  module.exports = nextConfig