/** Resolve paths under `public/` for dev + GitHub Pages (`import.meta.env.BASE_URL`). */
export function publicUrl(path: string): string {
  const trimmed = path.replace(/^\/+/, '')
  let base = import.meta.env.BASE_URL ?? '/'
  if (!base.endsWith('/')) base = `${base}/`
  return `${base}${trimmed}`
}

/** Try these in order until one loads (e.g. `images/hero` → hero.jpg, hero.jpeg, …). */
export function publicImageCandidates(pathWithoutExtension: string): string[] {
  const stem = pathWithoutExtension.replace(/^\/+/, '').replace(/\.(jpg|jpeg|png|webp)$/i, '')
  return ['jpg', 'jpeg', 'png', 'webp'].map((ext) => publicUrl(`${stem}.${ext}`))
}
