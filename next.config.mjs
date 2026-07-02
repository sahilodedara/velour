/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // All product imagery is generated originally (SVG/CSS), so no remote image hosts are needed.
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
