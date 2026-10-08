import { useState, useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import ExperienceLoader from './components/ExperienceLoader'
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
import { CMSProvider } from './context/CMSContext'

// Lazily load separate routes and non-critical overlays to drastically reduce initial JS payload
const BookingPage = lazy(() => import('./components/booking/BookingPage'))
const MasterAlbumPage = lazy(() => import('./components/gallery/MasterAlbumPage'))
const ExitIntentPopup = lazy(() => import('./components/ExitIntentPopup'))
const AdminPortal = lazy(() => import('./components/admin/AdminPortal'))

function AppContent() {
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
  // ROUTE: Sovereign Admin Control Studio (/admin, /admin/login, /admin/dashboard)
  // -----------------------------------------------------------------
  if (currentPath.startsWith('/admin') || currentPath === '/admin220' || currentPath === '/admin224') {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center text-white font-mono text-xs tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 border-2 border-[#D8BB7B] border-t-transparent rounded-full animate-spin" />
            <span>Loading Zan Storyteller Admin Portal...</span>
          </div>
        </div>
      }>
        <AdminPortal onNavigateHome={() => navigate('/')} />
      </Suspense>
    )
  }

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
  // ROUTE: Unified Master Album & Portfolio (/album or /gallery)
  // Luxury dark navy aesthetic (#0d1b2a) matching loading screen and mfrports physics
  // -----------------------------------------------------------------
  if (currentPath.startsWith('/album') || currentPath.startsWith('/gallery')) {
    return (
      <div className="relative min-h-screen bg-[#0d1b2a] text-white selection:bg-[#D8BB7B] selection:text-black">
        <Navbar onNavigate={navigate} currentPath={currentPath} />
        <main className="w-full">
          <Suspense fallback={<div className="min-h-screen bg-[#0d1b2a]" />}>
            <MasterAlbumPage onNavigate={navigate} currentPath={currentPath} />
          </Suspense>
        </main>
        <Footer className="bg-[#091420] border-t border-white/[0.08]" />
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

      {/* Cinematic Experience Loader */}
      <ExperienceLoader />

      {/* Header Navigation */}
      <Navbar onNavigate={navigate} currentPath={currentPath} />

      {/* Main Flow */}
      <main className="w-full">
        {/* 01. Senawa Studio-Inspired Editorial Hero Section */}
        <HeroSection />

        {/* 02. About Zan Storyteller (White Editorial Background) */}
        <AboutSection />

        {/* 02.5. Editorial Moments Carousel (Smooth auto-loop & manual scrolling gallery) */}
        <EditorialCarousel />

        {/* 03. What We Capture / Photography Services */}
        <ServicesSection onNavigate={navigate} />

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

export default function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  )
}
