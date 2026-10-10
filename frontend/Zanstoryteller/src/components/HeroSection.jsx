import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'

import { HERO_SLIDES } from '../data/heroSlidesData'
import { useCMS } from '../context/CMSContext'
import { getOptimizedImageUrl, getCloudinarySrcSet } from '../utils/imageOptimizer'

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
        {/* Full-bleed edge-to-edge high resolution photograph */}
        <motion.img
          src={getOptimizedImageUrl(slide.image, { width: 2200 })}
          srcSet={getCloudinarySrcSet(slide.image, [800, 1200, 1600, 2200])}
          sizes="100vw"
          alt={slide.title}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full object-cover object-center transform-gpu will-change-transform"
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

  // Responsive physics spring that tracks scrolling instantly without drag or lag
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  })

  // Progress bar active pill indicator
  const indicatorLeft = useTransform(
    smoothProgress,
    [0, 1],
    ['0%', `${Math.max(0, (totalSlides - 1) / totalSlides) * 100}%`]
  )

  // Track viewport width for seamless horizontal translation on every screen size
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobileScreen = windowWidth < 768
  const mobileMaxTranslate = -Math.max(0, totalSlides * 178 - windowWidth + 28)

  // Dynamic horizontal translation for the bottom timeline cards (animates smoothly with scroll)
  const cardsTrackX = useTransform(
    smoothProgress,
    [0, 1],
    [isMobileScreen ? 14 : 24, isMobileScreen ? mobileMaxTranslate : -24]
  )

  // Update active slide index and end state based on scroll (only re-render when index changes)
  useEffect(() => {
    return scrollYProgress.on('change', (p) => {
      const idx = Math.min(
        totalSlides - 1,
        Math.max(0, Math.round(p * (totalSlides - 1)))
      )
      setActiveIdx((prev) => (prev !== idx ? idx : prev))
      setIsAtEnd((prev) => {
        const atEnd = p >= 0.94
        return prev !== atEnd ? atEnd : prev
      })
    })
  }, [scrollYProgress, totalSlides])

  // Preload high-res slides into browser memory
  useEffect(() => {
    currentSlides.forEach((slide) => {
      if (slide?.image) {
        const img = new Image()
        img.src = getOptimizedImageUrl(slide.image, { width: 1600 })
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

        {/* Bottom Horizontal Interactive Timeline & Project Selector (Scrolls horizontally across all screens) */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-4 sm:pb-7 pt-2 px-3 sm:px-8 md:px-12 flex flex-col items-center pointer-events-auto select-none">
          
          {/* Responsive Horizontal Cards Track with Scroll-Driven Motion */}
          <div className="w-full max-w-6xl overflow-hidden py-1 sm:py-2 relative [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] sm:[mask-image:none]">
            <motion.div
              style={{ x: cardsTrackX }}
              className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 md:gap-4 w-max sm:w-full mx-auto will-change-transform"
            >
              {currentSlides.map((slide, idx) => {
                const isActive = idx === safeIdx
                return (
                  <button
                    key={slide.id || idx}
                    onClick={() => scrollToSlide(idx)}
                    className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-md text-left transition-all duration-300 cursor-pointer focus:outline-none flex-shrink-0 w-[170px] sm:w-auto sm:flex-1 sm:max-w-[220px] ${
                      isActive
                        ? 'border border-[#D8BB7B]/50 bg-white/12 backdrop-blur-md shadow-[0_4px_20px_rgba(216,187,123,0.25)] scale-[1.02]'
                        : 'border border-white/10 bg-black/40 hover:bg-white/10 hover:border-white/20 opacity-50 hover:opacity-90'
                    }`}
                  >
                    {/* Active sliding gold highlight pill */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSlideHighlight"
                        className="absolute inset-0 rounded-md border border-[#D8BB7B]/60 bg-gradient-to-r from-[#D8BB7B]/15 via-white/10 to-transparent pointer-events-none"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-2">
                      <span className={`text-[10px] font-mono tracking-wider transition-colors ${isActive ? 'text-[#D8BB7B] font-semibold' : 'text-white/60'}`}>
                        0{idx + 1}
                      </span>
                      <span className={`text-xs md:text-sm truncate font-normal tracking-tight transition-colors ${isActive ? 'text-white font-medium' : 'text-white/80'}`}>
                        {slide.title}
                      </span>
                    </div>
                    <div className={`relative z-10 text-[9px] font-mono uppercase tracking-widest truncate mt-0.5 transition-colors ${isActive ? 'text-[#FFF5D6]/80' : 'text-white/45'}`}>
                      {slide.category}
                    </div>
                  </button>
                )
              })}
            </motion.div>
          </div>

          {/* Sleek Gold Progress Track with dynamic left-to-right indicator */}
          <div className="w-full max-w-4xl mt-1.5 sm:mt-2.5 flex items-center gap-3 sm:gap-4 px-2">
            <span className="text-[10px] font-mono text-[#D8BB7B] tracking-wider font-medium">
              0{safeIdx + 1}
            </span>

            <div className="relative flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden">
              {/* Background click zones for each slide */}
              <div
                className="absolute inset-0 grid gap-1.5 z-10"
                style={{ gridTemplateColumns: `repeat(${totalSlides}, minmax(0, 1fr))` }}
              >
                {currentSlides.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => scrollToSlide(i)}
                    className="h-full cursor-pointer hover:bg-white/20 transition-colors"
                  />
                ))}
              </div>

              {/* Active sliding progress pill (animates left-to-right on scroll down, right-to-left on scroll up) */}
              <motion.div
                style={{
                  left: indicatorLeft,
                  width: `${(1 / totalSlides) * 100}%`,
                }}
                className="absolute top-0 bottom-0 bg-gradient-to-r from-[#D8BB7B] via-[#FFF5D6] to-white rounded-full shadow-[0_0_8px_rgba(216,187,123,0.8)]"
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
