import { defineConfig } from 'vite'

import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react-swc'

const isDev = process.env.NODE_ENV !== 'production'
console.log('🚀 ~ file: vite.config.ts:7 ~ isDev:', isDev)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactRefresh()],
  server: {
    port: isDev ? undefined : 3000,
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
