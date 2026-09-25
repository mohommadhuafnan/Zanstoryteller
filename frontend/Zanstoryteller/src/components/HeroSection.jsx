import React, { useRef, useState, useEffect } from 'react'
import { useScroll } from 'framer-motion'
import ScrollSequence from './ScrollSequence'
import HeroTextOverlay from './HeroTextOverlay'
import { TOTAL_FRAMES, getFrameIndexFromProgress } from '../utils/frameLoader'
import { Camera } from 'lucide-react'

/**
 * Dynamic Typewriter Technical HUD component.
 * Types out the camera architecture telemetry with a terminal typing effect,
 * pulsing cursor, and live sync with scroll state.
 */
function TypewriterHUD({ currentFrame, totalFrames, mode }) {
  const currentText = `EOS R ARCHITECTURE  /  FRAME ${String(currentFrame).padStart(2, '0')} / ${String(totalFrames).padStart(2, '0')}  /  ${mode.toUpperCase()}`
  
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const currentTextRef = useRef(currentText)
  currentTextRef.current = currentText

  // While in paused reading state, keep text live if user scrolls
  useEffect(() => {
    if (isPaused) {
      setDisplayText(currentText)
    }
  }, [currentText, isPaused])

  useEffect(() => {
    let timer

    if (isPaused) {
      // Pause for 4 seconds so the full line is easily readable
      timer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 4000)
      return () => clearTimeout(timer)
    }

    if (!isDeleting) {
      // Typing animation forward
      const target = currentTextRef.current
      if (displayText.length < target.length) {
        timer = setTimeout(() => {
          setDisplayText(target.slice(0, displayText.length + 1))
        }, 38)
      } else {
        // Reached end of text
        setIsPaused(true)
      }
    } else {
      // Deleting animation backward
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1))
        }, 18)
      } else {
        // Fully deleted -> brief rest before retyping
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
 * Main Hero Section wrapping the scrollytelling experience.
 * Manages scroll timeline, canvas sequence synchronization, and metadata HUD.
 */
export default function HeroSection({ images, isLoaded }) {
  const containerRef = useRef(null)
  const [currentFrameDisplay, setCurrentFrameDisplay] = useState(1)
  const [modeLabel, setModeLabel] = useState('Optical Assembly')

  // Setup scroll progress tracking over container height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Track frame and phase for HUD display
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const frameFloat = getFrameIndexFromProgress(progress)
      const frameIdx = Math.round(frameFloat)
      setCurrentFrameDisplay(frameIdx + 1)

      if (progress < 0.15) {
        setModeLabel('Optical Assembly')
      } else if (progress >= 0.15 && progress < 0.65) {
        setModeLabel('Deconstruction Stage')
      } else if (progress >= 0.65 && progress < 0.80) {
        setModeLabel('Full Mechanical Explosion')
      } else if (progress >= 0.80 && progress < 0.92) {
        setModeLabel('Precision Reassembly')
      } else {
        setModeLabel('Optics Sealed')
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full bg-[#020202] text-white selection:bg-white/20"
      style={{
        height: '420vh',
      }}
    >
      {/* Sticky Hero Viewport: confines Canvas, Overlays, and HUD strictly to the Hero section */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Canvas Scrollytelling Sequence */}
        <ScrollSequence
          images={images}
          scrollYProgress={scrollYProgress}
          isLoaded={isLoaded}
        />

        {/* Cinematic Text Narrative Overlays (absolute inside sticky viewport) */}
        <HeroTextOverlay scrollYProgress={scrollYProgress} />

        {/* Bottom Technical HUD with Typing Animation */}
        <TypewriterHUD
          currentFrame={currentFrameDisplay}
          totalFrames={TOTAL_FRAMES}
          mode={modeLabel}
        />
      </div>
    </section>
  )
}
