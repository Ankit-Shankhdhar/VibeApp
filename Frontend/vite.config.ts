import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  // server: {
  //   proxy: {
  //     // Proxies standard API calls
  //     '/api': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     // Proxies WebSocket connections
  //     '/ws': {
  //       target: 'http://localhost:8080',
  //       ws: true,
  //       changeOrigin: true,
  //     },
  //   },
  // },
})