interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID: string
  readonly VITE_ALCHEMY_KEY: string
  readonly VITE_DAO_CONTRACT: string
  readonly VITE_TOKEN_CONTRACT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}