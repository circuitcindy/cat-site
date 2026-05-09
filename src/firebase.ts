import {
  type FirebaseOptions,
  getApps,
  initializeApp,
  type FirebaseApp,
} from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'

const firebaseEnv: Partial<FirebaseOptions> & { apiKey?: string } = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseEnv.apiKey &&
      firebaseEnv.databaseURL &&
      firebaseEnv.projectId &&
      firebaseEnv.appId,
  )
}

let app: FirebaseApp | undefined
let db: Database | undefined

function buildFirebaseOptions(): FirebaseOptions {
  const options: FirebaseOptions = {
    apiKey: firebaseEnv.apiKey as string,
    databaseURL: firebaseEnv.databaseURL,
    projectId: firebaseEnv.projectId as string,
    appId: firebaseEnv.appId as string,
  }

  if (firebaseEnv.authDomain) options.authDomain = firebaseEnv.authDomain
  if (firebaseEnv.storageBucket) options.storageBucket = firebaseEnv.storageBucket
  if (firebaseEnv.messagingSenderId) options.messagingSenderId = firebaseEnv.messagingSenderId

  return options
}

/** Realtime Database instance, or undefined if env is incomplete */
export function getDb(): Database | undefined {
  if (!isFirebaseConfigured()) return undefined
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(buildFirebaseOptions())
  }
  if (!db) {
    db = getDatabase(app)
  }
  return db
}

export const KIRBY_PET_COUNT_PATH = 'kirbyPetCount/total'
