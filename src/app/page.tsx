// src/app/page.tsx
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Partners from '@/components/Partners'
import Stats from '@/components/Stats'
import FinancialModel from '@/components/FinancialModel'
import Timeline from '@/components/Timeline'
import Transparency from '@/components/Transparency'
import Cases from '@/components/Cases'
import Reviews from '@/components/Reviews'
import Guarantees from '@/components/Guarantees'
import News from '@/components/News'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import LegalModals from '@/components/LegalModals'
import RegisterModal from '@/components/RegisterModal'
import LoginModal from '@/components/LoginModal'
import ReelsWidget from '@/components/ReelsWidget'
import CookieBanner from '@/components/CookieBanner'

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1220]">
      <Header />
      <Hero />
      <Partners />
      <Stats />
      <FinancialModel />
      <Timeline />
      <Transparency />
      <Cases />
      <Reviews />
      <Guarantees />
      <News />
      <ContactForm />
      <Footer />
      <ScrollToTop />
      <ReelsWidget />
      <LegalModals />
      <RegisterModal />
      <LoginModal />
      <CookieBanner />
    </main>
  )
}

// Тест автодеплоя - можно удалить// Финальный тест автодеплоя
