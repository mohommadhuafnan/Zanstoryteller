import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Vector stroke paths for each letter of ZAN STORYTELLER (matching Unifixz SVG stroke-draw architecture)
const ZAN_LETTER_PATHS = [
  { id: 'Z1', char: 'Z', d: 'M 24 8 L 72 8 L 24 76 L 72 76' },
  { id: 'A1', char: 'A', d: 'M 88 76 L 114 8 L 140 76 M 99 50 L 129 50' },
  { id: 'N1', char: 'N', d: 'M 156 76 L 156 8 L 206 76 L 206 8' },
  { id: 'S1', char: 'S', d: 'M 310 22 Q 310 8 289 8 Q 266 8 266 24 Q 266 40 289 42 Q 312 44 312 60 Q 312 76 289 76 Q 268 76 268 62' },
  { id: 'T1', char: 'T', d: 'M 328 8 L 376 8 M 352 8 L 352 76' },
  { id: 'O1', char: 'O', d: 'M 408 8 L 428 8 Q 444 8 444 24 L 444 60 Q 444 76 428 76 L 408 76 Q 392 76 392 60 L 392 24 Q 392 8 408 8 Z' },
  { id: 'R1', char: 'R', d: 'M 460 76 L 460 8 L 486 8 Q 508 8 508 25 Q 508 42 486 42 L 460 42 M 484 42 L 508 76' },
  { id: 'Y1', char: 'Y', d: 'M 524 8 L 548 42 L 548 76 M 572 8 L 548 42' },
  { id: 'T2', char: 'T', d: 'M 588 8 L 636 8 M 612 8 L 612 76' },
  { id: 'E1', char: 'E', d: 'M 696 8 L 652 8 L 652 76 L 696 76 M 652 42 L 688 42' },
  { id: 'L1', char: 'L', d: 'M 712 8 L 712 76 L 754 76' },
  { id: 'L2', char: 'L', d: 'M 770 8 L 770 76 L 812 76' },
  { id: 'E2', char: 'E', d: 'M 872 8 L 828 8 L 828 76 L 872 76 M 828 42 L 864 42' },
  { id: 'R2', char: 'R', d: 'M 888 76 L 888 8 L 914 8 Q 936 8 936 25 Q 936 42 914 42 L 888 42 M 912 42 L 936 76' },
]

// Ghost architectural drafting lines spanning viewBox="0 0 960 84"
const GHOST_BLUEPRINT_PATHS = [
  'M 48 42 A 62 62 0 1 1 172 42 A 62 62 0 1 1 48 42',
  'M 224 42 A 62 62 0 1 1 348 42 A 62 62 0 1 1 224 42',
  'M 356 42 A 62 62 0 1 1 480 42 A 62 62 0 1 1 356 42',
  'M 488 42 A 62 62 0 1 1 612 42 A 62 62 0 1 1 488 42',
  'M 620 42 A 62 62 0 1 1 744 42 A 62 62 0 1 1 620 42',
  'M 752 42 A 62 62 0 1 1 876 42 A 62 62 0 1 1 752 42',
  'M 0 21 L 960 21',
  'M 0 63 L 960 63',
  'M 0 42 L 960 42',
  'M 0 84 L 960 0',
  'M 0 0 L 960 84',
]

// Module-level cache to ensure initial loader only runs on first site entrance/refresh,
// never when navigating between internal routes (e.g. Back to Home from Gallery).
let hasCompletedInitialLoad = false

/**
 * Luxury cinematic loading indicator with sequential text typing followed by logo zoom:
 * - Solid #0d1b2a background with zero extraneous lighting.
 * - Text draws first via Unifixz SVG stroke drawing.
 * - Once text finishes drawing, the logo prominently zooms in.
 * - Preserved 100% exactly without any changes.
 */
