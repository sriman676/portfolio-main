/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allows safe LAN cross-origin resource sharing to the dev server
    allowedDevOrigins: ['192.168.164.1', 'localhost', '127.0.0.1']
};

export default nextConfig;
