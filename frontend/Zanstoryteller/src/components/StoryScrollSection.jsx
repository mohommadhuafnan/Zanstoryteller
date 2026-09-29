import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import img01 from '../assets/scrolling/01.webp'
import img02 from '../assets/scrolling/02.webp'
import img03 from '../assets/scrolling/03.webp'
import img04 from '../assets/scrolling/04.webp'

/**
 * Section: Client Portfolio Scrollytelling Showcase
 * Displays the 4 high-resolution client presentation collage boards
 * from src/assets/scrolling in true edge-to-edge FULL SCREEN mode
 * without cropping any part of the images, with zero text overlays,
 * zero dark tint layers, and smooth cinematic depth-scaling scroll animation.
 */
export default function StoryScrollSection() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!scrollYProgress) return
    return scrollYProgress.on('change', (p) => {
      if (p < 0.25) {
        setActiveIndex(0)
      } else if (p < 0.50) {
        setActiveIndex(1)
      } else if (p < 0.75) {
        setActiveIndex(2)
      } else {
        setActiveIndex(3)
      }
    })
  }, [scrollYProgress])

  // -----------------------------------------------------------------
  // Slide 0: Client Board 01 (Culinary & Lifestyle)
  // Active from 0.00 to 0.27
  // -----------------------------------------------------------------
  const opacity0 = useTransform(scrollYProgress, (p) => {
    if (p <= 0.20) return 1
    if (p >= 0.27) return 0
    return Math.max(0, Math.min(1, 1 - (p - 0.20) / 0.07))
  })
  const scale0 = useTransform(scrollYProgress, (p) => {
    if (p <= 0.20) return 1
    if (p >= 0.27) return 1.025
    return 1 + ((p - 0.20) / 0.07) * 0.025
  })
  const y0 = useTransform(scrollYProgress, (p) => {
    if (p <= 0.20) return 0
    if (p >= 0.27) return -15
    return -((p - 0.20) / 0.07) * 15
  })
  const display0 = useTransform(scrollYProgress, (p) => (p <= 0.28 ? 'flex' : 'none'))

  // -----------------------------------------------------------------
  // Slide 1: Client Board 02 (Luxury Architecture & Interiors)
  // Active from 0.20 to 0.54
  // -----------------------------------------------------------------
  const opacity1 = useTransform(scrollYProgress, (p) => {
    if (p < 0.20 || p > 0.54) return 0
    if (p >= 0.27 && p <= 0.47) return 1
    if (p < 0.27) return Math.max(0, Math.min(1, (p - 0.20) / 0.07))
    return Math.max(0, Math.min(1, 1 - (p - 0.47) / 0.07))
  })
  const scale1 = useTransform(scrollYProgress, (p) => {
    if (p < 0.27) return 0.97 + ((p - 0.20) / 0.07) * 0.03
    if (p <= 0.47) return 1
    return 1 + ((p - 0.47) / 0.07) * 0.025
  })
  const y1 = useTransform(scrollYProgress, (p) => {
    if (p < 0.27) return 15 - ((p - 0.20) / 0.07) * 15
    if (p <= 0.47) return 0
    return -((p - 0.47) / 0.07) * 15
  })
  const display1 = useTransform(scrollYProgress, (p) => (p >= 0.19 && p <= 0.55 ? 'flex' : 'none'))

  // -----------------------------------------------------------------
  // Slide 2: Client Board 03 (Commercial FIFA World Cup Visa Pavilion)
  // Active from 0.47 to 0.81
  // -----------------------------------------------------------------
  const opacity2 = useTransform(scrollYProgress, (p) => {
    if (p < 0.47 || p > 0.81) return 0
    if (p >= 0.54 && p <= 0.74) return 1
    if (p < 0.54) return Math.max(0, Math.min(1, (p - 0.47) / 0.07))
    return Math.max(0, Math.min(1, 1 - (p - 0.74) / 0.07))
  })
  const scale2 = useTransform(scrollYProgress, (p) => {
    if (p < 0.54) return 0.97 + ((p - 0.47) / 0.07) * 0.03
    if (p <= 0.74) return 1
    return 1 + ((p - 0.74) / 0.07) * 0.025
  })
  const y2 = useTransform(scrollYProgress, (p) => {
    if (p < 0.54) return 15 - ((p - 0.47) / 0.07) * 15
    if (p <= 0.74) return 0
    return -((p - 0.74) / 0.07) * 15
  })
  const display2 = useTransform(scrollYProgress, (p) => (p >= 0.46 && p <= 0.82 ? 'flex' : 'none'))

  // -----------------------------------------------------------------
  // Slide 3: Client Board 04 (Qatar Cultural & Stadium Celebration)
  // Active from 0.74 to 1.00
  // -----------------------------------------------------------------
  const opacity3 = useTransform(scrollYProgress, (p) => {
    if (p < 0.74) return 0
    if (p >= 0.81) return 1
    return Math.max(0, Math.min(1, (p - 0.74) / 0.07))
  })
  const scale3 = useTransform(scrollYProgress, (p) => {
    if (p < 0.81) return 0.97 + ((p - 0.74) / 0.07) * 0.03
    return 1
  })
  const y3 = useTransform(scrollYProgress, (p) => {
    if (p < 0.81) return 15 - ((p - 0.74) / 0.07) * 15
    return 0
  })
  const display3 = useTransform(scrollYProgress, (p) => (p >= 0.73 ? 'flex' : 'none'))

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className="relative w-full bg-[#050505] text-white"
      style={{ height: '400vh' }}
    >
      {/* Sticky Full-Screen Viewport Container: Edge-to-Edge */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Pure Dark Base Backdrop */}
        <div className="absolute inset-0 bg-[#050505]" />

        {/* Slide 0 - Full Screen, 100% Uncropped */}
        <motion.div
          style={{ opacity: opacity0, scale: scale0, y: y0, display: display0 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          <img
            src={img01}
            alt="Client Editorial Showcase 01"
            className="w-full h-full object-contain select-none pointer-events-auto"
            loading="eager"
            decoding="async"
          />
        </motion.div>

        {/* Slide 1 - Full Screen, 100% Uncropped */}
        <motion.div
          style={{ opacity: opacity1, scale: scale1, y: y1, display: display1 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          <img
            src={img02}
            alt="Client Editorial Showcase 02"
            className="w-full h-full object-contain select-none pointer-events-auto"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Slide 2 - Full Screen, 100% Uncropped */}
        <motion.div
          style={{ opacity: opacity2, scale: scale2, y: y2, display: display2 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          <img
            src={img03}
            alt="Client Editorial Showcase 03"
            className="w-full h-full object-contain select-none pointer-events-auto"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Slide 3 - Full Screen, 100% Uncropped */}
        <motion.div
          style={{ opacity: opacity3, scale: scale3, y: y3, display: display3 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          <img
            src={img04}
            alt="Client Editorial Showcase 04"
            className="w-full h-full object-contain select-none pointer-events-auto"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Minimalist 4-segment pagination indicator at the bottom (pure visual, 100% text-free) */}
        <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-20 flex items-center justify-center gap-2 sm:gap-2.5 pointer-events-none px-4">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                activeIndex === idx
                  ? 'w-10 sm:w-14 bg-[#D8BB7B] shadow-[0_0_10px_rgba(216,187,123,0.7)]'
                  : 'w-5 sm:w-7 bg-white/20'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
