import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useScroll, motion, AnimatePresence } from 'framer-motion'
import { Camera } from 'lucide-react'
import ScrollImageSequence from './ScrollImageSequence'
import ScrollParticleField from './ScrollParticleField'
import HeroTextOverlay from './HeroTextOverlay'
import {
  TOTAL_FRAMES,
  frameCacheManager,
} from '../utils/frameSequence'

/**
 * Bottom Cinematic Stage & Scroll Indicator (matching Screenshot 4):
 * SCROLL ————————— 01 / 03
 * Animates smoothly up into position at the bottom after loading completes.
 */
function BottomScrollStageIndicator({ scrollYProgress, isReady }) {
  const [stageIndex, setStageIndex] = useState('01 / 03')
  const [lineProgress, setLineProgress] = useState(0)

  useEffect(() => {
    if (!scrollYProgress) return
    return scrollYProgress.on('change', (v) => {
      setLineProgress(v)
      if (v < 0.33) {
        setStageIndex('01 / 03')
      } else if (v < 0.68) {
        setStageIndex('02 / 03')
      } else {
        setStageIndex('03 / 03')
      }
    })
  }, [scrollYProgress])

  return (
    <AnimatePresence>
      {isReady && (
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 22 }}
          transition={{ duration: 0.85, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-7 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center gap-3.5 sm:gap-5 text-xs font-mono uppercase tracking-[0.28em] text-white/80 select-none"
        >
          <span className="text-white/70 tracking-[0.3em] text-[11px] sm:text-xs">SCROLL</span>

          {/* Sleek Line Track */}
          <div className="w-24 sm:w-36 md:w-44 h-[1.5px] bg-white/20 relative overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D8BB7B] via-[#FFF5D6] to-white"
              style={{ width: `${Math.max(8, lineProgress * 100)}%` }}
            />
          </div>

          <span className="text-white/90 font-medium tracking-[0.24em] text-[11px] sm:text-xs min-w-[56px] text-right">
            {stageIndex}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Vector stroke paths for each letter of ZANSTORYTELLER (matching Unifixz SVG stroke-draw architecture)
const ZAN_LETTER_PATHS = [
  { id: 'Z1', char: 'Z', d: 'M 24 8 L 72 8 L 24 76 L 72 76' },
  { id: 'A1', char: 'A', d: 'M 88 76 L 114 8 L 140 76 M 99 50 L 129 50' },
  { id: 'N1', char: 'N', d: 'M 156 76 L 156 8 L 206 76 L 206 8' },
  { id: 'S1', char: 'S', d: 'M 266 22 Q 266 8 245 8 Q 222 8 222 24 Q 222 40 245 42 Q 268 44 268 60 Q 268 76 245 76 Q 224 76 224 62' },
  { id: 'T1', char: 'T', d: 'M 284 8 L 332 8 M 308 8 L 308 76' },
  { id: 'O1', char: 'O', d: 'M 364 8 L 384 8 Q 400 8 400 24 L 400 60 Q 400 76 384 76 L 364 76 Q 348 76 348 60 L 348 24 Q 348 8 364 8 Z' },
  { id: 'R1', char: 'R', d: 'M 416 76 L 416 8 L 442 8 Q 464 8 464 25 Q 464 42 442 42 L 416 42 M 440 42 L 464 76' },
  { id: 'Y1', char: 'Y', d: 'M 480 8 L 504 42 L 504 76 M 528 8 L 504 42' },
  { id: 'T2', char: 'T', d: 'M 544 8 L 592 8 M 568 8 L 568 76' },
  { id: 'E1', char: 'E', d: 'M 652 8 L 608 8 L 608 76 L 652 76 M 608 42 L 644 42' },
  { id: 'L1', char: 'L', d: 'M 668 8 L 668 76 L 710 76' },
  { id: 'L2', char: 'L', d: 'M 726 8 L 726 76 L 768 76' },
  { id: 'E2', char: 'E', d: 'M 828 8 L 784 8 L 784 76 L 828 76 M 784 42 L 820 42' },
  { id: 'R2', char: 'R', d: 'M 844 76 L 844 8 L 870 8 Q 892 8 892 25 Q 892 42 870 42 L 844 42 M 868 42 L 892 76' },
]

// Ghost architectural drafting lines spanning viewBox="0 0 916 84"
const GHOST_BLUEPRINT_PATHS = [
  'M 48 42 A 62 62 0 1 1 172 42 A 62 62 0 1 1 48 42',
  'M 180 42 A 62 62 0 1 1 304 42 A 62 62 0 1 1 180 42',
  'M 312 42 A 62 62 0 1 1 436 42 A 62 62 0 1 1 312 42',
  'M 444 42 A 62 62 0 1 1 568 42 A 62 62 0 1 1 444 42',
  'M 576 42 A 62 62 0 1 1 700 42 A 62 62 0 1 1 576 42',
  'M 708 42 A 62 62 0 1 1 832 42 A 62 62 0 1 1 708 42',
  'M 0 21 L 916 21',
  'M 0 63 L 916 63',
  'M 0 42 L 916 42',
  'M 0 84 L 916 0',
  'M 0 0 L 916 84',
]

/**
 * Luxury cinematic loading indicator with Unifixz-Style SVG Stroke-Drawing Animation:
 * - Huge scale matching the "THAT BECOME" headline weight and impact.
 * - Every letter stroke draws slowly and sequentially with rounded line caps.
 * - Blueprint drafting grid lines and aperture circles behind letters.
 * - 3 animated wave bouncing dots (. . .) centered below.
 * - Gold emblem logo & glowing progress telemetry.
 */
function MinimalExperienceLoader({ progress, isReady }) {
  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="minimal-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#121E2C] text-white px-4 sm:px-8 pointer-events-auto select-none overflow-hidden"
          style={{ background: 'radial-gradient(circle at center, #18293d 0%, #121E2C 100%)' }}
        >
          <div className="flex flex-col items-center w-full max-w-6xl text-center relative">
            {/* Ambient Gold Aura Glow & Emblem */}
            <div className="relative flex items-center justify-center mb-3 sm:mb-4">
              <div className="absolute w-36 h-36 rounded-full bg-[#D8BB7B]/20 blur-3xl animate-pulse pointer-events-none" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#D8BB7B]/20 border-dashed absolute pointer-events-none"
              />
              
              <motion.div
                animate={{
                  scale: [0.96, 1.03, 0.96],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 flex items-center justify-center"
              >
                <img
                  src="/logo.png"
                  alt="Zanstoryteller Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-[0_4px_24px_rgba(216,187,123,0.5)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                />
              </motion.div>
            </div>

            {/* Massive Unifixz-Style Stroke Drawing SVG for ZANSTORYTELLER */}
            <div className="w-full flex items-center justify-center my-2 sm:my-4">
              <svg
                viewBox="0 0 916 84"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Zanstoryteller"
                className="w-[92vw] max-w-[1100px] h-auto select-none drop-shadow-[0_4px_28px_rgba(216,187,123,0.35)]"
              >
                <defs>
                  <linearGradient id="goldGradientStroke" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="16%" stopColor="#FFF5D8" />
                    <stop offset="45%" stopColor="#E5C788" />
                    <stop offset="75%" stopColor="#D8BB7B" />
                    <stop offset="100%" stopColor="#8C6520" />
                  </linearGradient>
                  <filter id="goldGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#D8BB7B" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Ghost Architectural Blueprint Guidelines */}
                {GHOST_BLUEPRINT_PATHS.map((d, idx) => (
                  <motion.path
                    key={`ghost-${idx}`}
                    d={d}
                    fill="none"
                    stroke="#D8BB7B"
                    strokeOpacity="0.2"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: idx * 0.04,
                    }}
                  />
                ))}

                {/* Main Stroke-Drawn Letters (Slow sequential reveal with rounded caps) */}
                {ZAN_LETTER_PATHS.map((letter, index) => (
                  <motion.path
                    key={letter.id}
                    d={letter.d}
                    fill="none"
                    stroke="url(#goldGradientStroke)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#goldGlowFilter)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      pathLength: {
                        duration: 0.85,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.08 + index * 0.075,
                      },
                      opacity: {
                        duration: 0.15,
                        delay: 0.08 + index * 0.075,
                      },
                    }}
                  />
                ))}
              </svg>
            </div>

            {/* Unifixz Signature 3 Animated Bouncing Dots (. . .) */}
            <div className="flex items-center justify-center gap-3 mt-3 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.35, 1, 0.35],
                    scale: [0.85, 1.35, 0.85],
                  }}
                  transition={{
                    duration: 0.85,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: 'easeInOut',
                  }}
                  className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#D8BB7B] shadow-[0_0_10px_rgba(216,187,123,0.9)]"
                />
              ))}
            </div>

            {/* Glowing Gold Progress Track */}
            <div className="w-64 sm:w-80 bg-white/10 h-[2px] rounded-full overflow-hidden relative border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8C6520] via-[#FFF2C8] to-[#D8BB7B] shadow-[0_0_14px_rgba(216,187,123,0.8)] transition-all duration-200 ease-out"
                style={{ width: `${Math.max(10, progress)}%` }}
              />
            </div>

            {/* Telemetry info */}
            <div className="flex items-center justify-between w-64 sm:w-80 text-[10px] font-mono tracking-widest text-white/40 uppercase pt-2.5">
              <span className="text-white/50">Initializing Optics</span>
              <span className="text-[#D8BB7B] font-semibold">{String(Math.round(progress)).padStart(2, '0')}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * HeroSection Component
 * Master scroll container with 420vh track, sticky 100vh viewport,
 * cinematic HTML5 canvas sequence, narrative text overlays, and telemetry HUD.
 */
