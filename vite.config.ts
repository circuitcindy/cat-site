import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Project Pages needs `base: /<repo>/`. For local dev, use `/` so the app loads
// at http://localhost:5173/ (not /cat-site/). Production `npm run build` still uses the repo base.
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const productionBase =
    env.VITE_SITE_BASE && env.VITE_SITE_BASE.length > 0
      ? env.VITE_SITE_BASE.endsWith('/')
        ? env.VITE_SITE_BASE
        : `${env.VITE_SITE_BASE}/`
      : '/circuitcindy-studios/'

  return {
    base: command === 'serve' ? '/' : productionBase,
    plugins: [react()],
  }
})
