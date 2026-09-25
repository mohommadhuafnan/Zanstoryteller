import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { storyScrollSteps } from '../data/photographyData'
import { Sparkles } from 'lucide-react'

/**
 * Section 4: "The Story Behind The Frame"
 * A dedicated secondary editorial scrollytelling experience.
 * Features strictly isolated scroll stages with dynamic display: none
 * and mathematical opacity clamping to guarantee ZERO text ghosting or overlapping.
 */
export default function StoryScrollSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // -----------------------------------------------------------------
  // STAGE 0: Opening Title ("THE STORY BEHIND THE FRAME.")
  // Active ONLY at 0% to 12% scroll. Fades out immediately as user scrolls.
  // -----------------------------------------------------------------
  const titleOpacity = useTransform(scrollYProgress, (p) => {
    if (p <= 0.02) return 1
    if (p >= 0.10) return 0
    return Math.max(0, Math.min(1, 1 - (p - 0.02) / 0.08))
  })
  const titleY = useTransform(scrollYProgress, (p) => {
    if (p <= 0.02) return 0
    return -(p - 0.02) * 200
  })
  const titleDisplay = useTransform(scrollYProgress, (p) => (p <= 0.11 ? 'flex' : 'none'))

  // -----------------------------------------------------------------
  // STAGE 1: "LIGHT" (16% to 40% scroll)
  // -----------------------------------------------------------------
  const img1Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.12 || p > 0.44) return 0
    if (p >= 0.18 && p <= 0.38) return 1
    if (p < 0.18) return Math.max(0, Math.min(1, (p - 0.12) / 0.06))
    return Math.max(0, Math.min(1, 1 - (p - 0.38) / 0.06))
  })
  const text1Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.16 || p > 0.40) return 0
    if (p >= 0.22 && p <= 0.34) return 1
    if (p < 0.22) return Math.max(0, Math.min(1, (p - 0.16) / 0.06))
    return Math.max(0, Math.min(1, 1 - (p - 0.34) / 0.06))
  })
  const text1Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.22) return (0.22 - p) * 300
    if (p > 0.34) return -(p - 0.34) * 300
    return 0
  })
  const text1Display = useTransform(scrollYProgress, (p) =>
    p >= 0.15 && p <= 0.41 ? 'flex' : 'none'
  )

  // -----------------------------------------------------------------
  // STAGE 2: "EMOTION" (44% to 66% scroll)
  // -----------------------------------------------------------------
  const img2Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.40 || p > 0.70) return 0
    if (p >= 0.46 && p <= 0.64) return 1
    if (p < 0.46) return Math.max(0, Math.min(1, (p - 0.40) / 0.06))
    return Math.max(0, Math.min(1, 1 - (p - 0.64) / 0.06))
  })
  const text2Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.44 || p > 0.66) return 0
    if (p >= 0.49 && p <= 0.60) return 1
    if (p < 0.49) return Math.max(0, Math.min(1, (p - 0.44) / 0.05))
    return Math.max(0, Math.min(1, 1 - (p - 0.60) / 0.06))
  })
  const text2Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.49) return (0.49 - p) * 300
    if (p > 0.60) return -(p - 0.60) * 300
    return 0
  })
  const text2Display = useTransform(scrollYProgress, (p) =>
    p >= 0.43 && p <= 0.67 ? 'flex' : 'none'
  )

  // -----------------------------------------------------------------
  // STAGE 3: "DETAIL" (70% to 88% scroll)
  // -----------------------------------------------------------------
  const img3Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.66 || p > 0.96) return 0
    if (p >= 0.72 && p <= 0.90) return 1
    if (p < 0.72) return Math.max(0, Math.min(1, (p - 0.66) / 0.06))
    return Math.max(0, Math.min(1, 1 - (p - 0.90) / 0.06))
  })
  const text3Opacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.70 || p > 0.88) return 0
    if (p >= 0.74 && p <= 0.84) return 1
    if (p < 0.74) return Math.max(0, Math.min(1, (p - 0.70) / 0.04))
    return Math.max(0, Math.min(1, 1 - (p - 0.84) / 0.04))
  })
  const text3Y = useTransform(scrollYProgress, (p) => {
    if (p < 0.74) return (0.74 - p) * 300
    if (p > 0.84) return -(p - 0.84) * 300
    return 0
  })
  const text3Display = useTransform(scrollYProgress, (p) =>
    p >= 0.69 && p <= 0.89 ? 'flex' : 'none'
  )

  // -----------------------------------------------------------------
  // STAGE 4: CLIMAX ("EVERY FRAME HAS A FEELING.") (90% to 98% scroll)
  // -----------------------------------------------------------------
  const finalOpacity = useTransform(scrollYProgress, (p) => {
    if (p < 0.90 || p > 0.99) return 0
    if (p >= 0.94 && p <= 0.98) return 1
    if (p < 0.94) return Math.max(0, Math.min(1, (p - 0.90) / 0.04))
    return Math.max(0, Math.min(1, 1 - (p - 0.98) / 0.01))
  })
  const finalDisplay = useTransform(scrollYProgress, (p) =>
    p >= 0.89 && p <= 0.99 ? 'flex' : 'none'
  )

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className="relative w-full bg-[#050505] text-white"
      style={{ height: '340vh' }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Background Visual Layer: Cross-fading photography */}
        <div className="absolute inset-0 w-full h-full">
          {/* Default Dark Base */}
          <div className="absolute inset-0 bg-[#050505]" />

          {/* Photo 1: Light */}
          <motion.div
            style={{ opacity: img1Opacity }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={storyScrollSteps[0].image}
              alt={storyScrollSteps[0].alt}
              className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
              loading="lazy"
            />
          </motion.div>

          {/* Photo 2: Emotion */}
          <motion.div
            style={{ opacity: img2Opacity }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={storyScrollSteps[1].image}
              alt={storyScrollSteps[1].alt}
              className="w-full h-full object-cover filter brightness-[0.68] contrast-[1.05]"
              loading="lazy"
            />
          </motion.div>

          {/* Photo 3: Detail */}
          <motion.div
            style={{ opacity: img3Opacity }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={storyScrollSteps[2].image}
              alt={storyScrollSteps[2].alt}
              className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.05]"
              loading="lazy"
            />
          </motion.div>

          {/* Vignette & Gradient Overlays for Cinematic Readability */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050505_95%)] pointer-events-none" />
          <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        </div>

        {/* Narrative Text Overlays - Mutually Exclusive */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center pointer-events-none w-full h-full flex items-center justify-center">
          
          {/* Stage 0: Opening Statement ("THE STORY BEHIND THE FRAME.") */}
          <motion.div
            style={{ opacity: titleOpacity, y: titleY, display: titleDisplay }}
            className="absolute inset-0 flex flex-col items-center justify-center m-auto max-w-3xl"
          >
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/50 mb-4 block">
              Editorial Vision
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase leading-[1.08] mb-6">
              The Story <br />
              <span className="font-serif italic font-normal text-white/90 lowercase tracking-normal">behind</span> <br />
              The Frame.
            </h2>
            <div className="text-xs font-mono tracking-widest text-white/40 uppercase">
              Scroll To Unfold
            </div>
          </motion.div>

          {/* Step 1: LIGHT */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y, display: text1Display }}
            className="absolute inset-0 flex flex-col items-center justify-center m-auto max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 mb-3 text-[11px] font-mono tracking-[0.3em] text-white/60 uppercase">
              <span>01 / Atmospheric Element</span>
            </div>
            <h3 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-white uppercase mb-6">
              Light.
            </h3>
            <p className="text-base sm:text-xl text-white/80 font-light leading-relaxed">
              {storyScrollSteps[0].quote}
            </p>
          </motion.div>

          {/* Step 2: EMOTION */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y, display: text2Display }}
            className="absolute inset-0 flex flex-col items-center justify-center m-auto max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 mb-3 text-[11px] font-mono tracking-[0.3em] text-white/60 uppercase">
              <span>02 / The Core</span>
            </div>
            <h3 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-white uppercase mb-6">
              Emotion.
            </h3>
            <p className="text-base sm:text-xl text-white/80 font-light leading-relaxed">
              {storyScrollSteps[1].quote}
            </p>
          </motion.div>

          {/* Step 3: DETAIL */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y, display: text3Display }}
            className="absolute inset-0 flex flex-col items-center justify-center m-auto max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 mb-3 text-[11px] font-mono tracking-[0.3em] text-white/60 uppercase">
              <span>03 / Nuance</span>
            </div>
            <h3 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight text-white uppercase mb-6">
              Detail.
            </h3>
            <p className="text-base sm:text-xl text-white/80 font-light leading-relaxed">
              {storyScrollSteps[2].quote}
            </p>
          </motion.div>

          {/* Final Resolution */}
          <motion.div
            style={{ opacity: finalOpacity, display: finalDisplay }}
            className="absolute inset-0 flex flex-col items-center justify-center m-auto max-w-2xl"
          >
            <Sparkles className="w-6 h-6 text-white/60 mb-4 animate-pulse" />
            <h3 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white uppercase leading-[1.08] mb-6">
              Every Frame <br />
              <span className="font-serif italic font-normal text-white/95 lowercase tracking-normal">has a feeling.</span>
            </h3>
            <div className="text-[11px] font-mono tracking-[0.25em] text-white/50 uppercase">
              Zanstoryteller Creative Philosophy
            </div>
          </motion.div>

        </div>

        {/* Bottom Technical HUD Bar */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/35 uppercase pointer-events-none">
          <span>SCROLL NARRATIVE // ARCHIVAL STORY</span>
          <span className="hidden sm:inline">35MM FIXED FOCAL OPTICS</span>
        </div>

      </div>
    </section>
  )
}
