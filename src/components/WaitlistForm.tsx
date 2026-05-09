import { FormEvent, useState } from 'react'

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzys4A8PG0ohVs7NgM5zqNLQLqdZpAljASkRTDp2IiQ_tURz4U3wG8rF8QbdrD4enxz/exec'

export function WaitlistForm() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setMessage('')

    const body = new URLSearchParams()
    body.set('firstName', firstName.trim())
    body.set('email', email.trim())

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })

      const text = (await res.text()).trim()

      if (res.ok) {
        setStatus('success')
        setMessage("🎀 you're on the list! Kirby approves")
        setFirstName('')
        setEmail('')
        return
      }

      setStatus('error')
      setMessage(text || 'Something went wrong — try again in a moment.')
    } catch {
      setStatus('error')
      setMessage('Network hiccup — check your connection and try again.')
    }
  }

  return (
    <section className="section waitlist-section" id="waitlist" aria-labelledby="waitlist-title">
      <div className="container">
        <div className="surface waitlist-card">
          <h2 id="waitlist-title" className="waitlist-heading">
            join the waitlist
          </h2>

          {status === 'success' ? (
            <p className="waitlist-success" role="status" aria-live="polite">
              {message}
            </p>
          ) : (
            <form className="waitlist-form" onSubmit={(ev) => void onSubmit(ev)} noValidate>
              <label className="field">
                <span>First name</span>
                <input
                  name="firstName"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ada"
                  required
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  required
                />
              </label>
              <button className="btn-primary" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Notify me'}
              </button>
              {status === 'error' && (
                <p className="form-error" role="alert">
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
