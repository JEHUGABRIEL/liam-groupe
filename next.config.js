/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon.png",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
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
              // Scripts : Next.js utilise des scripts en ligne (inlining) et dev eval
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Styles : Next.js injecte du CSS en ligne + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Polices : Google Fonts fichiers
              "font-src 'self' https://fonts.gstatic.com",
              // Images : Cloudinary + données utilisateur (avatar, blob)
              "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co",
              // Connexions API : Supabase (REST + Realtime WebSocket) + Cloudinary upload
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.cloudinary.com",
              // Cadres : interdire le clickjacking
              "frame-ancestors 'none'",
              // Formulaires : uniquement vers nous-mêmes
              "form-action 'self'",
              // Base URI : restreinte
              "base-uri 'self'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "interest-cohort=()",
            ].join(", "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
