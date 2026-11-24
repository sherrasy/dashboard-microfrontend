/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CATALOG_REMOTE_URL?: string;
  readonly VITE_CART_REMOTE_URL?: string;
  readonly VITE_CATALOG_REMOTE_FALLBACK_URL?: string;
  readonly VITE_CART_REMOTE_FALLBACK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
