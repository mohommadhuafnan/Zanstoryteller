import React, { useState, useEffect } from 'react'
import { motion, useTransform } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

/**
 * Smooth typewriter effect for the hero headline.
 * Specifically animates "timeless stories." smoothly on the same line,
 * preventing any line breaks or layout jumping.
 */
const HERO_PHRASES = [
  "timeless stories.",
  "unforgettable memories.",
  "authentic emotions.",
]

function TypewriterHeroText() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const currentTarget = HERO_PHRASES[phraseIdx]
  const [displayText, setDisplayText] = useState(currentTarget)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(true)

  useEffect(() => {
    let timer

    if (isPaused) {
      // Pause so the reader can comfortably read the completed phrase
      timer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 3200)
      return () => clearTimeout(timer)
    }

    if (!isDeleting) {
      // Smooth forward typing
      if (displayText.length < currentTarget.length) {
        timer = setTimeout(() => {
          setDisplayText(currentTarget.slice(0, displayText.length + 1))
        }, 70)
      } else {
        setIsPaused(true)
      }
    } else {
      // Smooth backward deleting
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentTarget.slice(0, displayText.length - 1))
        }, 30)
      } else {
        // Cycle to next phrase
        timer = setTimeout(() => {
          setPhraseIdx((prev) => (prev + 1) % HERO_PHRASES.length)
          setIsDeleting(false)
        }, 280)
      }
    }

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, isPaused, phraseIdx, currentTarget])

  return (
    <span className="inline-flex items-baseline">
      <span>{displayText || "\u00A0"}</span>
      <span className="inline-block w-[2px] sm:w-[2.5px] h-[0.82em] bg-white/90 animate-pulse ml-1 align-baseline" />
    </span>
  )
}

/**
 * AnimatedLetters Component
 * Staggers every letter smoothly upwards from bottom to top (y: distance -> 0, opacity: 0 -> 1)
 * Groups characters into words with whitespace-nowrap spans to preserve typography, kerning, and line wraps.
 */
