import withPWA from 'next-pwa';

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  }
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
})(nextConfig);