export default function ExperienceLoader() {
  const [isReady, setIsReady] = useState(hasCompletedInitialLoad)
  const [textFinished, setTextFinished] = useState(false)
  const [isZoomingHero, setIsZoomingHero] = useState(false)

  // Strictly lock page scrolling while initial experience loader is active
  useEffect(() => {
    if (!isReady) {
      const originalBodyOverflow = document.body.style.overflow
      const originalHtmlOverflow = document.documentElement.style.overflow

      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'

      const preventScroll = (e) => {
        e.preventDefault()
      }

      window.addEventListener('wheel', preventScroll, { passive: false })
      window.addEventListener('touchmove', preventScroll, { passive: false })

      return () => {
        document.body.style.overflow = originalBodyOverflow
        document.documentElement.style.overflow = originalHtmlOverflow
        window.removeEventListener('wheel', preventScroll)
        window.removeEventListener('touchmove', preventScroll)
      }
    }
  }, [isReady])

  useEffect(() => {
    if (hasCompletedInitialLoad) {
      setIsReady(true)
      return
    }

    // 14 letters * 0.06s delay + ~0.7s stroke draw = finishes at ~1450ms
    const textTimer = setTimeout(() => {
      setTextFinished(true)
    }, 1450)

    // Logo zooms to full-screen entering hero section
    const zoomHeroTimer = setTimeout(() => {
      setIsZoomingHero(true)
    }, 2250)

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent))
    const MIN_LOADER_TIME = isMobile ? 2600 : 2800

    const readyTimer = setTimeout(() => {
      hasCompletedInitialLoad = true
      setIsReady(true)
    }, MIN_LOADER_TIME)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(zoomHeroTimer)
      clearTimeout(readyTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="minimal-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] w-screen h-screen flex flex-col items-center justify-center bg-[#0d1b2a] text-white px-4 sm:px-8 pointer-events-auto select-none overflow-hidden"
        >
          <div className="flex flex-col items-center w-full max-w-6xl text-center relative">
            
            {/* Logo Area: Zooms in when text finishes, then expands to full-screen entering hero section */}
            <div className="h-28 sm:h-32 md:h-36 flex items-center justify-center mb-3 sm:mb-4">
              <AnimatePresence>
                {textFinished && (
                  <motion.div
                    key="loader-logo-zoom"
                    initial={{ scale: 0.15, opacity: 0 }}
                    animate={{
                      scale: isZoomingHero ? [1, 3.8] : 1,
                      opacity: isZoomingHero ? [1, 0] : 1,
                    }}
                    transition={{
                      scale: isZoomingHero
                        ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
                        : { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                      opacity: isZoomingHero
                        ? { duration: 0.55, ease: 'easeOut' }
                        : { duration: 0.3 },
                    }}
                    exit={{
                      scale: 4,
                      opacity: 0,
                      transition: { duration: 0.6, ease: 'easeOut' },
                    }}
                    className="flex items-center justify-center transform-gpu will-change-transform"
                  >
                    <img
                      src="https://res.cloudinary.com/dtpeeydfz/image/upload/f_webp,q_auto:good,w_400/v1791466439/zanstoryteller/branding/zan_logo_gold.png"
                      alt="Zan Storyteller Logo"
                      width="144"
                      height="144"
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Massive Stroke Drawing SVG for ZAN STORYTELLER without drop-shadow */}
            <motion.div
              animate={{
                opacity: isZoomingHero ? 0 : 1,
                scale: isZoomingHero ? 0.96 : 1,
              }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full flex items-center justify-center my-2 sm:my-3"
            >
              <svg
                viewBox="0 0 960 84"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Zan Storyteller"
                className="w-[92vw] max-w-[1100px] h-auto select-none"
              >
                <defs>
                  <linearGradient id="goldGradientStroke" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="16%" stopColor="#FFF5D8" />
                    <stop offset="45%" stopColor="#E5C788" />
                    <stop offset="75%" stopColor="#D8BB7B" />
                    <stop offset="100%" stopColor="#8C6520" />
                  </linearGradient>
                </defs>

                {/* Ghost Architectural Blueprint Guidelines */}
                {GHOST_BLUEPRINT_PATHS.map((d, idx) => (
                  <motion.path
                    key={`ghost-${idx}`}
                    d={d}
                    fill="none"
                    stroke="#D8BB7B"
                    strokeOpacity="0.18"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.18 }}
                    transition={{
                      duration: 1.4,
                      ease: [0.16, 1, 0.3, 1],
                      delay: idx * 0.04,
                    }}
                  />
                ))}

                {/* Main Stroke-Drawn Letters (Sequential reveal, crisp gold with no shadow) */}
                {ZAN_LETTER_PATHS.map((letter, index) => (
                  <motion.path
                    key={letter.id}
                    d={letter.d}
                    fill="none"
                    stroke="url(#goldGradientStroke)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      pathLength: {
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.05 + index * 0.06,
                      },
                      opacity: {
                        duration: 0.15,
                        delay: 0.05 + index * 0.06,
                      },
                    }}
                  />
                ))}
              </svg>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
