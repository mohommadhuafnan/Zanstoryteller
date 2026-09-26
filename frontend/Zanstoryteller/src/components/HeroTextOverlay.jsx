import React, { useState, useEffect } from 'react'
import { motion, useTransform } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

/**
 * Smooth typewriter effect for the hero headline.
 * Specifically animates "timeless stories." smoothly on the same line,
 * preventing any line breaks or layout jumping.
 */
function TypewriterHeroText() {
  const targetText = "timeless stories."
  const [displayText, setDisplayText] = useState(targetText)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    let timer

    if (isPaused) {
      // Pause so the reader can comfortably read the completed phrase
      timer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 3600)
      return () => clearTimeout(timer)
    }

    if (!isDeleting) {
      // Smooth forward typing
      if (displayText.length < targetText.length) {
        timer = setTimeout(() => {
          setDisplayText(targetText.slice(0, displayText.length + 1))
        }, 75)
      } else {
        setIsPaused(true)
      }
    } else {
      // Smooth backward deleting
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(targetText.slice(0, displayText.length - 1))
        }, 35)
      } else {
        // Brief pause before retyping
        timer = setTimeout(() => {
          setIsDeleting(false)
        }, 350)
      }
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, isPaused])

  return (
    <span className="inline-flex items-baseline">
      <span>{displayText || "\u00A0"}</span>
      <span className="inline-block w-[2px] sm:w-[2.5px] h-[0.82em] bg-white/90 animate-pulse ml-1 align-baseline" />
    </span>
  )
}

/**
 * Text overlays strictly synchronized to scroll progress.
 * Each section is mathematically clamped and has dynamic display toggling
 * to ensure ZERO text ghosting, bleeding, or overlapping between scroll stages.
 */
