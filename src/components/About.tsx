import { useState } from 'react'
import { publicImageCandidates } from '../lib/publicUrl'

const ABOUT_CANDIDATES = publicImageCandidates('images/about')

export function About() {
  const [attempt, setAttempt] = useState(0)
  const showPhoto = attempt < ABOUT_CANDIDATES.length

  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="about-grid">
          <figure className="about-tilt-card about-tilt-card-static" aria-label="Circuit Cindy">
            <div className="about-tilt-inner">
              {showPhoto ? (
                <img
                  className="about-photo"
                  src={ABOUT_CANDIDATES[attempt]!}
                  alt="Cindy"
                  loading="lazy"
                  decoding="async"
                  onError={() => setAttempt((a) => a + 1)}
                />
              ) : (
                <div className="about-monogram" aria-hidden>
                  CC
                </div>
              )}
            </div>
          </figure>

          <div className="about-copy">
            <p className="section-eyebrow">ABOUT THE MAKER</p>
            <h2 id="about-title">Hi, I&apos;m Cindy</h2>
            <p>
              I&apos;m a chemical engineer by degree, self-taught maker, and content creator.
              For every product I made, I CAD, code, assemble electronics, and film the whole process on social media.
              I&apos;m so excited to share my creations with you and hope you enjoy them as much as I do.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
