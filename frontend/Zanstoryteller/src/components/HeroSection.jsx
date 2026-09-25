import React, { useRef, useState, useEffect } from 'react'
import { useScroll } from 'framer-motion'
import ScrollSequence from './ScrollSequence'
import HeroTextOverlay from './HeroTextOverlay'
import { TOTAL_FRAMES, getFrameIndexFromProgress } from '../utils/frameLoader'
import { Camera } from 'lucide-react'

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

        {/* Bottom Technical HUD (absolute inside sticky viewport) */}
        <div className="absolute bottom-6 left-6 sm:left-10 z-30 pointer-events-none hidden sm:flex items-center gap-4 text-[11px] font-mono tracking-widest text-white/40 uppercase">
          <div className="flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-white/50" />
            <span>EOS R ARCHITECTURE</span>
          </div>
          <span>/</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white/70">
              FRAME {String(currentFrameDisplay).padStart(2, '0')}
            </span>
            <span>/</span>
            <span>{String(TOTAL_FRAMES).padStart(2, '0')}</span>
          </div>
          <span>/</span>
          <span className="text-white/60">{modeLabel}</span>
        </div>
      </div>
    </section>
  )
}
