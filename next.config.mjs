// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default nextConfig;


// ################ For Exporting Static Files #############################
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   output: "export",
//   images: {
//     unoptimized: true,
//   },
//   trailingSlash: true,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Allgemeine Regel für alle bekannten Seiten
      { source: '/:path*', destination: '/:path*' },

      // Regel für nicht gefundene Seiten (404)
      { source: '/404', destination: '/404.html' },

      // Standardregel für alle anderen Anfragen zur Homepage
      { source: '/:path*', destination: '/index.html' },
    ];
  },
};

export default nextConfig;