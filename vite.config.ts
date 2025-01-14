import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  server: {
    proxy: {
      '/api': {
        target: 'https://json-server-heenough93.koyeb.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // "/api"를 제거
      },
    },
  },
})