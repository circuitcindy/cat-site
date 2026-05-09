import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { useEffect, useMemo, useState } from 'react'
import { SlotMachineModal } from './components/SlotMachineModal'
import { HomePage } from './pages/HomePage'

export default function App() {
  const [slotOpen, setSlotOpen] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string>('')

  useEffect(() => {
    const raw = (window.location.hash || '').replace(/^#/, '')
    const path = raw.startsWith('/') ? raw : '/'
    if (path === '/product') {
      window.location.hash = '#/'
      window.setTimeout(() => {
        document.getElementById('product')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 0)
    }
  }, [])

  const page = useMemo(() => {
    const openSlot = (email: string): void => {
      setPendingEmail(email)
      setSlotOpen(true)
    }
    return <HomePage onNotify={openSlot} />
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="page-main">
        {page}
      </main>
      <Footer />
      <SlotMachineModal
        open={slotOpen}
        email={pendingEmail}
        onClose={() => setSlotOpen(false)}
      />
    </>
  )
}
