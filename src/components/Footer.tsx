const IG = 'https://www.instagram.com/circuit.cindy/'
const TT = 'https://www.tiktok.com/@circuitcindy'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <a
          className="footer-home"
          href="https://circuitcindy.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          circuitcindy.com
        </a>
        <div className="footer-socials">
          <a href={IG} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={TT} target="_blank" rel="noopener noreferrer">
            TikTok
          </a>
        </div>
        <div className="footer-meta">
          <p className="footer-copy">© CircuitCindy 2026</p>
          <p className="footer-credit muted">built with Cursor 🎀</p>
        </div>
      </div>
    </footer>
  )
}
