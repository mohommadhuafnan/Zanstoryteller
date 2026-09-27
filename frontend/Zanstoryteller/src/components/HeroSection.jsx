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
 * Typewriter technical HUD telemetry display.
 * Types camera specifications, live frame index, and optical mode.
 */
function TypewriterHUD({ currentFrame, totalFrames, mode }) {
  const currentText = `EOS R ARCHITECTURE  /  FRAME ${String(currentFrame).padStart(2, '0')} / ${String(totalFrames).padStart(2, '0')}  /  ${mode.toUpperCase()}`

  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const currentTextRef = useRef(currentText)
  currentTextRef.current = currentText

  useEffect(() => {
    if (isPaused) {
      setDisplayText(currentText)
    }
  }, [currentText, isPaused])

  useEffect(() => {
    let timer

    if (isPaused) {
      timer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 4000)
      return () => clearTimeout(timer)
    }

    if (!isDeleting) {
      const target = currentTextRef.current
      if (displayText.length < target.length) {
        timer = setTimeout(() => {
          setDisplayText(target.slice(0, displayText.length + 1))
        }, 36)
      } else {
        setIsPaused(true)
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1))
        }, 18)
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false)
        }, 500)
      }
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, isPaused])

  return (
    <div className="absolute bottom-6 left-6 sm:left-10 z-30 pointer-events-none hidden sm:flex items-center gap-2.5 text-[11px] font-mono tracking-widest text-white/50 uppercase">
      <Camera className="w-3.5 h-3.5 text-white/60 shrink-0" />
      <span className="text-white/70">
        {displayText}
        <span className="inline-block w-1.5 h-3.5 bg-white/80 animate-pulse ml-1 align-middle" />
      </span>
    </div>
  )
}

/**
 * Minimalist cinematic loading indicator
 * Only displays while the initial vital burst of frames loads (first 8-10 frames)
 * Fades out smoothly so user experience is never blocked.
 */
function MinimalExperienceLoader({ progress, isReady }) {
  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="minimal-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#020202] text-white px-6 pointer-events-auto"
        >
          <div className="flex flex-col items-center max-w-xs w-full text-center">
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-white/40 mb-3">
              Cinematic Experience
            </span>
            <h3 className="text-lg font-light tracking-[0.25em] uppercase text-white/90 mb-5">
              Loading Sequence
            </h3>

            {/* Minimal thin progress track */}
            <div className="w-full bg-white/10 h-[1.5px] rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-white transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[10px] font-mono tracking-widest text-white/40 uppercase pt-2.5">
              <span>Initializing Optics</span>
              <span>{String(progress).padStart(2, '0')}%</span>
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

  // Preload initial burst immediately on mount
  useEffect(() => {
    let isMounted = true

    frameCacheManager.preloadInitial(10, (pct) => {
      if (isMounted) setInitialProgress(pct)
    }).then(() => {
      if (isMounted) {
        setTimeout(() => {
          if (isMounted) setIsInitialReady(true)
        }, 300)
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
        <ScrollParticleField />

        {/* Cinematic Text Overlays */}
        <HeroTextOverlay scrollYProgress={scrollYProgress} />

        {/* Technical HUD with live frame counter */}
        <TypewriterHUD
          currentFrame={currentFrameDisplay}
          totalFrames={TOTAL_FRAMES}
          mode={modeLabel}
        />
      </div>
    </section>
  )
}