export default function HeroTextOverlay({ scrollYProgress }) {
  // -------------------------------------------------------------
  // STAGE 1: 0% - 11% (Opening)
  // Cleanly fades out as soon as the user begins scrolling.
  // -------------------------------------------------------------
  const s1Opacity = useTransform(scrollYProgress, (p) => {
    if (p <= 0.02) return 1
    if (p >= 0.10) return 0
    return Math.max(0, Math.min(1, 1 - (p - 0.02) / 0.08))
  })
  const s1Y = useTransform(scrollYProgress, (p) => {
    if (p <= 0.02) return 0
    return -(p - 0.02) * 200
  })
  const s1Display = useTransform(scrollYProgress, (p) => (p <= 0.11 ? 'flex' : 'none'))

  // -------------------------------------------------------------
  // STAGE 2: 18% - 38% (Left: Story Begins)
  // Camera parts start separating.
  // -------------------------------------------------------------
  const s2Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.18 || p > 0.38) return 0
    if (p >= 0.23 && p <= 0.33) return 1
    if (p < 0.23) return Math.max(0, Math.min(1, (p - 0.18) / 0.05))
    return Math.max(0, Math.min(1, 1 - (p - 0.33) / 0.05))
  })
  const s2Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.23) return (0.23 - p) * 300
    if (p > 0.33) return -(p - 0.33) * 300
    return 0
  })
  const s2Display = useTransform(scrollYProgress, (p) =>
    p >= 0.17 && p <= 0.39 ? 'block' : 'none'
  )

  // -------------------------------------------------------------
  // STAGE 3: 44% - 62% (Right: The Craft)
  // Components increasingly exploded.
  // -------------------------------------------------------------
  const s3Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.44 || p > 0.62) return 0
    if (p >= 0.49 && p <= 0.57) return 1
    if (p < 0.49) return Math.max(0, Math.min(1, (p - 0.44) / 0.05))
    return Math.max(0, Math.min(1, 1 - (p - 0.57) / 0.05))
  })
  const s3Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.49) return (0.49 - p) * 300
    if (p > 0.57) return -(p - 0.57) * 300
    return 0
  })
  const s3Display = useTransform(scrollYProgress, (p) =>
    p >= 0.43 && p <= 0.63 ? 'block' : 'none'
  )

  // -------------------------------------------------------------
  // STAGE 4: 66% - 80% (Center: Full Explosion / The Art of Seeing)
  // Camera reaches full mechanical explosion.
  // -------------------------------------------------------------
  const s4Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.66 || p > 0.80) return 0
    if (p >= 0.70 && p <= 0.76) return 1
    if (p < 0.70) return Math.max(0, Math.min(1, (p - 0.66) / 0.04))
    return Math.max(0, Math.min(1, 1 - (p - 0.76) / 0.04))
  })
  const s4Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.70) return (0.70 - p) * 300
    if (p > 0.76) return -(p - 0.76) * 300
    return 0
  })
  const s4Display = useTransform(scrollYProgress, (p) =>
    p >= 0.65 && p <= 0.81 ? 'flex' : 'none'
  )

  // -------------------------------------------------------------
  // STAGE 5: 86% - 98% (Center: Final Brand Message & CTAs)
  // Camera reassembles into fully sealed state.
  // Strictly confined to the hero section.
  // -------------------------------------------------------------
  const s5Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.86 || p > 0.99) return 0
    if (p >= 0.92 && p <= 0.98) return 1
    if (p < 0.92) return Math.max(0, Math.min(1, (p - 0.86) / 0.06))
    return Math.max(0, Math.min(1, 1 - (p - 0.98) / 0.01))
  })
  const s5Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.92) return (0.92 - p) * 200
    return 0
  })
  const s5Display = useTransform(scrollYProgress, (p) => (p >= 0.85 && p <= 0.99 ? 'flex' : 'none'))

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* ------------------------------------------------------- */}
      {/* STAGE 1: OPENING (Center) */}
      {/* ------------------------------------------------------- */}
      <motion.div
        style={{ opacity: s1Opacity, y: s1Y, display: s1Display }}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/70">
            Zanstoryteller
          </span>
        </div>

        {/* Headline utilizing more space with balanced lines + Typewriter effect */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-light tracking-tight text-white uppercase leading-[1.12] mb-6 max-w-5xl">
          <span className="block">WE CAPTURE THE MOMENTS</span>
          <span className="block sm:whitespace-nowrap">
            THAT BECOME{' '}
            <span className="font-serif italic font-normal text-white/95 lowercase tracking-normal inline-block">
              <TypewriterHeroText />
            </span>
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/70 font-light max-w-lg tracking-wide leading-relaxed">
          Cinematic photography turning authentic moments into enduring art.
        </p>

        {/* Scroll Prompt */}
        <div className="mt-10 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[11px] sm:text-xs font-mono tracking-[0.25em] uppercase">
            Scroll to Explore
          </span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 bg-white/70 rounded-full animate-bounce" />
          </div>
        </div>
      </motion.div>

      {/* ------------------------------------------------------- */}
      {/* STAGE 2: STORY BEGINS (Left Side) */}
      {/* ------------------------------------------------------- */}
      <motion.div
        style={{ opacity: s2Opacity, y: s2Y, display: s2Display }}
        className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-14 md:left-24 max-w-lg text-left"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs sm:text-[11px] font-mono tracking-[0.25em] text-white/60 uppercase">
            01 / Narrative Origin
          </span>
          <span className="w-8 h-[1px] bg-white/20" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white uppercase leading-[1.1] mb-4">
          Every Moment <br />
          <span className="text-white/80">Has A Story.</span>
        </h2>

        <p className="text-base sm:text-lg text-white/75 font-light leading-relaxed max-w-md">
          From quiet details to unforgettable celebrations, we capture the moments that matter with unyielding clarity and emotional resonance.
        </p>

        <div className="mt-6 flex items-center gap-3 sm:gap-4 text-xs sm:text-[11px] font-mono text-white/50 tracking-wider">
          <span>35mm Full-Frame Sensor</span>
          <span>•</span>
          <span>Optical Separation</span>
        </div>
      </motion.div>

      {/* ------------------------------------------------------- */}
      {/* STAGE 3: THE CRAFT (Right Side) */}
      {/* ------------------------------------------------------- */}
      <motion.div
        style={{ opacity: s3Opacity, y: s3Y, display: s3Display }}
        className="absolute top-1/2 -translate-y-1/2 right-6 sm:right-14 md:right-24 max-w-lg text-left md:text-right"
      >
        <div className="flex items-center md:justify-end gap-2 mb-3">
          <span className="w-8 h-[1px] bg-white/20 hidden md:block" />
          <span className="text-xs sm:text-[11px] font-mono tracking-[0.25em] text-white/60 uppercase">
            02 / Precision Optics
          </span>
          <span className="w-8 h-[1px] bg-white/20 md:hidden" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white uppercase leading-[1.1] mb-4">
          Behind <br />
          Every Frame <br />
          <span className="text-white/80">Is A Story.</span>
        </h2>

        <p className="text-base sm:text-lg text-white/75 font-light leading-relaxed max-w-md ml-auto">
          We combine creativity, composition, and precision attention to detail to create photographs that feel authentic, timeless, and profound.
        </p>

        <div className="mt-6 flex items-center md:justify-end gap-3 sm:gap-4 text-xs sm:text-[11px] font-mono text-white/50 tracking-wider">
          <span>Multi-Coated Glass</span>
          <span>•</span>
          <span>Mechanical Precision</span>
        </div>
      </motion.div>

      {/* ------------------------------------------------------- */}
      {/* STAGE 4: FULL EXPLOSION (Center) */}
      {/* ------------------------------------------------------- */}
      <motion.div
        style={{ opacity: s4Opacity, y: s4Y, display: s4Display }}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
          <Sparkles className="w-3.5 h-3.5 text-white/60" />
          <span className="text-[11px] sm:text-[10px] font-mono tracking-[0.3em] uppercase text-white/70">
            The Art Of Seeing
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white uppercase leading-[1.06] mb-4">
          More Than <br />
          A Photograph.
        </h2>

        <div className="space-y-1.5 text-base sm:text-lg md:text-xl text-white/75 font-light tracking-wide">
          <p>A moment.</p>
          <p>A feeling.</p>
          <p className="text-white/95 font-normal">A memory worth keeping.</p>
        </div>

        <div className="mt-6 flex items-center gap-4 text-xs sm:text-xs font-mono text-white/45 tracking-widest uppercase">
          <span>Exploded Component View</span>
          <span>//</span>
          <span>Optical Architecture Exposed</span>
        </div>
      </motion.div>

      {/* ------------------------------------------------------- */}
      {/* STAGE 5: FINAL BRAND MESSAGE & CTA (Center) */}
      {/* ------------------------------------------------------- */}
      <motion.div
        style={{ opacity: s5Opacity, y: s5Y, display: s5Display }}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span className="text-xs sm:text-[11px] font-mono tracking-[0.35em] uppercase text-white/75">
            Zanstoryteller
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white uppercase leading-[1.04] mb-5">
          Your Story. <br />
          <span className="font-serif italic font-normal text-white/95 lowercase tracking-normal">
            our lens.
          </span>
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light max-w-lg mb-8 leading-relaxed">
          Let us turn your moments into memories that last.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#portfolio"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] w-full sm:w-auto"
            role="button"
          >
            <span>Explore Our Work</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-white/25 hover:border-white text-white font-mono text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 hover:bg-white/[0.05] w-full sm:w-auto"
            role="button"
          >
            <span>Get In Touch</span>
          </a>
        </div>

        <div className="mt-12 text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase">
          Available Worldwide • Editorial & Documentary Photography
        </div>
      </motion.div>
    </div>
  )
}
