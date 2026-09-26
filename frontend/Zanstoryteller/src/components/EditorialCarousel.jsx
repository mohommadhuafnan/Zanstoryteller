import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, X, Maximize2 } from 'lucide-react'
import { editorialCarouselImages } from '../data/photographyData'

export default function EditorialCarousel() {
  const scrollContainerRef = useRef(null)
  const isPausedRef = useRef(false)
  const resumeTimeoutRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollStartRef = useRef(0)
  const dragDistanceRef = useRef(0)
  const animFrameRef = useRef(null)
  const scrollPosRef = useRef(0)

  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null)
  const [isGrabbing, setIsGrabbing] = useState(false)

  // Triple the items for 100% seamless infinite loop in both directions
  const repeatedImages = [
    ...editorialCarouselImages,
    ...editorialCarouselImages,
    ...editorialCarouselImages
  ]

  // Pause helper with auto-resume timeout
  const pauseAutoScrollTemporarily = useCallback((durationMs = 2500) => {
    isPausedRef.current = true
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    resumeTimeoutRef.current = setTimeout(() => {
      if (!isDraggingRef.current) {
        if (scrollContainerRef.current) {
          scrollPosRef.current = scrollContainerRef.current.scrollLeft
        }
        isPausedRef.current = false
      }
    }, durationMs)
  }, [])

  // Continuous smooth auto-scroll loop
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Position initially in the middle repetition to allow smooth left & right scrolling
    const initScrollPosition = () => {
      const singleSetWidth = container.scrollWidth / 3
      if (singleSetWidth > 0 && container.scrollLeft === 0) {
        container.scrollLeft = singleSetWidth
        scrollPosRef.current = singleSetWidth
      }
    }

    const timer = setTimeout(initScrollPosition, 150)

    // Smooth drift speed (pixels per frame at 60fps)
    const scrollSpeed = 1.0

    const animateLoop = () => {
      if (container && !isPausedRef.current) {
        scrollPosRef.current += scrollSpeed

        const singleSetWidth = container.scrollWidth / 3
        if (singleSetWidth > 0) {
          if (scrollPosRef.current >= singleSetWidth * 2) {
            scrollPosRef.current -= singleSetWidth
          } else if (scrollPosRef.current <= 5) {
            scrollPosRef.current += singleSetWidth
          }
        }

        container.scrollLeft = scrollPosRef.current
      }
      animFrameRef.current = requestAnimationFrame(animateLoop)
    }

    animFrameRef.current = requestAnimationFrame(animateLoop)

    return () => {
      clearTimeout(timer)
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [])

  // Keep scrollPosRef synced during manual trackpad or touch scrolling
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const singleSetWidth = container.scrollWidth / 3
    if (singleSetWidth > 0) {
      if (container.scrollLeft >= singleSetWidth * 2) {
        container.scrollLeft -= singleSetWidth
        scrollPosRef.current = container.scrollLeft
      } else if (container.scrollLeft <= 5) {
        container.scrollLeft += singleSetWidth
        scrollPosRef.current = container.scrollLeft
      } else if (isDraggingRef.current || isPausedRef.current) {
        scrollPosRef.current = container.scrollLeft
      }
    }
  }

  // Manual Arrow Navigation (Left / Right)
  const handleManualScroll = (direction) => {
    pauseAutoScrollTemporarily(3000)
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 450 * (direction === 'left' ? -1 : 1)

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })

    setTimeout(() => {
      if (container) {
        scrollPosRef.current = container.scrollLeft
      }
    }, 400)
  }

  // Mouse Grab and Drag Handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    const container = scrollContainerRef.current
    if (!container) return

    isDraggingRef.current = true
    setIsGrabbing(true)
    isPausedRef.current = true
    startXRef.current = e.pageX - container.offsetLeft
    scrollStartRef.current = container.scrollLeft
    dragDistanceRef.current = 0
  }

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return
    e.preventDefault()
    const container = scrollContainerRef.current
    if (!container) return

    const currentX = e.pageX - container.offsetLeft
    const diff = (currentX - startXRef.current) * 1.2
    const targetScroll = scrollStartRef.current - diff
    container.scrollLeft = targetScroll
    scrollPosRef.current = targetScroll
    dragDistanceRef.current += Math.abs(e.movementX || 0)
  }

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsGrabbing(false)
    if (scrollContainerRef.current) {
      scrollPosRef.current = scrollContainerRef.current.scrollLeft
    }
    pauseAutoScrollTemporarily(2000)
  }

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      setIsGrabbing(false)
      if (scrollContainerRef.current) {
        scrollPosRef.current = scrollContainerRef.current.scrollLeft
      }
    }
    pauseAutoScrollTemporarily(1000)
  }

  const handleMouseEnter = () => {
    isPausedRef.current = true
  }

  // Touch Handlers for Mobile Devices
  const handleTouchStart = () => {
    isPausedRef.current = true
  }

  const handleTouchEnd = () => {
    if (scrollContainerRef.current) {
      scrollPosRef.current = scrollContainerRef.current.scrollLeft
    }
    pauseAutoScrollTemporarily(2500)
  }

  // Card click with drag threshold check
  const handleCardClick = (originalIndex) => {
    if (dragDistanceRef.current > 6) return
    setActiveLightboxIndex(originalIndex)
  }

  // Lightbox keyboard navigation
  useEffect(() => {
    if (activeLightboxIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveLightboxIndex(null)
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev + 1) % editorialCarouselImages.length)
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev - 1 + editorialCarouselImages.length) % editorialCarouselImages.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeLightboxIndex])

  return (
    <section className="relative w-full bg-[#FFFFFF] py-4 sm:py-6 md:py-8 overflow-hidden select-none border-b border-[#F0F0F0]">
      <div className="relative w-full">
        
        {/* Navigation Arrow: LEFT (Matching screenshot) */}
        <button
          type="button"
          onClick={() => handleManualScroll('left')}
          aria-label="Scroll gallery left"
          className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.18)] border border-black/5 flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" strokeWidth={2} />
        </button>

        {/* Navigation Arrow: RIGHT (Matching screenshot) */}
        <button
          type="button"
          onClick={() => handleManualScroll('right')}
          aria-label="Scroll gallery right"
          className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.18)] border border-black/5 flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
        >
          <ArrowRight className="w-5 h-5 text-[#111111]" strokeWidth={2} />
        </button>

        {/* Horizontal Infinite Slider Track */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 md:px-8 py-2 ${
            isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
          } [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'auto'
          }}
        >
          {repeatedImages.map((item, idx) => {
            const originalIndex = idx % editorialCarouselImages.length
            return (
              <div
                key={`${item.id}-${idx}`}
                data-card
                onClick={() => handleCardClick(originalIndex)}
                /* 
                  FIXED HEIGHT + ADAPTIVE WIDTH:
                  Height is consistent across all items (e.g. h-[460px] to h-[560px]).
                  Width automatically adapts based on each image's natural aspect ratio (w-auto).
                  Subtle border-radius: rounded-lg (no heavy rounded corners).
                  Never crops any image!
                */
                className="group relative flex-shrink-0 h-[460px] sm:h-[500px] md:h-[540px] lg:h-[560px] w-auto overflow-hidden rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.06)] bg-[#F5F5F5] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer"
              >
                {/* Image adapts its width naturally according to its natural aspect ratio at 100% height */}
                <img
                  src={item.image}
                  alt={item.alt}
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-auto max-w-none block select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.02] filter saturate-[0.98] contrast-[1.02]"
                />

                {/* Subtle hover vignette & metadata pill */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/80 block">
                      {item.subtitle}
                    </span>
                    <span className="text-sm font-medium tracking-tight">
                      {item.title}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Navigation: Left */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActiveLightboxIndex((prev) => (prev - 1 + editorialCarouselImages.length) % editorialCarouselImages.length)
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Navigation: Right */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActiveLightboxIndex((prev) => (prev + 1) % editorialCarouselImages.length)
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Modal Image Display */}
            <motion.div
              key={activeLightboxIndex}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={editorialCarouselImages[activeLightboxIndex].image}
                alt={editorialCarouselImages[activeLightboxIndex].alt}
                loading="eager"
                decoding="async"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white/70 text-xs font-mono tracking-widest uppercase">
                  {editorialCarouselImages[activeLightboxIndex].subtitle}
                </p>
                <h4 className="text-white text-lg font-light tracking-wide mt-1">
                  {editorialCarouselImages[activeLightboxIndex].title}
                </h4>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
