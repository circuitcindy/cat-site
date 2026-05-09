import { onValue, ref, runTransaction } from 'firebase/database'
import { useCallback, useEffect, useState } from 'react'
import { getDb, isFirebaseConfigured, KIRBY_PET_COUNT_PATH } from '../firebase'

const PHRASES = ['purrrr', '...fine', 'meow!', 'zzz', '🐾'] as const

function randomPhrase(): string {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)]!
}

export function PetTheCat() {
  const [total, setTotal] = useState<number | null>(null)
  const [status, setStatus] = useState<'loading' | 'live' | 'error' | 'unconfigured'>('loading')
  const [phrase, setPhrase] = useState<string>('Pet me 🐾')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setStatus('unconfigured')
      setTotal(null)
      return
    }

    const db = getDb()
    if (!db) {
      setStatus('unconfigured')
      return
    }

    const counterRef = ref(db, KIRBY_PET_COUNT_PATH)
    let cancelled = false
    setStatus('loading')

    const unsub = onValue(
      counterRef,
      (snap) => {
        if (!cancelled) {
          const n = typeof snap.val() === 'number' ? snap.val() : Number(snap.val() ?? 0)
          setTotal(Number.isFinite(n) ? n : 0)
          setStatus('live')
          setLocalError(null)
        }
      },
      () => {
        if (!cancelled) {
          setStatus('error')
          setLocalError('Could not reach the realtime counter (check rules / connection).')
        }
      },
    )

    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  const pet = useCallback(async () => {
    setPhrase(randomPhrase())
    setLocalError(null)

    if (!isFirebaseConfigured()) return

    const db = getDb()
    if (!db) return

    try {
      await runTransaction(ref(db, KIRBY_PET_COUNT_PATH), (current) => {
        const cur = typeof current === 'number' ? current : Number(current ?? 0)
        const base = Number.isFinite(cur) ? cur : 0
        return base + 1
      })
    } catch {
      setLocalError('Pet counted locally in spirit — firebase hiccup. Try again?')
    }
  }, [])

  const subtitle =
    status === 'unconfigured' ? (
      <p className="pet-sub muted">
        Add Firebase env vars (.env.example) for the{' '}
        <strong className="pet-strong">worldwide</strong> pet tally.
      </p>
    ) : status === 'loading' ? (
      <p className="pet-sub muted">Connecting to the Kirby cloud…</p>
    ) : status === 'error' ? (
      <p className="pet-sub pet-sub-warn">{localError}</p>
    ) : typeof total === 'number' ? (
      <p className="pet-sub">
        Kirby has been pet <strong className="pet-strong">{total}</strong> times
      </p>
    ) : null

  return (
    <section className="section pet-section" id="pet-cat" aria-labelledby="pet-title">
      <div className="container">
        <div className="surface pet-card">
          <div className="pet-layout">
            <div className="pet-copy-block">
              <h2 id="pet-title">Pet the Cat</h2>
              {subtitle}
            </div>
            <button
              type="button"
              className="kirby-face"
              onClick={() => void pet()}
              aria-label={`Pet Kirby. ${phrase}`}
            >
              <span className="kirby-emoji" aria-hidden>
                🐱
              </span>
            </button>
            <p className="pet-quote" aria-live="polite">
              {phrase}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
