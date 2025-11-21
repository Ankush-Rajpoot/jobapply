/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HASURA_ENDPOINT: string
  readonly VITE_HASURA_SECRET: string
  readonly VITE_CAMPAIGN_SERVICE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
