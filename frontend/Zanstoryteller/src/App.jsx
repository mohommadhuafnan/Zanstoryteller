import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import EditorialCarousel from './components/EditorialCarousel'
import ServicesSection from './components/ServicesSection'
import FeaturedStories from './components/FeaturedStories'
import StoryScrollSection from './components/StoryScrollSection'
import ProcessSection from './components/ProcessSection'
import VisualStatement from './components/VisualStatement'
import TestimonialsSection from './components/TestimonialsSection'
import SocialGallery from './components/SocialGallery'
import QASection from './components/QASection'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import FloatingMessageWidget from './components/FloatingMessageWidget'

// Lazily load separate routes and non-critical overlays to drastically reduce initial JS payload
const BookingPage = lazy(() => import('./components/booking/BookingPage'))
const CategoryGalleryPage = lazy(() => import('./components/gallery/CategoryGalleryPage'))
const ClientAlbumPage = lazy(() => import('./components/gallery/ClientAlbumPage'))
const ExitIntentPopup = lazy(() => import('./components/ExitIntentPopup'))

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // Listen to browser forward/backward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Programmatic navigation helper
  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    if (!path.includes('#')) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }

  // Handle smooth scroll when navigating to hash anchors
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash
      const timer = setTimeout(() => {
        const target = document.querySelector(hash)
        if (target) {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [currentPath])

  // -----------------------------------------------------------------
  // ROUTE: Dedicated Booking Page (/book-session)
  // -----------------------------------------------------------------
  if (currentPath === '/book-session') {
    return (
      <div className="relative min-h-screen bg-[#020202] text-white selection:bg-[#111111] selection:text-white">
        <div className="film-grain" aria-hidden="true" />
        <Navbar onNavigate={navigate} currentPath={currentPath} />
        <main className="w-full">
          <Suspense fallback={<div className="min-h-screen bg-[#020202]" />}>
            <BookingPage onNavigateHome={() => navigate('/')} />
          </Suspense>
        </main>
        <Footer />
        <FloatingMessageWidget />
        <Suspense fallback={null}>
          <ExitIntentPopup onNavigate={navigate} />
        </Suspense>
      </div>
    )
  }

  // -----------------------------------------------------------------
  // ROUTE: Gallery Categories & Client Albums (/gallery/...)
  // -----------------------------------------------------------------
  if (currentPath.startsWith('/gallery')) {
    const parts = currentPath.split('/').filter(Boolean)
    const categorySlug = parts[1] || 'wedding'
    const clientSlug = parts[2] || null

    return (
      <div className="relative min-h-screen bg-white text-[#111111] selection:bg-[#111111] selection:text-white">
        <Navbar onNavigate={navigate} currentPath={currentPath} />
        <main className="w-full">
          <Suspense fallback={<div className="min-h-screen bg-white" />}>
            {clientSlug ? (
              <ClientAlbumPage
                categorySlug={categorySlug}
                clientSlug={clientSlug}
                onNavigate={navigate}
              />
            ) : (
              <CategoryGalleryPage
                categorySlug={categorySlug}
                onNavigate={navigate}
              />
            )}
          </Suspense>
        </main>
        <Footer />
        <FloatingMessageWidget />
        <Suspense fallback={null}>
          <ExitIntentPopup onNavigate={navigate} />
        </Suspense>
      </div>
    )
  }

  // -----------------------------------------------------------------
  // ROUTE: Main Home Scrollytelling Experience (/)
  // -----------------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-[#020202] text-white selection:bg-[#111111] selection:text-white">
      {/* Subtle cinematic film grain texture */}
      <div className="film-grain" aria-hidden="true" />

      {/* Header Navigation */}
      <Navbar onNavigate={navigate} currentPath={currentPath} />

      {/* Main Flow */}
      <main className="w-full">
        {/* 01. Cinematic Hero Scrollytelling Section */}
        <HeroSection />

        {/* 02. About Zanstoryteller (White Editorial Background) */}
        <AboutSection />

        {/* 02.5. Editorial Moments Carousel (Smooth auto-loop & manual scrolling gallery) */}
        <EditorialCarousel />

        {/* 03. What We Capture / Photography Services */}
        <ServicesSection />

        {/* 04. Featured Stories / Asymmetric Portfolio Grid */}
        <FeaturedStories onNavigate={navigate} />

        {/* 05. The Story Behind The Frame / Second Scroll Story (Dark Sticky Section) */}
        <StoryScrollSection />

        {/* 06. Photography Experience / Process (From Moment to Memory) */}
        <ProcessSection />

        {/* 07 & 08. Sticky Visual Statement ("Your Moments" static) + Testimonials Curtain Scroll Over */}
        <div className="relative">
          {/* 07. Large Visual Statement (Full-width photo statement - static pinned) */}
          <VisualStatement />

          {/* 08. Testimonials / Client Words (Scrolls up over VisualStatement to the top) */}
          <TestimonialsSection />
        </div>

        {/* 09. Instagram / Social Proof Gallery */}
        <SocialGallery />

        {/* 09.5. Questions & Answers (FAQ) */}
        <QASection />

        {/* 10. Final Call to Action */}
        <FinalCTA />
      </main>

      {/* 11. Footer */}
      <Footer />

      {/* Floating Messaging Widget (WhatsApp & Messenger) */}
      <FloatingMessageWidget />

      {/* Premium Animated Exit-Intent Advertisement Popup */}
      <Suspense fallback={null}>
        <ExitIntentPopup onNavigate={navigate} />
      </Suspense>
    </div>
  )
}
