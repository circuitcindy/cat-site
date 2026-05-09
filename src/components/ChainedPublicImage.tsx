import { useEffect, useState } from 'react'

type Props = {
  /** URLs from `publicImageCandidates()` or any ordered list */
  candidates: string[]
  fallback: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  /** Reset when slide / slot changes (e.g. carousel index) */
  resetKey?: string | number
}

/**
 * Tries each candidate URL in order; uses `fallback` (e.g. SVG data URI) if none exist.
 */
export function ChainedPublicImage({
  candidates,
  fallback,
  alt,
  className,
  loading = 'lazy',
  resetKey,
}: Props) {
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setAttempt(0)
  }, [resetKey, candidates.join('|')])

  const src = attempt < candidates.length ? candidates[attempt]! : fallback

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() =>
        setAttempt((a) => {
          if (a < candidates.length) return a + 1
          return a
        })
      }
    />
  )
}
