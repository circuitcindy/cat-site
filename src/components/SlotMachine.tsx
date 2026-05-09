import confetti from 'canvas-confetti'
import { useCallback, useEffect, useRef, useState } from 'react'

const SYMBOLS = ['🐱', '🐟', '🎀', '🍖', '⭐', '🐭'] as const

type SymbolChar = (typeof SYMBOLS)[number]

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function randomPick(): SymbolChar {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!
}

function fireConfettiCelebration(): void {
  const count = 180
  const defaults = { origin: { y: 0.72 }, zIndex: 9999 }

  confetti({
    ...defaults,
    particleCount: count,
    spread: 360,
    startVelocity: 35,
    ticks: 260,
    scalar: 1.05,
    colors: ['#c8a8e9', '#c9a227', '#ffffff', '#4a2d6f', '#f3ecfa'],
  })

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 65,
      angle: 60,
      spread: 75,
      startVelocity: 55,
      origin: { x: 0, y: 0.65 },
      zIndex: 9999,
    })
    confetti({
      particleCount: 65,
      angle: 120,
      spread: 75,
      startVelocity: 55,
      origin: { x: 1, y: 0.65 },
      zIndex: 9999,
    })
  }, 280)
}

function SpinningReel({
  finalSymbol,
  spinning,
  reelIndex,
  reducedMotion,
}: {
  finalSymbol: SymbolChar
  spinning: boolean
  reelIndex: number
  reducedMotion: boolean
}) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!spinning) return
    const fast = reducedMotion ? 120 : 70
    const id = window.setInterval(() => setTick((t) => t + 1), fast + reelIndex * 12)
    return () => window.clearInterval(id)
  }, [spinning, reelIndex, reducedMotion])

  const displaySymbol = spinning ? SYMBOLS[tick % SYMBOLS.length]! : finalSymbol

  return (
    <div className={`slot-window ${spinning ? 'slot-window-spinning' : ''}`}>
      <span className="slot-symbol">{displaySymbol}</span>
    </div>
  )
}

export function SlotMachine() {
  const [reels, setReels] = useState<[SymbolChar, SymbolChar, SymbolChar]>([
    randomPick(),
    randomPick(),
    randomPick(),
  ])
  const [spinning, setSpinning] = useState(false)
  const rm = useRef(false)

  const spin = useCallback(async () => {
    if (spinning) return
    rm.current = prefersReducedMotion()
    setSpinning(true)

    const duration = rm.current ? 450 : 2200 + Math.random() * 400
    await new Promise((r) => setTimeout(r, duration))

    const next: [SymbolChar, SymbolChar, SymbolChar] = [randomPick(), randomPick(), randomPick()]
    setReels(next)
    setSpinning(false)

    const [a, b, c] = next
    if (a === b && b === c && !rm.current) {
      fireConfettiCelebration()
    } else if (a === b && b === c) {
      confetti({
        particleCount: 42,
        spread: 360,
        startVelocity: 18,
        origin: { y: 0.7 },
        scalar: 0.9,
        zIndex: 9999,
      })
    }
  }, [spinning])

  const winFlash = spinning
    ? false
    : reels[0] === reels[1] && reels[1] === reels[2]

  return (
    <section className="section slot-section" id="slots" aria-labelledby="slots-title">
      <div className="container">
        <div className={`surface slot-card ${winFlash ? 'slot-card-win' : ''}`}>
          <div className="slot-heading">
            <h2 id="slots-title">Slot Machine Mini Game</h2>
            <p className="slot-tease">Spin the reels — match three for a confetti jackpot.</p>
          </div>

          <div className={`slot-machine ${spinning ? 'slot-machine-busy' : ''}`} role="group" aria-label="Three reel slot display">
            <div className="slot-reels">
              {reels.map((symbol, i) => (
                <SpinningReel
                  key={i}
                  reelIndex={i}
                  finalSymbol={symbol}
                  spinning={spinning}
                  reducedMotion={spinning ? rm.current : prefersReducedMotion()}
                />
              ))}
            </div>
            <div className="slot-lever-wrap">
              <button
                type="button"
                className="btn-lever"
                onClick={() => void spin()}
                disabled={spinning}
              >
                {spinning ? 'Spinning…' : 'Pull the lever'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
