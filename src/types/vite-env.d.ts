interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID: string
  readonly VITE_ALCHEMY_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}