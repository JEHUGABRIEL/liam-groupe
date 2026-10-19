/** @type {import('next').NextConfig} */
const API_URL = process.env.API_URL || "http://localhost:8000";

const nextConfig = {
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/favicon.png" },
      // Photos envoyées (profil, candidatures) : servies par l'API, exposées sous le même domaine.
      { source: "/media/:path*", destination: `${API_URL}/media/:path*` },
    ];
  },
  async redirects() {
    // Anciennes URL bilingues et anciennes pages domaine.
    return [
      { source: "/:lang(fr|en)", destination: "/", permanent: true },
      { source: "/:lang(fr|en)/:path*", destination: "/:path*", permanent: true },
      { source: "/domaines/ogab", destination: "/ogab", permanent: true },
      { source: "/domaines/g-fitness", destination: "/g-fitness", permanent: true },
      { source: "/domaines/miss-centrafrique", destination: "/miss-centrafrique", permanent: true },
      { source: "/evenements", destination: "/actualites#agenda", permanent: true },
      { source: "/mon-profil", destination: "/mon-compte", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self'",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
              // Le navigateur ne parle qu'au serveur Next (BFF) : jamais directement à l'API.
              "connect-src 'self'",
              "frame-src https://www.google.com",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
