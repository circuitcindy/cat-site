import { useMemo, useRef, useState } from 'react'
import { publicImageCandidates } from '../lib/publicUrl'
import { ChainedPublicImage } from './ChainedPublicImage'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function svgDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
  return `data:image/svg+xml,${encoded}`
}

function productPlaceholder(): string {
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FAF7FF"/>
          <stop offset="0.55" stop-color="#E9D5FF"/>
          <stop offset="1" stop-color="#FDE68A"/>
        </linearGradient>
      </defs>
      <rect width="960" height="720" rx="36" fill="url(#g1)"/>
      <g opacity="0.22">
        <circle cx="170" cy="120" r="110" fill="#7C3AED"/>
        <circle cx="790" cy="560" r="150" fill="#F0A500"/>
      </g>
      <g font-family="DM Sans, system-ui" fill="#3B1F6B">
        <text x="64" y="98" font-size="20" opacity="0.7">product photo</text>
        <text x="64" y="140" font-size="42" font-weight="700">Slot Machine Cat Treat Dispenser</text>
        <text x="64" y="186" font-size="22" opacity="0.7">replace with your real photo when ready</text>
      </g>
      <g transform="translate(520 205)">
        <rect x="0" y="0" width="340" height="380" rx="34" fill="#FFFFFF" opacity="0.72"/>
        <path d="M70 115h200" stroke="#7C3AED" stroke-width="10" stroke-linecap="round" opacity="0.55"/>
        <path d="M70 155h240" stroke="#7C3AED" stroke-width="10" stroke-linecap="round" opacity="0.35"/>
        <path d="M70 195h180" stroke="#7C3AED" stroke-width="10" stroke-linecap="round" opacity="0.25"/>
        <text x="70" y="265" font-size="54">🐱🎀⭐</text>
      </g>
    </svg>`,
  )
}

export function Hero({ onNotify }: { onNotify: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const heroFallback = useMemo(() => productPlaceholder(), [])

  return (
    <section id="top" className="hero section" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-shell">
          <div className="hero-inner">
          <div className="hero-left">
            <p className="hero-eyebrow">NOW IN DEVELOPMENT</p>
            <h1 id="hero-title">
              Tiny machines.
              <br />
              Big dopamine.
            </h1>
            <p className="hero-script">Cute &amp; functional everyday things</p>
            <p className="hero-body">
              Designed and prototyped by CircuitCindy. Be the first to know when the doors open.
            </p>

            <div className="notify-row" role="form" aria-label="Email waitlist form">
              <label className="sr-only" htmlFor="notify-email">
                Email
              </label>
              <input
                ref={inputRef}
                id="notify-email"
                className={`notify-input ${error ? 'notify-input-error' : ''}`}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const cleaned = email.trim()
                    if (!isValidEmail(cleaned)) {
                      setError('Please enter a valid email.')
                      inputRef.current?.focus()
                      return
                    }
                    onNotify(cleaned)
                  }
                }}
              />
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const cleaned = email.trim()
                  if (!isValidEmail(cleaned)) {
                    setError('Please enter a valid email.')
                    inputRef.current?.focus()
                    return
                  }
                  onNotify(cleaned)
                }}
              >
                Notify me
              </button>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <div className="hero-right" aria-label="Product preview">
            <div className="tilt-card">
              <ChainedPublicImage
                className="tilt-img"
                candidates={publicImageCandidates('images/hero')}
                fallback={heroFallback}
                alt="Slot Machine Cat Treat Dispenser"
                loading="eager"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
