import { defineConfig, loadEnv } from 'vite'

import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react-swc'

const isDev = process.env.NODE_ENV !== 'production'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
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
}
