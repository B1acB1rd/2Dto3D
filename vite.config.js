import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Local development proxy
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/outputs': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  // Production build settings
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Environment variable for API URL
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'https://tremick-b1acb1rd-2d-to-3d.hf.space'
    )
  }
})
