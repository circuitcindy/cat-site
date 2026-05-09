import { useEffect, useRef, useState } from 'react'

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Fine pointer only: hides OS cursor for 🖱️ + lagging 🐱. Coarse/reduced-motion: unchanged. */
export function CustomPointer() {
  const [enabled, setEnabled] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const follower = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const pickEnabled = (): boolean => {
      if (typeof window === 'undefined') return false
      const coarse = window.matchMedia('(pointer: coarse)').matches
      const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return !coarse && !rm && window.matchMedia('(pointer: fine)').matches
    }

    setEnabled(pickEnabled())

    const mqCoarse = window.matchMedia('(pointer: coarse)')
    const mqFine = window.matchMedia('(pointer: fine)')
    const mqRm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (): void => setEnabled(pickEnabled())

    mqCoarse.addEventListener('change', onChange)
    mqFine.addEventListener('change', onChange)
    mqRm.addEventListener('change', onChange)

    return () => {
      mqCoarse.removeEventListener('change', onChange)
      mqFine.removeEventListener('change', onChange)
      mqRm.removeEventListener('change', onChange)
    }
  }, [])

  const cursorEl = useRef<HTMLDivElement>(null)
  const catEl = useRef<HTMLDivElement>(null)
  const raf = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: PointerEvent): void => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onDown = (e: PointerEvent): void => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown, true)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown, true)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove('cc-custom-pointer')
      return undefined
    }

    document.body.classList.add('cc-custom-pointer')
    follower.current.x = mouse.current.x
    follower.current.y = mouse.current.y

    const ease = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.18 : 0.05

    const tick = (): void => {
      follower.current.x = lerp(follower.current.x, mouse.current.x, ease)
      follower.current.y = lerp(follower.current.y, mouse.current.y, ease)

      const c = cursorEl.current
      const k = catEl.current
      if (c && k) {
        c.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`
        k.style.transform = `translate3d(${follower.current.x}px, ${follower.current.y}px, 0) translate(-42%, -55%) scale(1.15)`
      }

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf.current)
      document.body.classList.remove('cc-custom-pointer')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="cc-pointer-root">
      <div ref={cursorEl} className="cc-cursor-chip">
        <span style={{ pointerEvents: 'none' }}>🖱️</span>
      </div>
      <div ref={catEl} className="cc-cat-chip">
        <span style={{ pointerEvents: 'none' }}>🐱</span>
      </div>
    </div>
  )
}
