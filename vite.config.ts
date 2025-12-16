import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/nextoddlers/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'NexToddlers',
        short_name: 'NexToddlers',
        description: 'Fun English learning for young children',
        theme_color: '#FFFDF5',
        icons: [
          {
            src: 'https://picsum.photos/192/192', // Placeholder for pwa-192x192.png
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://picsum.photos/512/512', // Placeholder for pwa-512x512.png
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
});