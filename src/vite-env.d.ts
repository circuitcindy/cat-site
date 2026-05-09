/// <reference types="vite/client" />

declare module 'canvas-confetti' {
  type ConfettiOptions = Record<string, unknown>
  function confetti(options?: ConfettiOptions): Promise<null | undefined> | null
  export default confetti
}

interface ImportMetaEnv {
  readonly VITE_SITE_BASE?: string
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_DATABASE_URL?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
