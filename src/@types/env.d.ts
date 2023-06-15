/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: number
  readonly NODE_ENV: 'development' | 'production'
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
