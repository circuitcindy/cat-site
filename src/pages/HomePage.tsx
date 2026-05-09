import { About } from '../components/About'
import { Hero } from '../components/Hero'
import { Product } from '../components/Product'

export function HomePage({ onNotify }: { onNotify: (email: string) => void }) {
  return (
    <>
      <Hero onNotify={onNotify} />
      <Product />
      <About />
    </>
  )
}

