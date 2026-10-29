/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/patients', destination: '/dashboard/patients' },
      { source: '/calendar', destination: '/dashboard/calendar' },
      { source: '/records', destination: '/dashboard/records' },
      { source: '/odontogram', destination: '/dashboard/odontogram' },
      { source: '/billing', destination: '/dashboard/billing' },
      { source: '/services', destination: '/dashboard/services' },
      { source: '/insurance', destination: '/dashboard/insurance' },
      { source: '/users', destination: '/dashboard/users' },
      { source: '/reports', destination: '/dashboard/reports' },
      { source: '/settings', destination: '/dashboard/settings' },
      { source: '/audit', destination: '/dashboard/audit' },
    ];
  },
};

export default nextConfig;

