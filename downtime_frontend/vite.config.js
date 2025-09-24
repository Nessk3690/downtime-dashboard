import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Adjust the target below if your backend is on a different host/port.
// We’ll run the frontend on :8090 to match your m3mra.com:8090.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8090,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://10.0.0.134:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