export default function HeroSection() {
  const containerRef = useRef(null)
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState(1)
  const [modeLabel, setModeLabel] = useState('Optical Assembly')
  const [initialProgress, setInitialProgress] = useState(0)
  const [isInitialReady, setIsInitialReady] = useState(false)

  // Track scroll progress strictly within this 420vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Preload initial burst immediately on mount with 28 frames and smooth pacing
  useEffect(() => {
    let isMounted = true
    const startTime = Date.now()
    const MIN_LOADER_TIME = 2800 // Ensures complete slow stroke-draw choreography of every letter

    frameCacheManager.preloadInitial(28, (pct) => {
      if (isMounted) setInitialProgress(pct)
    }).then(() => {
      if (isMounted) {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, MIN_LOADER_TIME - elapsed)
        setInitialProgress(100)
        setTimeout(() => {
          if (isMounted) setIsInitialReady(true)
        }, remaining + 250)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  // Callback from canvas RAF loop for frame & stage telemetry
  const handleFrameUpdate = useCallback((frameIdx, progress) => {
    setCurrentFrameDisplay(frameIdx + 1)

    if (progress < 0.16) {
      setModeLabel('Optical Assembly')
    } else if (progress >= 0.16 && progress < 0.65) {
      setModeLabel('Deconstruction Stage')
    } else if (progress >= 0.65 && progress < 0.82) {
      setModeLabel('Full Mechanical Explosion')
    } else if (progress >= 0.82 && progress < 0.94) {
      setModeLabel('Precision Reassembly')
    } else {
      setModeLabel('Optics Sealed')
    }
  }, [])

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full bg-[#020202] text-white selection:bg-white/20"
      style={{
        height: '420vh',
      }}
    >
      {/* Sticky Viewport: Confines Canvas, Overlays, and HUD strictly to the Hero */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Minimal Initial Loader */}
        <MinimalExperienceLoader
          progress={initialProgress}
          isReady={isInitialReady}
        />

        {/* HTML5 Canvas Scrollytelling Sequence */}
        <ScrollImageSequence
          scrollYProgress={scrollYProgress}
          onFrameUpdate={handleFrameUpdate}
        />

        {/* Interactive Scroll-Accelerated Small Dots Particle Field (like unifixz.com) */}
        <ScrollParticleField scrollYProgress={scrollYProgress} />

        {/* Cinematic Text Overlays with smooth bottom-to-top letter entrance */}
        <HeroTextOverlay
          scrollYProgress={scrollYProgress}
          isReady={isInitialReady}
        />

        {/* Cinematic Bottom Stage & Scroll Indicator (matching Screenshot 4: SCROLL ——— 01 / 03) */}
        <BottomScrollStageIndicator
          scrollYProgress={scrollYProgress}
          isReady={isInitialReady}
        />
      </div>
    </section>
  )
}
