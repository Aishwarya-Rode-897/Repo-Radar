import Header from '@/components/ui/header'
import Hero from '@/components/ui/hero'
import Features from '@/components/ui/features'
import Pricing from '@/components/ui/pricing'
import Footer from '@/components/ui/footer'
import Demo from '@/components/ui/demo'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Demo />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}

