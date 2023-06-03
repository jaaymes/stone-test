import { defineConfig } from 'vite'

import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react-swc'

const isDev = process.env.NODE_ENV !== 'production'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactRefresh()],
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
