import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "レポジトリ名" : "./",
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    includeAssets: ['favicon.svg'],
    manifest: {
      name: 'Local Text Viewer',
      short_name: 'Txt View',
      description: 'View text files on your browser',
      theme_color: '#000000',
      background_color: '#000000',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })

],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})