import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MASTER_ALBUM_IMAGES } from '../../data/masterAlbumData'

gsap.registerPlugin(ScrollTrigger)

// Smooth scroll entrance physics reverse-engineered from https://mfrports.com/portfolio/
const MFR_CONFIG = {
  columns: {
    breakpoints: { lg: 1024, md: 768 },
    counts: { lg: 3, md: 2, sm: 1 },
  },
  animation: {
    rotation: { min: 2.5, max: 5.5 },
    x: { min: 60, max: 150 },
    y: { min: 80, max: 220 },
    startOffset: { min: -120, max: 20 },
    transformDuration: 360,
    scrub: 1.2,
    centerMultiplier: 0.2,
  },
  lazyLoad: {
    rootMargin: '1200px 0px 1200px 0px', // Generous preloading buffer so images are cached before entering viewport
    threshold: 0,
  },
}

const getAspectRatio = (image) => {
  if (image.width && image.height) return image.height / image.width
  if (image.aspect === 'landscape') return 0.67
  if (image.aspect === 'square') return 1.0
  if (image.aspect === 'portrait') return 1.45
  return 0.85
}

const getColCount = () => {
  if (typeof window === 'undefined') return 3
  const w = window.innerWidth
  if (w >= MFR_CONFIG.columns.breakpoints.lg) return MFR_CONFIG.columns.counts.lg
  if (w >= MFR_CONFIG.columns.breakpoints.md) return MFR_CONFIG.columns.counts.md
  return MFR_CONFIG.columns.counts.sm
}

const checkIsMobile = () => {
  if (typeof window === 'undefined') return false
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent)
  )
}

const buildColumns = (items, colCount) => {
  const cols = Array.from({ length: colCount }, () => [])
  const colHeights = Array(colCount).fill(0)

  items.forEach((item, idx) => {
    const minCol = colHeights.indexOf(Math.min(...colHeights))
    const ar = getAspectRatio(item)
    cols[minCol].push({
      ...item,
      originalIndex: idx,
      aspectRatio: ar,
      colIndex: minCol,
    })
    colHeights[minCol] += 300 * ar
  })

  return cols
}

