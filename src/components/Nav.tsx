import { useEffect, useState } from 'react'

const IG = 'https://www.instagram.com/circuit.cindy/'
const TT = 'https://www.tiktok.com/@circuitcindy'

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 16.1a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M17.5 6.6h.01"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M14 3v10.6a3.6 3.6 0 1 1-3.3-3.58V7.3a6.3 6.3 0 1 0 6.3 6.3V8.4c1.26.9 2.78 1.43 4.4 1.47V6.9c-2.14-.2-4.03-1.55-4.9-3.9H14Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const goAbout = (): void => {
    setOpen(false)
    window.location.hash = '#/'
    window.setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const goShop = (): void => {
    setOpen(false)
    window.location.hash = '#/'
    window.setTimeout(() => {
      document.getElementById('product')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  return (
    <header className={`nav-header ${open ? 'nav-open' : ''}`}>
      <div className="container nav-inner">
        <a className="nav-wordmark" href="#/">
          CircuitCindy
        </a>
        <nav className="nav-center" aria-label="Primary">
          <button type="button" className="nav-link-btn" onClick={goShop}>
            Shop
          </button>
          <button
            type="button"
            className="nav-link-btn"
            onClick={goAbout}
          >
            About
          </button>
        </nav>
        <div className="nav-icons" aria-label="Social links">
          <a
            className="icon-link"
            href={IG}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CircuitCindy on Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            className="icon-link"
            href={TT}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CircuitCindy on TikTok"
          >
            <TikTokIcon />
          </a>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden className="nav-toggle-icon">
            {open ? '✕' : '☰'}
          </span>
        </button>
      </div>

      <div id="mobile-nav-drawer" className={`nav-drawer ${open ? 'nav-drawer-open' : ''}`}>
        <div className="container nav-drawer-inner" aria-label="Mobile navigation">
          <button type="button" className="nav-drawer-link nav-drawer-btn" onClick={goShop}>
            Shop
          </button>
          <button type="button" className="nav-drawer-link nav-drawer-btn" onClick={goAbout}>
            About
          </button>

          <div className="nav-drawer-socials" aria-label="Social links">
            <a
              className="icon-link"
              href={IG}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CircuitCindy on Instagram"
              onClick={() => setOpen(false)}
            >
              <InstagramIcon size={20} />
            </a>
            <a
              className="icon-link"
              href={TT}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CircuitCindy on TikTok"
              onClick={() => setOpen(false)}
            >
              <TikTokIcon size={20} />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
