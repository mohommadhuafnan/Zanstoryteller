import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronRight, ChevronLeft, X, Maximize2, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { servicesData as defaultServicesData } from '../data/photographyData'
import { useCMS } from '../context/CMSContext'

gsap.registerPlugin(ScrollTrigger)

export default function ServicesSection({ onNavigate }) {
  const { data } = useCMS()
  const servicesData = data?.servicesData || defaultServicesData
  const [selectedService, setSelectedService] = useState(null)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    )
  })
  const sectionRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      )
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleInquire = (serviceTitle) => {
    if (onNavigate) {
      onNavigate('/book-session')
    } else {
      const contactEl = document.querySelector('#contact')
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = '/book-session'
      }
    }
  }

  const handleViewGallery = (serviceId) => {
    const slugMap = {
      weddings: 'wedding',
      portraits: 'model-shoot',
      events: 'night-life',
      commercial: 'dhl',
    }
    const target = slugMap[serviceId] ? `/gallery/${slugMap[serviceId]}` : '/album'
    if (onNavigate) {
      onNavigate(target)
    } else {
      window.location.href = target
    }
  }

  const handleNextLightbox = () => {
    if (!selectedService) return
    const curIdx = servicesData.findIndex((s) => s.id === selectedService.id)
    const nextIdx = (curIdx + 1) % servicesData.length
    setSelectedService(servicesData[nextIdx])
  }

  const handlePrevLightbox = () => {
    if (!selectedService) return
    const curIdx = servicesData.findIndex((s) => s.id === selectedService.id)
    const prevIdx = (curIdx - 1 + servicesData.length) % servicesData.length
    setSelectedService(servicesData[prevIdx])
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (!selectedService) return
      if (e.key === 'Escape') setSelectedService(null)
      if (e.key === 'ArrowRight') handleNextLightbox()
      if (e.key === 'ArrowLeft') handlePrevLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedService])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-[#FFFFFF] text-[#111111] py-16 sm:py-20 md:py-24 px-5 sm:px-10 md:px-14 lg:px-18 border-t border-[#EAEAEA] overflow-hidden"
    >
      {/* Ambient delicate champagne glow accent */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(216,187,123,0.08),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header with Refined Editorial Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-14 pb-6 border-b border-[#EAEAEA]"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#D8BB7B] animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.3em] text-[#666666] uppercase">
                Services & Disciplines // 03
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-[1.05]">
              What We Capture <br />
              <span className="font-serif italic font-normal text-[#D8BB7B] lowercase tracking-normal">
                timeless narratives.
              </span>
            </h2>
          </div>

          <div className="mt-4 lg:mt-0 flex flex-col items-start lg:items-end gap-2.5 max-w-md">
            <p className="text-sm sm:text-base text-[#666666] font-light lg:text-right leading-relaxed">
              Four specialized disciplines shaped by authentic emotion, poetic light, and unscripted storytelling.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#888888] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
              <span>Scroll to witness kinetic cascade</span>
            </div>
          </div>
        </motion.div>

        {/* 
          SPACIOUS 2x2 ASYMMETRIC EDITORIAL GRID:
          - Reduced excessive vertical padding and gaps for a comfortable, balanced fit
          - Pure, unhindered photography with ZERO text overlay on photos
          - Signature mfrports scroll entrance physics (GSAP ScrollTrigger scrub)
          - Clean, elegant typography with poetic quote and actions underneath
          - Click card to open full-screen lightbox inspection
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {servicesData.map((service, index) => {
            const isOffsetColumn = index % 2 === 1 // Subtle offset for column 2
            return (
              <div
                key={service.id}
                className={isOffsetColumn ? 'md:pt-4 lg:pt-6' : ''}
              >
                <ServiceAlbumCard
                  service={service}
                  index={index}
                  totalCards={servicesData.length}
                  isMobile={isMobile}
                  onSelect={setSelectedService}
                  onInquire={handleInquire}
                  onViewGallery={handleViewGallery}
                />
              </div>
            )
          })}
        </div>

      </div>

      {/* Full-Screen Lightbox Modal (Matching Album Page) */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] bg-[#070e17]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedService(null)}
          >
            {/* Top Close & Meta Bar */}
            <div
              className="absolute top-6 left-6 right-6 flex items-center justify-between text-white/80 z-20 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D8BB7B]">
                  DISCIPLINE {selectedService.number} // {selectedService.title}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs font-mono text-white/60">ZAN ARCHIVE</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                aria-label="Close Preview"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D8BB7B] hover:text-black border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Previous Image Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevLightbox()
              }}
              aria-label="Previous Frame"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0d1b2a]/80 hover:bg-[#D8BB7B] hover:text-black border border-white/15 flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Image Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNextLightbox()
              }}
              aria-label="Next Frame"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0d1b2a]/80 hover:bg-[#D8BB7B] hover:text-black border border-white/15 flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Card */}
            <motion.div
              key={selectedService.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.85)] border border-white/12 bg-[#0d1b2a]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="max-w-full max-h-[65vh] object-contain block mx-auto"
              />

              <div className="p-5 sm:p-6 bg-[#091420] flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D8BB7B] block">
                    DISCIPLINE {selectedService.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-light text-white tracking-wide uppercase">
                    {selectedService.title}
                  </h3>
                  <p className="text-xs font-serif italic text-white/70 mt-0.5">
                    "{selectedService.tagline}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(null)
                      handleViewGallery(selectedService.id)
                    }}
                    className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer border border-white/15"
                  >
                    View Stories
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(null)
                      handleInquire(selectedService.title)
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#D8BB7B] text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors cursor-pointer shadow-lg shadow-[#D8BB7B]/20"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/**
 * ServiceAlbumCard Component
 * Replicates the Album page physical geometry and GSAP ScrollTrigger scrub physics:
 * 1. Image starts tilted and translated along X and Y
 * 2. Scrubbed smoothly to 0 with scroll progress
 * 3. Pure unhindered photography with ZERO dark text overlay covering it
 * 4. Spacious, clean typography cleanly underneath the card without visual clutter
 */
