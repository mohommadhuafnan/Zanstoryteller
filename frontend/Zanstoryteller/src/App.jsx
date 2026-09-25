import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import FeaturedStories from './components/FeaturedStories'
import StoryScrollSection from './components/StoryScrollSection'
import ProcessSection from './components/ProcessSection'
import VisualStatement from './components/VisualStatement'
import TestimonialsSection from './components/TestimonialsSection'
import SocialGallery from './components/SocialGallery'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import { preloadFrames } from './utils/frameLoader'

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cachedImages, setCachedImages] = useState([])

  // Preload all 40 high-resolution photography frames before activating animation
  useEffect(() => {
    let isMounted = true

    preloadFrames((progress) => {
      if (isMounted) {
        setLoadProgress(progress)
      }
    }).then((loadedImages) => {
      if (isMounted) {
        setCachedImages(loadedImages)
        // Brief graceful buffer at 100% so user perceives completion
        setTimeout(() => {
          if (isMounted) {
            setIsLoaded(true)
          }
        }, 400)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-[#020202] text-white selection:bg-[#111111] selection:text-white">
      {/* Subtle cinematic film grain texture */}
      <div className="film-grain" aria-hidden="true" />

      {/* Elegant minimalist loader */}
      <LoadingScreen progress={loadProgress} isLoaded={isLoaded} />

      {/* Header Navigation */}
      <Navbar />

      {/* Main Flow */}
      <main className="w-full">
        {/* 01. Hero Scrollytelling Section */}
        <HeroSection
          images={cachedImages}
          isLoaded={isLoaded}
        />

        {/* 02. About Zanstoryteller (White Editorial Background) */}
        <AboutSection />

        {/* 03. What We Capture / Photography Services */}
        <ServicesSection />

        {/* 04. Featured Stories / Asymmetric Portfolio Grid */}
        <FeaturedStories />

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

        {/* 10. Final Call to Action */}
        <FinalCTA />
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  )
}
