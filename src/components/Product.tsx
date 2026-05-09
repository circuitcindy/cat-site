import { useMemo, useState } from 'react'
import { publicImageCandidates } from '../lib/publicUrl'
import { ChainedPublicImage } from './ChainedPublicImage'

function svgDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
  return `data:image/svg+xml,${encoded}`
}

function productShots(): string[] {
  const base = (label: string, accent: string) =>
    svgDataUri(
      `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#FAF7FF"/>
            <stop offset="0.5" stop-color="#E9D5FF"/>
            <stop offset="1" stop-color="${accent}"/>
          </linearGradient>
        </defs>
        <rect width="960" height="720" rx="44" fill="url(#g)"/>
        <g font-family="DM Sans, system-ui" fill="#3B1F6B">
          <text x="64" y="110" font-size="22" opacity="0.7">photo</text>
          <text x="64" y="166" font-size="54" font-weight="700">${label}</text>
          <text x="64" y="214" font-size="24" opacity="0.7">replace with real shots</text>
        </g>
        <g transform="translate(86 280)" opacity="0.88">
          <rect x="0" y="0" width="500" height="310" rx="36" fill="#ffffff" opacity="0.75"/>
          <text x="40" y="110" font-size="60">🐱</text>
          <text x="120" y="110" font-size="60">🎀</text>
          <text x="200" y="110" font-size="60">⭐</text>
          <path d="M40 180h420" stroke="#7C3AED" stroke-width="10" stroke-linecap="round" opacity="0.4"/>
          <path d="M40 220h360" stroke="#7C3AED" stroke-width="10" stroke-linecap="round" opacity="0.22"/>
        </g>
      </svg>`,
    )

  return [base('Slot Machine', '#FDE68A'), base('Detail angle', '#F0A500'), base('In action', '#EAB308')]
}

const PRODUCT_COUNT = 3

export function Product() {
  const fallbacks = useMemo(() => productShots(), [])
  const [index, setIndex] = useState(0)
  const activeFallback = fallbacks[index]!

  return (
    <section className="section product-section" id="product" aria-labelledby="product-title">
      <div className="container">
        <p className="section-eyebrow">THE FIRST DROP</p>
        <h2 id="product-title" className="section-title-center">
          Meet the headliner
        </h2>

        <div className="product-feature">
          <div className="surface product-media">
            <div className="carousel">
              <button
                type="button"
                className="carousel-arrow carousel-arrow-left"
                aria-label="Previous photo"
                onClick={() => setIndex((i) => (i - 1 + PRODUCT_COUNT) % PRODUCT_COUNT)}
              >
                ‹
              </button>
              <ChainedPublicImage
                className="carousel-main"
                candidates={publicImageCandidates(`images/product-${index + 1}`)}
                fallback={activeFallback}
                alt="Slot Machine Cat Treat Dispenser"
                resetKey={index}
              />
              <button
                type="button"
                className="carousel-arrow carousel-arrow-right"
                aria-label="Next photo"
                onClick={() => setIndex((i) => (i + 1) % PRODUCT_COUNT)}
              >
                ›
              </button>
            </div>

            <div className="thumb-strip" role="tablist" aria-label="Photo thumbnails">
              {Array.from({ length: PRODUCT_COUNT }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`thumb ${i === index ? 'thumb-active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-pressed={i === index}
                >
                  <ChainedPublicImage
                    candidates={publicImageCandidates(`images/product-${i + 1}`)}
                    fallback={fallbacks[i]!}
                    alt=""
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="product-copy-col">
            <h3 className="product-name">Slot Machine Cat Treat Dispenser</h3>
            <p className="product-desc">
              Pull the lever, watch the reels spin. And your cat may or may not get a treat.
              A fun toy for humans and felines alike.
            </p>
            <ul className="product-bullets">
              <li>Designed by CircuitCindy</li>
              <li>Compatible with most dry treats</li>
            </ul>
            <div className="product-cta-row">
              <button type="button" className="btn-soon" disabled aria-disabled="true">
                Coming Soon
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  window.location.hash = '#/'
                  window.setTimeout(() => {
                    const emailInput = document.getElementById('notify-email') as HTMLInputElement | null
                    emailInput?.focus()
                    emailInput?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }, 80)
                }}
              >
                Notify me at launch
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
