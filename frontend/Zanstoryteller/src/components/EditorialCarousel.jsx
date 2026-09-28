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
  const lastReportedImgRef = useRef(null)

  // Initial background defaults to the photoshoot composite backdrop matching reference screenshot
  const [currentBgImage, setCurrentBgImage] = useState('/editorial/abaya_composite_backdrop.webp')
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null)
  const [isGrabbing, setIsGrabbing] = useState(false)

  // Triple the items for 100% seamless infinite loop in both directions
  const repeatedImages = [
    ...editorialCarouselImages,
    ...editorialCarouselImages,
    ...editorialCarouselImages
  ]

  // Detect card closest to viewport center and smoothly update section background
  const detectCenterCard = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    const cards = container.querySelectorAll('[data-card]')
    let closestIndex = -1
    let minDistance = Infinity

    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const dist = Math.abs(containerCenter - cardCenter)
      if (dist < minDistance) {
        minDistance = dist
        closestIndex = idx
      }
    })

    if (closestIndex >= 0 && closestIndex < repeatedImages.length) {
      const targetImg = repeatedImages[closestIndex]?.image
      if (targetImg && targetImg !== lastReportedImgRef.current) {
        lastReportedImgRef.current = targetImg
        setCurrentBgImage(targetImg)
      }
    }
  }, [repeatedImages])

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

  // Continuous smooth auto-scroll loop with IntersectionObserver visibility gating
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let isVisible = false

    // Position initially in the middle repetition to allow smooth left & right scrolling
    const initScrollPosition = () => {
      const singleSetWidth = container.scrollWidth / 3
      if (singleSetWidth > 0 && container.scrollLeft === 0) {
        container.scrollLeft = singleSetWidth
        scrollPosRef.current = singleSetWidth
      }
      detectCenterCard()
    }

    const timer = setTimeout(initScrollPosition, 150)

    // Smooth drift speed (pixels per frame at 60fps)
    const scrollSpeed = 0.85
    let lastCheckTime = 0

    const animateLoop = (time) => {
      if (!isVisible) {
        animFrameRef.current = null
        return
      }

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

        // Check center card every 300ms to smoothly sync background
        if (time - lastCheckTime > 300) {
          detectCenterCard()
          lastCheckTime = time
        }
      }
      animFrameRef.current = requestAnimationFrame(animateLoop)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(animateLoop)
        }
      },
      { threshold: 0.05, rootMargin: '120px' }
    )
    observer.observe(container)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [detectCenterCard])

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

    detectCenterCard()
  }

  // Manual Arrow Navigation (Left / Right)
  const handleManualScroll = (direction) => {
    pauseAutoScrollTemporarily(3500)
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 420 * (direction === 'left' ? -1 : 1)

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })

    setTimeout(() => {
      if (container) {
        scrollPosRef.current = container.scrollLeft
        detectCenterCard()
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
    detectCenterCard()
  }

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsGrabbing(false)
    if (scrollContainerRef.current) {
      scrollPosRef.current = scrollContainerRef.current.scrollLeft
      detectCenterCard()
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
      detectCenterCard()
    }
    pauseAutoScrollTemporarily(2500)
  }

  // Card click with drag threshold check
  const handleCardClick = (originalIndex, itemImage) => {
    if (dragDistanceRef.current > 6) return
    if (itemImage) {
      lastReportedImgRef.current = itemImage
      setCurrentBgImage(itemImage)
    }
    setActiveLightboxIndex(originalIndex)
  }

  // Card hover syncs background smoothly
  const handleCardHover = (itemImage) => {
    if (itemImage && !isDraggingRef.current) {
      lastReportedImgRef.current = itemImage
      setCurrentBgImage(itemImage)
    }
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
    <section className="relative w-full overflow-hidden select-none py-10 sm:py-14 md:py-16 lg:py-20 flex items-center justify-center min-h-[580px] sm:min-h-[660px] md:min-h-[720px] lg:min-h-[760px] border-b border-black/10">
      
      {/* 
        ========================================================================
        01. BACKGROUND LAYER: Displays the same photoshoot images in the background!
        Peeks out above and below the center framed container matching reference screenshot.
        ========================================================================
      */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={currentBgImage}
            src={currentBgImage}
            alt="Photoshoot Editorial Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="w-full h-full object-cover object-center filter brightness-[0.90] contrast-[1.04]"
          />
        </AnimatePresence>

        {/* Cinematic dark scrim overlay to ensure depth and contrast */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/35 pointer-events-none" />
      </div>

      {/* 
        ========================================================================
        02. FOREGROUND LAYER ("In the top"):
        Inset framed container (#F3F1EE) housing the left-to-right scrolling images.
        Directly matches the reference screenshot's proportions, frame padding & colors.
        ========================================================================
      */}
      <div className="relative z-10 w-[95%] sm:w-[92%] xl:w-[88%] max-w-[1480px] 2xl:max-w-[1600px] mx-auto bg-[#F3F1EE] rounded-none sm:rounded-sm shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_10px_25px_-5px_rgba(0,0,0,0.3)] border border-white/40 p-3.5 sm:p-5 md:p-6 lg:p-7">
        
        {/* Relative wrapper for track + buttons */}
        <div className="relative w-full overflow-hidden">

          {/* Navigation Arrow: LEFT */}
          <button
            type="button"
            onClick={() => handleManualScroll('left')}
            aria-label="Scroll gallery left"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.22)] border border-black/5 flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5 text-[#111111]" strokeWidth={2} />
          </button>

          {/* Navigation Arrow: RIGHT */}
          <button
            type="button"
            onClick={() => handleManualScroll('right')}
            aria-label="Scroll gallery right"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.22)] border border-black/5 flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
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
            className={`flex items-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-none py-1 px-1 ${
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
                  onClick={() => handleCardClick(originalIndex, item.image)}
                  onMouseEnter={() => handleCardHover(item.image)}
                  /*
                    PORTRAIT PROPORTIONS MATCHING SCREENSHOT:
                    3 items displayed side by side with clean rectangular framing and subtle gap.
                  */
                  className="group relative flex-shrink-0 w-[270px] sm:w-[320px] md:w-[370px] lg:w-[410px] xl:w-[430px] h-[340px] sm:h-[400px] md:h-[460px] lg:h-[500px] overflow-hidden rounded-none shadow-[0_4px_16px_rgba(0,0,0,0.06)] bg-[#EAE8E3] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] cursor-pointer"
                >
                  {/* Photo fills the card with object-cover */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover block select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-[1.025] filter saturate-[1.0] contrast-[1.02]"
                  />

                  {/* Subtle hover vignette & metadata */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                    <div className="pr-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-white/80 block">
                        {item.subtitle}
                      </span>
                      <span className="text-sm font-medium tracking-tight line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* 
        ========================================================================
        03. FULLSCREEN LIGHTBOX MODAL
        ========================================================================
      */}
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
                const newIdx = (activeLightboxIndex - 1 + editorialCarouselImages.length) % editorialCarouselImages.length
                setActiveLightboxIndex(newIdx)
                setCurrentBgImage(editorialCarouselImages[newIdx].image)
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
                const newIdx = (activeLightboxIndex + 1) % editorialCarouselImages.length
                setActiveLightboxIndex(newIdx)
                setCurrentBgImage(editorialCarouselImages[newIdx].image)
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
                className="max-w-full max-h-[80vh] object-contain rounded-sm shadow-2xl"
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