function ServiceAlbumCard({
  service,
  index,
  totalCards,
  isMobile,
  onSelect,
  onInquire,
  onViewGallery,
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(
    service.aspectRatio || (index === 1 ? 1.05 : 0.72)
  )
  const containerRef = useRef(null)
  const cardFloatingRef = useRef(null)

  // Signature mfrports scroll-driven entrance physics via GSAP ScrollTrigger
  // Calibrated for both desktop (dynamic multi-column float) and mobile (fluid single-column tilt & glide)
  useEffect(() => {
    if (!cardFloatingRef.current) return

    const el = cardFloatingRef.current
    const isLeftColumn = index % 2 === 0
    const rotDir = isLeftColumn ? 1 : -1
    const xDir = isLeftColumn ? -1 : 1

    // Proportional physical offsets: subtle & organic on mobile, expressive on desktop
    const rotAmount = (isMobile ? 1.4 : 2.8) * rotDir
    const xAmount = (isMobile ? 10 : 45) * xDir
    const yAmount = isMobile ? 40 : 70
    const scaleAmount = isMobile ? 0.96 : 0.98

    const tween = gsap.fromTo(
      el,
      {
        rotation: rotAmount,
        x: xAmount,
        y: yAmount,
        scale: scaleAmount,
      },
      {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current || el,
          start: isMobile ? 'top bottom-=20px' : 'top bottom-=30px',
          end: isMobile ? 'top center+=50px' : 'top center+=60px',
          scrub: isMobile ? 0.8 : 1.2,
          invalidateOnRefresh: true,
        },
      }
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [isMobile, index, totalCards, aspectRatio])

  return (
    <div ref={containerRef} className="flex flex-col group relative">
      
      {/* 1. Large Pure Photography Card Slot */}
      <div
        className="relative rounded-2xl cursor-pointer"
        style={{ paddingBottom: `${aspectRatio * 100}%` }}
        onClick={() => onSelect(service)}
      >
        {/* Shimmer skeleton while loading */}
        {!isLoaded && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#EAEBED] via-[#F5F6F7] to-[#EAEBED] animate-pulse pointer-events-none" />
        )}

        {/* Floating Card Element with GSAP Scroll physics: holds the photo, pill, and expand icon as one unified physical piece */}
        <div
          ref={cardFloatingRef}
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.12)] border border-black/[0.08] hover:border-[#D8BB7B]/60 will-change-transform z-10 bg-[#F3F4F6]"
        >
          <img
            src={service.image}
            alt={service.alt || service.title}
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              setIsLoaded(true)
              if (e.target.naturalWidth && e.target.naturalHeight) {
                const rawRatio = e.target.naturalHeight / e.target.naturalWidth
                const boundedRatio = Math.min(Math.max(rawRatio, 0.70), 1.1)
                setAspectRatio(boundedRatio)
              }
              ScrollTrigger.refresh()
            }}
            className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
          />

          {/* Minimalist Floating Top Pill */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#D8BB7B] text-[10px] font-mono tracking-widest uppercase shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8BB7B]" />
              <span>DISCIPLINE {service.number} // 04</span>
            </div>
          </div>

          {/* Expand Icon Button (Bottom Right) */}
          <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#D8BB7B] shadow-lg">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Spacious Editorial Information (Cleanly Situated Below the Photo with Breathing Room) */}
      <div className="pt-4 pb-1 flex flex-col z-0">
        <div className="flex items-baseline justify-between mb-0.5">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-light uppercase tracking-tight text-[#111111]">
            {service.title}
          </h3>
          <span className="text-xs font-mono text-[#888888] tracking-widest uppercase">
            {service.number} // 04
          </span>
        </div>

        <p className="text-sm sm:text-base font-serif italic text-[#9B7B30] mb-2 leading-snug">
          "{service.tagline}"
        </p>

        {/* Comfortable Action Link Row */}
        <div className="pt-2.5 flex flex-wrap items-center gap-3.5 border-t border-[#EAEAEA]">
          <button
            type="button"
            onClick={() => onInquire(service.title)}
            className="px-5 py-2 rounded-full bg-[#111111] hover:bg-[#D8BB7B] text-white hover:text-black text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Inquire Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onViewGallery(service.id)}
            className="text-xs font-mono uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors flex items-center gap-1 cursor-pointer group"
          >
            <span>Explore Stories</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>

    </div>
  )
}