function AnimatedLetters({
  text,
  isReady,
  baseDelay = 0.35,
  stagger = 0.024,
  yDistance = 38,
  duration = 0.85,
  letterClassName = '',
  wordClassName = '',
}) {
  const words = text.split(' ')
  let runningCharCount = 0

  return (
    <>
      {words.map((word, wordIdx) => {
        const wordChars = word.split('')
        const wordStartIdx = runningCharCount
        runningCharCount += wordChars.length

        return (
          <span
            key={wordIdx}
            className={`inline-block whitespace-nowrap ${wordClassName}`}
          >
            {wordChars.map((char, charIdx) => {
              const globalIdx = wordStartIdx + charIdx
              return (
                <motion.span
                  key={charIdx}
                  initial={{ opacity: 0, y: yDistance }}
                  animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: yDistance }}
                  transition={{
                    duration: duration,
                    delay: baseDelay + globalIdx * stagger,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block ${letterClassName}`}
                >
                  {char}
                </motion.span>
              )
            })}
          </span>
        )
      })}
    </>
  )
}

/**
 * Text overlays strictly synchronized to scroll progress.
 * Each section is mathematically clamped and has dynamic display toggling
 * to ensure ZERO text ghosting, bleeding, or overlapping between scroll stages.
 */
export default function HeroTextOverlay({ scrollYProgress, isReady = true }) {
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
  const s2X = useTransform(scrollYProgress, (p) => {
    if (p < 0.23) return (p - 0.23) * 80
    if (p > 0.33) return -(p - 0.33) * 80
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
  const s3X = useTransform(scrollYProgress, (p) => {
    if (p < 0.49) return -(p - 0.49) * 80
    if (p > 0.57) return (p - 0.57) * 80
    return 0
  })
  const s3Display = useTransform(scrollYProgress, (p) =>
    p >= 0.43 && p <= 0.63 ? 'flex' : 'none'
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
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
      >
        {/* Subtle ambient backlight glow matching unifixz */}
        <div
          className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_75%_55%_at_50%_48%,rgba(28,170,179,0.18)_0%,rgba(12,138,146,0.06)_45%,transparent_70%)]"
          aria-hidden="true"
        />

        {/* Headline with exact styling and smooth bottom-to-top letter reveals */}
        <h1 className="flex flex-col items-center text-center max-w-5xl">
          {/* Screenshot 1 style: Clean, light, tracked geometric uppercase sans */}
          <span className="block font-['Outfit',sans-serif] text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.16em] sm:tracking-[0.18em] text-white/95 uppercase leading-snug">
            <AnimatedLetters
              text="WE CAPTURE THE MOMENTS"
              isReady={isReady}
              baseDelay={0.34}
              stagger={0.022}
              yDistance={36}
              duration={0.85}
              wordClassName="mr-[0.28em] last:mr-0"
            />
          </span>

          {/* Screenshot 2 & Logo style: Ultra-bold gold gradient with shadow & bottom-to-top letter cascade */}
          <span className="block font-['Outfit',sans-serif] text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[104px] font-extrabold tracking-[-0.04em] leading-[0.92] mt-3 uppercase select-none filter drop-shadow-[0_4px_24px_rgba(216,187,123,0.45)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            <AnimatedLetters
              text="THAT BECOME"
              isReady={isReady}
              baseDelay={0.68}
              stagger={0.035}
              yDistance={48}
              duration={0.95}
              wordClassName="mr-[0.22em] last:mr-0"
              letterClassName="bg-gradient-to-b from-[#FFF2C8] via-[#D8BB7B] to-[#8C6520] bg-clip-text text-transparent"
            />
          </span>

          {/* Elegant italic typewriter phrase - smooth entrance from bottom */}
          <motion.span
            initial={{ opacity: 0, y: 32 }}
            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="block font-serif italic font-normal text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white/95 lowercase tracking-normal mt-3 sm:mt-4"
          >
            <TypewriterHeroText />
          </motion.span>
        </h1>

        {/* Subtitle - smooth slide from bottom */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, delay: 1.20, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-sm sm:text-base md:text-lg text-white/70 font-light max-w-xl tracking-wide leading-relaxed"
        >
          Cinematic photography turning authentic moments into enduring art.
        </motion.p>

      </motion.div>

      {/* ------------------------------------------------------- */}
      {/* STAGE 2: STORY BEGINS (Left Side on both Mobile & Desktop) */}
      {/* ------------------------------------------------------- */}
      <motion.div
        style={{ opacity: s2Opacity, y: s2Y, x: s2X, display: s2Display }}
        className="absolute top-1/2 -translate-y-1/2 left-4 xs:left-6 sm:left-14 md:left-24 max-w-[280px] xs:max-w-xs sm:max-w-md md:max-w-lg text-left pointer-events-none"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs sm:text-[11px] font-mono tracking-[0.25em] text-[#1caab3] uppercase">
            01 / Narrative Origin
          </span>
          <span className="w-8 h-[1px] bg-[#1caab3]/40" />
        </div>

        <h2 className="font-['Outfit',sans-serif] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-white uppercase leading-[1.04] mb-3 sm:mb-4">
          <span className="bg-gradient-to-b from-white via-white/95 to-white/60 bg-clip-text text-transparent">EVERY MOMENT</span> <br />
          <span className="font-light tracking-[0.06em] text-white/80">Has A Story.</span>
        </h2>

        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-white/75 font-light leading-relaxed max-w-md">
          From quiet details to unforgettable celebrations, we capture the moments that matter with unyielding clarity and emotional resonance.
        </p>

        <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-white/50 tracking-wider">
          <span>35mm Full-Frame Sensor</span>
          <span>•</span>
          <span>Optical Separation</span>
        </div>
      </motion.div>

      {/* ------------------------------------------------------- */}
      {/* STAGE 3: THE CRAFT (Right Side on both Mobile & Desktop) */}
      {/* ------------------------------------------------------- */}
      <motion.div
        style={{ opacity: s3Opacity, y: s3Y, x: s3X, display: s3Display }}
        className="absolute top-1/2 -translate-y-1/2 right-4 xs:right-6 sm:right-14 md:right-24 max-w-[280px] xs:max-w-xs sm:max-w-md md:max-w-lg text-right flex flex-col items-end pointer-events-none"
      >
        <div className="flex items-center justify-end gap-2 mb-3">
          <span className="w-8 h-[1px] bg-[#1caab3]/40" />
          <span className="text-xs sm:text-[11px] font-mono tracking-[0.25em] text-[#1caab3] uppercase">
            02 / Precision Optics
          </span>
        </div>

        <h2 className="font-['Outfit',sans-serif] text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-white uppercase leading-[1.04] mb-3 sm:mb-4 text-right">
          <span className="bg-gradient-to-b from-white via-white/95 to-white/60 bg-clip-text text-transparent">BEHIND EVERY FRAME</span> <br />
          <span className="font-light tracking-[0.06em] text-white/80">Is A Story.</span>
        </h2>

        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-white/75 font-light leading-relaxed max-w-md text-right ml-auto">
          We combine creativity, composition, and precision attention to detail to create photographs that feel authentic, timeless, and profound.
        </p>

        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-end gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-white/50 tracking-wider text-right">
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
        <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#1caab3]" />
          <span className="text-[11px] sm:text-[10px] font-mono tracking-[0.3em] uppercase text-white/80">
            The Art Of Seeing
          </span>
        </div>

        <h2 className="font-['Outfit',sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-[-0.04em] uppercase leading-[0.95] mb-5 bg-gradient-to-b from-white via-white/95 to-white/55 bg-clip-text text-transparent">
          MORE THAN <br />
          A PHOTOGRAPH.
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
          <span className="w-1.5 h-1.5 rounded-full bg-[#1caab3]" />
          <span className="text-xs sm:text-[11px] font-mono tracking-[0.35em] uppercase text-white/75">
            Zanstoryteller
          </span>
        </div>

        <h2 className="font-['Outfit',sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-[-0.04em] uppercase leading-[0.92] mb-5">
          <span className="bg-gradient-to-b from-white via-white/95 to-white/55 bg-clip-text text-transparent">YOUR STORY.</span> <br />
          <span className="font-serif italic font-normal text-white/95 lowercase tracking-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
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
