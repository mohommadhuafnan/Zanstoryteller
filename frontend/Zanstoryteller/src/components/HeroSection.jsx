import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'

import { HERO_SLIDES } from '../data/heroSlidesData'
import { useCMS } from '../context/CMSContext'
import { getOptimizedImageUrl } from '../utils/imageOptimizer'

// Individual Full-Bleed Slide with Dynamic Scroll-Driven Zoom
function ZoomSlide({ slide, index, smoothProgress, totalSlides }) {
  let opacity
  let scale

  if (totalSlides <= 1) {
    opacity = 1
    scale = useTransform(smoothProgress, [0, 1], [1.02, 1.15])
  } else if (index === 0) {
    const fadeEnd = (1 / totalSlides) * 1.2
    opacity = useTransform(smoothProgress, [0, fadeEnd * 0.7, fadeEnd], [1, 1, 0])
    scale = useTransform(smoothProgress, [0, fadeEnd * 0.7, fadeEnd], [1.02, 1.10, 1.18])
  } else if (index === totalSlides - 1) {
    const enterStart = ((totalSlides - 1) / totalSlides) - 0.08
    opacity = useTransform(smoothProgress, [Math.max(0, enterStart), 0.95, 1.0], [0, 1, 1])
    scale = useTransform(smoothProgress, [Math.max(0, enterStart), 0.95, 1.0], [1.22, 1.04, 1.10])
  } else {
    const enterStart = Math.max(0, (index / totalSlides) - 0.08)
    const enterPeak = (index / totalSlides) + 0.04
    const exitStart = Math.min(0.96, ((index + 1) / totalSlides) - 0.06)
    const exitEnd = Math.min(1.0, ((index + 1) / totalSlides) + 0.04)
    opacity = useTransform(smoothProgress, [enterStart, enterPeak, exitStart, exitEnd], [0, 1, 1, 0])
    scale = useTransform(smoothProgress, [enterStart, enterPeak, exitStart, exitEnd], [1.22, 1.04, 1.12, 1.18])
  }


  return (
    <motion.div
      style={{
        opacity,
        zIndex: 10 + index,
      }}
      className="absolute inset-0 w-full h-full overflow-hidden will-change-transform pointer-events-none"
    >
      {/* Outer motion wrapper drives the scroll zoom animation */}
      <motion.div
        style={{ scale }}
        className="relative w-full h-full will-change-transform transform-gpu"
      >
        {/* Inner subtle breathing ambient Ken Burns float */}
        <motion.img
          src={getOptimizedImageUrl(slide.image, { width: 1400 })}
          alt={slide.title}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full object-cover object-center filter brightness-[0.90] contrast-[1.05]"
        />
      </motion.div>

      {/* Top Gradient for Navbar legibility */}
      <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/85 via-black/45 to-transparent pointer-events-none z-10" />

      {/* Center Cinematic Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)] pointer-events-none z-10" />

      {/* Bottom Gradient for Controls legibility */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />
    </motion.div>
  )
}

export default function HeroSection() {
  const { data } = useCMS()
  const currentSlides = (data?.heroSlides && data.heroSlides.length > 0) ? data.heroSlides : HERO_SLIDES
  const containerRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const totalSlides = currentSlides.length

  // Track scroll progress across dynamic height pinned section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth physics spring for fluid zoom transitions without harsh snapping
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.0005,
  })

  // Progress bar active pill indicator
  const indicatorLeft = useTransform(
    smoothProgress,
    [0, 1],
    ['0%', `${Math.max(0, (totalSlides - 1) / totalSlides) * 100}%`]
  )

  // Update active slide index and end state based on scroll
  useEffect(() => {
    return scrollYProgress.on('change', (p) => {
      const idx = Math.min(
        totalSlides - 1,
        Math.max(0, Math.round(p * (totalSlides - 1)))
      )
      setActiveIdx(idx)
      setIsAtEnd(p >= 0.94)
    })
  }, [scrollYProgress, totalSlides])

  // Preload high-res slides into browser memory
  useEffect(() => {
    currentSlides.forEach((slide) => {
      if (slide?.image) {
        const img = new Image()
        img.src = slide.image
      }
    })
  }, [currentSlides])

  // Programmatic scroll helper to jump directly to any slide
  const scrollToSlide = (index) => {
    if (!containerRef.current) return
    const containerTop = containerRef.current.offsetTop
    const scrollDistance = containerRef.current.offsetHeight - window.innerHeight
    const targetY = containerTop + (index / Math.max(1, totalSlides - 1)) * scrollDistance
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  // Keyboard navigation support (Arrow keys cycle through slides)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const inView = rect.top <= 100 && rect.bottom >= window.innerHeight / 2
      if (!inView) return

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (activeIdx < totalSlides - 1) {
          e.preventDefault()
          scrollToSlide(activeIdx + 1)
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (activeIdx > 0) {
          e.preventDefault()
          scrollToSlide(activeIdx - 1)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIdx, totalSlides])

  const handlePrev = () => {
    if (activeIdx > 0) {
      scrollToSlide(activeIdx - 1)
    }
  }

  const handleNext = () => {
    if (activeIdx < totalSlides - 1) {
      scrollToSlide(activeIdx + 1)
    } else {
      const about = document.getElementById('about')
      if (about) about.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const safeIdx = Math.min(activeIdx, totalSlides - 1)
  const currentActiveSlide = currentSlides[safeIdx] || currentSlides[0]

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full bg-[#020202] text-white"
      style={{ height: `${Math.max(2, totalSlides) * 100}vh` }}
    >
      {/* Sticky Viewport Container: Pinned 100vh viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden select-none">
        
        {/* Stacked Full-Bleed Slides Container (Images come one by one with zooming animation) */}
        <div className="relative w-full h-full overflow-hidden">
          {currentSlides.map((slide, idx) => (
            <ZoomSlide
              key={slide.id || idx}
              slide={slide}
              index={idx}
              smoothProgress={smoothProgress}
              totalSlides={totalSlides}
            />
          ))}
        </div>

        {/* Prominent Editorial Overlay (Synchronized with active slide zoom) */}
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center px-6 sm:px-14 md:px-20 lg:px-28">
          <div className="max-w-3xl pt-12 sm:pt-8">
            <AnimatePresence mode="wait">
              {currentActiveSlide && (
                <motion.div
                  key={currentActiveSlide.id || safeIdx}
                  initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Category & Counter Badge */}
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-[#FFF5D6] text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8BB7B] animate-pulse" />
                    <span>0{safeIdx + 1} / 0{totalSlides}</span>
                    <span className="opacity-40">•</span>
                    <span>{currentActiveSlide.category}</span>
                  </div>

                  {/* Grand Editorial Headline */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white uppercase leading-[1.04] drop-shadow-[0_4px_28px_rgba(0,0,0,0.9)]">
                    {currentActiveSlide.title}
                  </h1>

                  {/* Poetic Subtitle & Narrative Quote */}
                  <p className="text-sm sm:text-base md:text-lg text-white/85 font-light leading-relaxed max-w-xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
                    {currentActiveSlide.tagline}
                  </p>

                  {/* Metadata Pill: Location & Year */}
                  <div className="flex items-center gap-3 text-[11px] font-mono tracking-widest text-[#D8BB7B] uppercase pt-1">
                    <span>{currentActiveSlide.location}</span>
                    <span className="opacity-40">•</span>
                    <span>{currentActiveSlide.year}</span>
                  </div>

                  {/* Interactive Action CTA */}
                  <div className="pointer-events-auto pt-2 sm:pt-4 flex items-center gap-3.5">
                    <a
                      href="#portfolio"
                      className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#D8BB7B] hover:bg-[#ebd59f] text-black font-mono text-[11px] uppercase tracking-[0.22em] font-medium rounded-sm transition-all duration-300 shadow-[0_4px_20px_rgba(216,187,123,0.35)] hover:scale-105 cursor-pointer"
                    >
                      <span>Explore Story</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    <button
                      onClick={() => scrollToSlide((activeIdx + 1) % totalSlides)}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-black/40 hover:bg-black/65 text-white/80 hover:text-white font-mono text-[11px] uppercase tracking-[0.18em] rounded-sm border border-white/20 transition-all duration-300 backdrop-blur-md cursor-pointer hover:border-white/40"
                    >
                      <span>Next Slide</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Scroll Hint */}
        <div className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 transition-all duration-300">
          {!isAtEnd ? (
            <div className="flex flex-col items-center gap-2 opacity-75">
              <div className="w-5 h-8 rounded-full border border-white/60 flex items-start justify-center p-1 shadow-sm">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1 h-2 bg-white rounded-full"
                />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/70">
                Scroll to Zoom & Explore
              </span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-1.5 opacity-90 text-[#FFF5D6]"
            >
              <ArrowDown className="w-4 h-4 animate-bounce" />
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#FFF5D6]">
                Scroll Down to Continue
              </span>
            </motion.div>
          )}
        </div>

        {/* Left & Right Clickable Navigation Chevrons */}
        <button
          onClick={handlePrev}
          disabled={activeIdx === 0}
          aria-label="Previous Slide"
          className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all transform hover:scale-105 shadow-xl ${
            activeIdx === 0 ? 'opacity-20 pointer-events-none' : 'opacity-85 hover:opacity-100 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label={activeIdx === totalSlides - 1 ? 'Scroll Down' : 'Next Slide'}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all transform hover:scale-105 cursor-pointer opacity-85 hover:opacity-100 shadow-xl"
        >
          {activeIdx === totalSlides - 1 ? (
            <ArrowDown className="w-5 h-5 text-[#FFF5D6]" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        {/* Bottom Horizontal Interactive Timeline & Project Selector */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-6 sm:pb-8 pt-3 px-4 sm:px-12 flex flex-col items-center">
          
          {/* Desktop & Tablet: Clean Project Selectors */}
          <div className="hidden sm:flex items-center justify-center gap-2 md:gap-4 max-w-6xl w-full py-2">
            {currentSlides.map((slide, idx) => {
              const isActive = idx === safeIdx
              return (
                <button
                  key={slide.id || idx}
                  onClick={() => scrollToSlide(idx)}
                  className={`group relative px-4 py-2 rounded-md text-left transition-all duration-300 cursor-pointer focus:outline-none flex-1 max-w-[220px] ${
                    isActive
                      ? 'bg-white/12 backdrop-blur-md border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
                      : 'hover:bg-white/5 opacity-45 hover:opacity-85 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono tracking-wider ${isActive ? 'text-[#D8BB7B]' : 'text-white/60'}`}>
                      0{idx + 1}
                    </span>
                    <span className={`text-xs md:text-sm truncate font-normal tracking-tight ${isActive ? 'text-white font-medium' : 'text-white/80'}`}>
                      {slide.title}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-white/50 truncate mt-0.5">
                    {slide.category}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Mobile: Compact Active Pill with Dots */}
          <div className="flex sm:hidden items-center justify-between w-full max-w-sm px-2 py-2">
            <span className="text-xs font-mono text-[#D8BB7B]">
              0{safeIdx + 1} / 0{totalSlides}
            </span>
            <span className="text-xs font-medium text-white truncate max-w-[180px]">
              {currentActiveSlide?.title}
            </span>
            <div className="flex items-center gap-1.5">
              {currentSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className="p-2 -m-2 flex items-center justify-center cursor-pointer"
                  aria-label={`Slide ${i + 1}`}
                >
                  <span
                    className={`h-1.5 rounded-full transition-all inline-block ${
                      i === safeIdx ? 'w-5 bg-[#D8BB7B]' : 'w-1.5 bg-white/50'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sleek Gold Progress Track */}
          <div className="w-full max-w-4xl mt-2 sm:mt-3 flex items-center gap-4">
            <span className="text-[10px] font-mono text-white/60 tracking-wider">
              0{activeIdx + 1}
            </span>

            <div className="relative flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden">
              {/* Background click zones for each slide */}
              <div className="absolute inset-0 grid grid-cols-5 gap-1.5 z-10">
                {HERO_SLIDES.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => scrollToSlide(i)}
                    className="h-full cursor-pointer hover:bg-white/10 transition-colors"
                  />
                ))}
              </div>

              {/* Active sliding progress pill */}
              <motion.div
                style={{
                  left: indicatorLeft,
                  width: `${(1 / totalSlides) * 100}%`,
                }}
                className="absolute top-0 bottom-0 bg-gradient-to-r from-[#D8BB7B] via-[#FFF5D6] to-white rounded-full shadow-[0_0_8px_rgba(216,187,123,0.7)]"
              />
            </div>

            <span className="text-[10px] font-mono text-white/60 tracking-wider">
              0{totalSlides}
            </span>
          </div>

        </div>

      </div>
    </section>
  )
}