export default function MasterAlbumPage({ onNavigate }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [colCount, setColCount] = useState(getColCount())
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)

  // Track responsive column count & mobile state
  useEffect(() => {
    const handleResize = () => {
      setColCount(getColCount())
      setIsMobile(checkIsMobile())
      ScrollTrigger.refresh()
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Distribute all archival images across masonry columns (shortest column first)
  const columns = useMemo(() => {
    return buildColumns(MASTER_ALBUM_IMAGES, colCount)
  }, [colCount])

  const maxPerColumn = useMemo(() => {
    return Math.max(...columns.map((c) => c.length), 0)
  }, [columns])

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return
      if (e.key === 'Escape') setSelectedImage(null)
      if (e.key === 'ArrowRight') handleNextImage()
      if (e.key === 'ArrowLeft') handlePrevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage])

  const handleNextImage = () => {
    if (!selectedImage) return
    const currentIndex = MASTER_ALBUM_IMAGES.findIndex((img) => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % MASTER_ALBUM_IMAGES.length
    setSelectedImage(MASTER_ALBUM_IMAGES[nextIndex])
  }

  const handlePrevImage = () => {
    if (!selectedImage) return
    const currentIndex = MASTER_ALBUM_IMAGES.findIndex((img) => img.id === selectedImage.id)
    const prevIndex = (currentIndex - 1 + MASTER_ALBUM_IMAGES.length) % MASTER_ALBUM_IMAGES.length
    setSelectedImage(MASTER_ALBUM_IMAGES[prevIndex])
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0d1b2a] text-white pt-24 sm:pt-28 pb-32 px-4 sm:px-8 md:px-12 selection:bg-[#D8BB7B] selection:text-black relative overflow-hidden"
    >
      {/* Subtle ambient lighting glows to give depth to the #0d1b2a midnight navy backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#18314e]/30 via-[#10243b]/15 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] bg-[#122842]/20 blur-3xl rounded-full" />
        <div className="absolute top-2/3 -right-48 w-[500px] h-[500px] bg-[#152e4d]/20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-[1700px] mx-auto relative z-10">
        
        {/* Top Header Bar & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.25em] text-white/60 hover:text-[#D8BB7B] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#D8BB7B]" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3 text-[11px] font-mono tracking-widest text-white/50 uppercase">
            <span>Zan Storyteller</span>
            <span className="text-white/20">//</span>
            <span className="text-[#D8BB7B] font-semibold">Master Archival Album</span>
          </div>
        </div>

        {/* Minimalist Editorial Title Section (Clean layout without filter pills) */}
        <div className="text-center max-w-3xl mx-auto pt-2 pb-12 sm:pb-16 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[#D8BB7B] text-[10px] font-mono uppercase tracking-[0.25em] mb-4 backdrop-blur-sm shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D8BB7B] animate-pulse" />
            <span>Portfolio Archive</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white uppercase leading-[1.08] mb-4">
            Curated <br />
            <span className="font-serif italic font-normal text-[#D8BB7B] lowercase tracking-normal">
              visual works.
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-white/65 font-light leading-relaxed max-w-xl mx-auto">
            Explore our body of wedding, portrait, editorial, and ceremonial storytelling in one seamless archive.
          </p>
        </div>

        {/* 
          Cascading Masonry Grid with Smooth Lazy Loading & Scroll Animation:
          - Columns calculated dynamically by shortest column height
          - Zero card clipping: images fly uncropped and unclipped
          - Preloaded lazy loading with shimmer placeholder
          - Settles with smooth GSAP scrub physics directly into slot
        */}
        <main className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10">
            {columns.map((col, cIdx) => (
              <div key={`col-${cIdx}`} className="flex flex-col gap-5 md:gap-8 lg:gap-10">
                {col.map((image, imgIdx) => (
                  <MfrportsCard
                    key={`${image.id}-${cIdx}-${imgIdx}`}
                    image={image}
                    colIndex={cIdx}
                    imgIndex={imgIdx}
                    maxPerColumn={maxPerColumn}
                    colCount={colCount}
                    isMobile={isMobile}
                    onSelect={() => setSelectedImage(image)}
                  />
                ))}
              </div>
            ))}
          </div>
        </main>

      </div>

      {/* Full-Screen Lightbox Modal for Photo Inspection */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] bg-[#070e17]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Top Close & Meta Bar */}
            <div
              className="absolute top-6 left-6 right-6 flex items-center justify-between text-white/80 z-20 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D8BB7B]">
                  {selectedImage.categoryLabel || selectedImage.category}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs font-mono text-white/60">{selectedImage.year}</span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span className="hidden sm:inline text-xs font-mono text-white/60">{selectedImage.location}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedImage(null)}
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
                handlePrevImage()
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
                handleNextImage()
              }}
              aria-label="Next Frame"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#0d1b2a]/80 hover:bg-[#D8BB7B] hover:text-black border border-white/15 flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image Card */}
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl max-h-[84vh] rounded-2xl overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.85)] border border-white/12 bg-[#0d1b2a]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[78vh] object-contain block mx-auto"
              />

              <div className="p-4 sm:p-5 bg-[#091420] flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div>
                  <h3 className="text-base sm:text-lg font-light text-white tracking-wide">
                    {selectedImage.title}
                  </h3>
                  <p className="text-[11px] font-mono text-white/50 tracking-widest uppercase mt-0.5">
                    {selectedImage.location}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('/book-session')}
                  className="px-5 py-2.5 rounded-full bg-[#D8BB7B] text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors cursor-pointer shadow-lg shadow-[#D8BB7B]/20"
                >
                  Book Session In This Style
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * MfrportsCard Component
 * Ultra-smooth lazy loading and scroll-driven cascade:
 * 
 * 1. Generous Preloading Buffer:
 *    IntersectionObserver with rootMargin: 1200px starts fetching early in the background.
 *    Images are already loaded into memory before scrolling into view.
 * 
 * 2. Zero-Clipping Physical Geometry:
 *    Container has NO overflow-hidden, allowing the card to tilt and translate uncropped.
 * 
 * 3. Dynamic Natural Ratio:
 *    Auto-measures naturalWidth & naturalHeight to fit each photograph 1:1 without cropping.
 * 
 * 4. GSAP ScrollTrigger Scrubbing:
 *    Smoothly interpolates rotation & offsets to 0, locking flush into the slot.
 */
