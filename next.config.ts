import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hastindia-product-images.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/products/**',
      },
    ],
  },
}

export default config
