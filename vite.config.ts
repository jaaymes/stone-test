import { defineConfig, loadEnv } from 'vite'

import reactRefresh from '@vitejs/plugin-react-refresh'
import react from '@vitejs/plugin-react-swc'

const isDev = process.env.NODE_ENV !== 'production'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    plugins: [react(), reactRefresh()],
    server: {
      port: isDev ? undefined : Number(process.env.VITE_PORT),
    },
    build: {
      outDir: 'build',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.VITE_PORT': JSON.stringify(process.env.VITE_PORT),
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  })
}
