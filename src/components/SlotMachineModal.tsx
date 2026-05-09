import confetti from 'canvas-confetti'
import { useEffect, useMemo, useRef, useState } from 'react'

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxa8K-xaqKtyH3BVZqftUzegKM-2YbHshsd6jspel_gkTIxVLOxJEUCwDdcWHpF3KDJ/exec'

const SYMBOLS = ['🐱', '🐟', '🎀', '🍖', '⭐', '🐭'] as const
type SymbolChar = (typeof SYMBOLS)[number]

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function fireWinConfetti(): void {
  const defaults = { origin: { y: 0.72 }, zIndex: 99999 }
  confetti({
    ...defaults,
    particleCount: 180,
    spread: 360,
    startVelocity: 35,
    ticks: 260,
    scalar: 1.05,
    colors: ['#E8607A', '#7BBFCC', '#F0C040', '#FFFFFF'],
  })
}

async function submitEmail(email: string): Promise<void> {
  // Apps Script expects JSON: { name, email } (see doPost + JSON.parse(e.postData.contents)).
  // Use text/plain + JSON string: application/json is not a "simple" type, so with
  // mode:no-cors the browser blocks / strips it; text/plain works and Apps Script still
  // receives the body in e.postData.contents.
  const body = JSON.stringify({
    name: '',
    email: email.trim(),
  })
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body,
  })
}

export function SlotMachineModal({
  open,
  email,
  onClose,
}: {
  open: boolean
  email: string
  onClose: () => void
}) {
  const rm = useMemo(() => prefersReducedMotion(), [])
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'submitting' | 'success' | 'error'>('idle')
  const [reels, setReels] = useState<[SymbolChar, SymbolChar, SymbolChar]>(['🐭', '⭐', '🎀'])
  const [error, setError] = useState<string | null>(null)
  const [winText, setWinText] = useState<string>("You're on the list!")
  const closeEnabled = phase === 'success' || phase === 'error' || phase === 'idle'

  const intervals = useRef<number[]>([])
  const timeouts = useRef<number[]>([])
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      intervals.current.forEach((id) => window.clearInterval(id))
      timeouts.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setPhase('idle')
      setError(null)
      setReels(['🐭', '⭐', '🎀'])
      return
    }

    const cleaned = email.trim()
    if (!isValidEmail(cleaned)) {
      setPhase('error')
      setError('Please enter a valid email first.')
      return
    }

    setPhase('spinning')
    setError(null)

    const picks: SymbolChar[] = [...SYMBOLS]
    const tick = (reelIdx: 0 | 1 | 2) => {
      setReels((prev) => {
        const next: [SymbolChar, SymbolChar, SymbolChar] = [...prev] as any
        next[reelIdx] = picks[Math.floor(Math.random() * picks.length)]!
        return next
      })
    }

    const makeSpin = (reelIdx: 0 | 1 | 2, speed: number) => {
      const id = window.setInterval(() => tick(reelIdx), speed)
      intervals.current.push(id)
      return id
    }

    const speeds = rm ? [110, 120, 130] : [55, 62, 70]
    const ids = [
      makeSpin(0, speeds[0]),
      makeSpin(1, speeds[1]),
      makeSpin(2, speeds[2]),
    ]

    const stopAfter = rm ? [520, 780, 1040] : [980, 1340, 1700]

    ;([0, 1, 2] as const).forEach((i) => {
      const t = window.setTimeout(() => {
        window.clearInterval(ids[i])
        setReels((prev) => {
          const next: [SymbolChar, SymbolChar, SymbolChar] = [...prev] as any
          next[i] = '🐱'
          return next
        })
      }, stopAfter[i])
      timeouts.current.push(t)
    })

    const done = window.setTimeout(() => {
      setPhase('submitting')
      fireWinConfetti()
      void (async () => {
        try {
          await submitEmail(cleaned)
          if (!mounted.current) return
          setWinText("You're on the list!")
          setPhase('success')
        } catch (e) {
          if (!mounted.current) return
          setError(e instanceof Error ? e.message : 'Something went wrong')
          setPhase('error')
        }
      })()
    }, stopAfter[2] + (rm ? 160 : 260))
    timeouts.current.push(done)
  }, [open, email, rm])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && closeEnabled) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeEnabled, onClose])

  if (!open) return null

  return (
    <div className="slot-overlay" role="dialog" aria-modal="true" aria-label="Slot machine">
      <div className="slot-backdrop" onClick={() => closeEnabled && onClose()} aria-hidden />
      <div className="slot-modal">
        <div className="slot-modal-header">
          <div>
            <p className="slot-kicker">While you wait . . .</p>
            <h3 className="slot-title">Pulling the lever</h3>
          </div>
          <button type="button" className="slot-close" onClick={onClose} disabled={!closeEnabled}>
            ✕
          </button>
        </div>

        <div className="slot-reels" aria-label="Three reel slot display">
          {reels.map((s, i) => (
            <div key={i} className={`slot-window ${phase === 'spinning' ? 'slot-window-spinning' : ''}`}>
              <span className="slot-symbol">{s}</span>
            </div>
          ))}
        </div>

        <div className="slot-status" aria-live="polite">
          {phase === 'spinning' && <p className="muted">Spinning…</p>}
          {phase === 'submitting' && <p className="muted">You won. Saving your spot…</p>}
          {phase === 'success' && <p className="slot-success">{winText}</p>}
          {phase === 'error' && <p className="form-error">{error}</p>}
        </div>

        <div className="slot-actions">
          {(phase === 'success' || phase === 'error') && (
            <button type="button" className="btn-primary" onClick={onClose}>
              Done
            </button>
          )}
          {phase === 'idle' && (
            <button type="button" className="btn-primary" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

