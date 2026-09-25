import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: true,
    port: 43122,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:43121',
        changeOrigin: true,
      },
    },
  },
})