function MfrportsCard({
  image,
  colIndex,
  imgIndex,
  maxPerColumn,
  colCount,
  isMobile,
  onSelect,
}) {
  const [inView, setInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [aspectRatio, setAspectRatio] = useState(
    image.aspectRatio || (image.aspect === 'landscape' ? 0.67 : 1.45)
  )
  const containerRef = useRef(null)
  const imgRef = useRef(null)

  // Randomized params per card instance (from mfrports Us.animation)
  const animParams = useMemo(() => {
    const { animation: anim } = MFR_CONFIG
    return {
      rotation: Math.random() * (anim.rotation.max - anim.rotation.min) + anim.rotation.min,
      xDistance: Math.random() * (anim.x.max - anim.x.min) + anim.x.min,
      yDistance: Math.random() * (anim.y.max - anim.y.min) + anim.y.min,
      startOffset: Math.random() * (anim.startOffset.max - anim.startOffset.min) + anim.startOffset.min,
    }
  }, [])

  // Lazy load intersection observer with generous 1200px preloading margin
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: MFR_CONFIG.lazyLoad.rootMargin,
        threshold: MFR_CONFIG.lazyLoad.threshold,
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Signature mfrports.com scroll-driven entrance animation via GSAP ScrollTrigger
  useEffect(() => {
    if (!imgRef.current || isMobile) return

    const el = imgRef.current
    const { animation: anim } = MFR_CONFIG
    const W = (colCount - 1) / 2
    const j = colIndex - W
    const isCenter = j === 0

    // Direction & multiplier math from mfrports.com:
    const rotDir = isCenter ? (Math.random() > 0.5 ? 1 : -1) : (j < 0 ? 1 : -1)
    const xDir = isCenter ? (Math.random() > 0.5 ? 1 : -1) : (j < 0 ? -1 : 1)
    const xMult = isCenter ? anim.centerMultiplier : Math.abs(j) / W
    const rotMult = isCenter ? anim.centerMultiplier : 1

    const { rotation, xDistance, yDistance, startOffset } = animParams

    const tween = gsap.fromTo(
      el,
      {
        rotation: rotation * rotDir * rotMult,
        x: xDistance * xDir * xMult,
        y: yDistance,
      },
      {
        rotation: 0,
        x: 0,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: `top bottom-=${startOffset}px`,
          end: `top bottom-=${startOffset + anim.transformDuration}px`,
          scrub: anim.scrub,
        },
      }
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [isMobile, colIndex, colCount, animParams, aspectRatio])

  return (
    <div
      ref={containerRef}
      className="relative bg-[#16202e] border border-white/[0.06] rounded-2xl cursor-pointer group shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-[#D8BB7B]/40 transition-all duration-300"
      style={{
        zIndex: maxPerColumn - imgIndex,
        paddingBottom: `${aspectRatio * 100}%`,
      }}
      onClick={onSelect}
    >
      {/* Dark navy skeleton shimmer placeholder matching screenshot */}
      {!isLoaded && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#14202d] via-[#1d2d3f] to-[#14202d] animate-pulse" />
      )}

      {/* Unclipped Image Element with smooth fade-in */}
      {inView && (
        <img
          ref={imgRef}
          src={image.src}
          alt={image.title || ''}
          data-col={colIndex}
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            setIsLoaded(true)
            if (e.target.naturalWidth && e.target.naturalHeight) {
              const realRatio = e.target.naturalHeight / e.target.naturalWidth
              setAspectRatio(realRatio)
            }
            ScrollTrigger.refresh()
          }}
          className={`reveal-img absolute inset-0 w-full h-full object-cover rounded-2xl will-change-transform shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          draggable={false}
        />
      )}

      {/* Clean photo presentation without any overlay layer */}
    </div>
  )
}
