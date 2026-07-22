import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.png',
        'images/**/*.{jpg,jpeg,png,gif,webp}',
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/[^.]*$/],
        runtimeCaching: [
          {
            
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\/image\/upload\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-images',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 90, 
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            
            urlPattern: /^\/images\/.*\.(jpg|jpeg|png|gif|webp|avif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, 
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, 
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-data',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, 
              },
              networkTimeoutSeconds: 4,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'LIAM Groupe',
        short_name: 'LIAM Groupe',
        description: 'Structure pluridisciplinaire centrafricaine',
        theme_color: '#0B2A4A',
        background_color: '#0B2A4A',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
