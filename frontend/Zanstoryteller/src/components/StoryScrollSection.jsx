import React, { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import img1 from '../assets/scrolling/scroll_01.webp'
import img2 from '../assets/scrolling/scroll_02.webp'
import img3 from '../assets/scrolling/scroll_03.webp'
import img4 from '../assets/scrolling/scroll_04.webp'
import img5 from '../assets/scrolling/scroll_05.webp'

const SCROLL_IMAGES = [
  { id: 'scroll-1', src: img1, alt: 'Editorial Moment 01' },
  { id: 'scroll-2', src: img2, alt: 'Editorial Moment 02' },
  { id: 'scroll-3', src: img3, alt: 'Editorial Moment 03' },
  { id: 'scroll-4', src: img4, alt: 'Editorial Moment 04' },
  { id: 'scroll-5', src: img5, alt: 'Editorial Moment 05' },
]

import { useCMS } from '../context/CMSContext'

/**
 * StoryScrollSection:
 * Full-screen, borderless, textless, shadow-free scrollytelling experience.
 * Each image rises smoothly from bottom to top (translateY: 100% -> 0%) over the previous one
 * as the user scrolls down, paired with an attractive continuous cinematic zoom-in animation.
 */
export default function StoryScrollSection() {
  const { data } = useCMS()
  const containerRef = useRef(null)

  const steps = data?.storyScrollSteps || []
  const scrollImages = SCROLL_IMAGES.map((def, idx) => {
    const cmsImg = steps[idx]?.image
    return {
      id: def.id,
      src: cmsImg || def.src,
      alt: steps[idx]?.keyword || def.alt
    }
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Preload all scroll images into browser cache immediately for zero-lag playback
  useEffect(() => {
    scrollImages.forEach((item) => {
      if (item.src) {
        const img = new Image()
        img.src = item.src
      }
    })
  }, [scrollImages])

  // -----------------------------------------------------------------
  // LAYER 0: Image 1 (Base frame, zooms in while active)
  // -----------------------------------------------------------------
  const scale0 = useTransform(scrollYProgress, [0.0, 0.28], [1.0, 1.09])
  const opacity0 = useTransform(scrollYProgress, (p) => (p > 0.30 ? 0 : 1))

  // -----------------------------------------------------------------
  // LAYER 1: Image 2 (Rises bottom-to-top from 0.16 to 0.28, zooms in)
  // -----------------------------------------------------------------
  const y1 = useTransform(scrollYProgress, [0.16, 0.28], ['100%', '0%'])
  const scale1 = useTransform(scrollYProgress, [0.16, 0.50], [1.0, 1.09])
  const opacity1 = useTransform(scrollYProgress, (p) => (p < 0.15 || p > 0.52 ? 0 : 1))

  // -----------------------------------------------------------------
  // LAYER 2: Image 3 (Rises bottom-to-top from 0.38 to 0.50, zooms in)
  // -----------------------------------------------------------------
  const y2 = useTransform(scrollYProgress, [0.38, 0.50], ['100%', '0%'])
  const scale2 = useTransform(scrollYProgress, [0.38, 0.72], [1.0, 1.09])
  const opacity2 = useTransform(scrollYProgress, (p) => (p < 0.37 || p > 0.74 ? 0 : 1))

  // -----------------------------------------------------------------
  // LAYER 3: Image 4 (Rises bottom-to-top from 0.60 to 0.72, zooms in)
  // -----------------------------------------------------------------
  const y3 = useTransform(scrollYProgress, [0.60, 0.72], ['100%', '0%'])
  const scale3 = useTransform(scrollYProgress, [0.60, 0.94], [1.0, 1.09])
  const opacity3 = useTransform(scrollYProgress, (p) => (p < 0.59 || p > 0.96 ? 0 : 1))

  // -----------------------------------------------------------------
  // LAYER 4: Image 5 (Royal Chess Room, rises from 0.82 to 0.94, zooms in)
  // -----------------------------------------------------------------
  const y4 = useTransform(scrollYProgress, [0.82, 0.94], ['100%', '0%'])
  const scale4 = useTransform(scrollYProgress, [0.82, 1.0], [1.0, 1.09])
  const opacity4 = useTransform(scrollYProgress, (p) => (p < 0.81 ? 0 : 1))

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className="relative w-full bg-[#050505] p-0 m-0 border-0"
      style={{ height: '500vh' }}
    >
      {/* Sticky Fullscreen Viewport - Edge-to-edge, Zero Borders, Zero Shadows, Zero Text */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden p-0 m-0 border-0">
        
        {/* Layer 0: Image 01 */}
        <motion.div
          style={{ opacity: opacity0 }}
          className="absolute inset-0 w-full h-full z-10 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform"
        >
          <motion.img
            style={{ scale: scale0 }}
            src={scrollImages[0].src}
            alt={scrollImages[0].alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center block p-0 m-0 border-0 select-none pointer-events-none transform-gpu will-change-transform"
          />
        </motion.div>

        {/* Layer 1: Image 02 */}
        <motion.div
          style={{ y: y1, opacity: opacity1 }}
          className="absolute inset-0 w-full h-full z-20 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform"
        >
          <motion.img
            style={{ scale: scale1 }}
            src={scrollImages[1].src}
            alt={scrollImages[1].alt}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center block p-0 m-0 border-0 select-none pointer-events-none transform-gpu will-change-transform"
          />
        </motion.div>

        {/* Layer 2: Image 03 */}
        <motion.div
          style={{ y: y2, opacity: opacity2 }}
          className="absolute inset-0 w-full h-full z-30 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform"
        >
          <motion.img
            style={{ scale: scale2 }}
            src={scrollImages[2].src}
            alt={scrollImages[2].alt}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center block p-0 m-0 border-0 select-none pointer-events-none transform-gpu will-change-transform"
          />
        </motion.div>

        {/* Layer 3: Image 04 */}
        <motion.div
          style={{ y: y3, opacity: opacity3 }}
          className="absolute inset-0 w-full h-full z-40 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform"
        >
          <motion.img
            style={{ scale: scale3 }}
            src={scrollImages[3].src}
            alt={scrollImages[3].alt}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center block p-0 m-0 border-0 select-none pointer-events-none transform-gpu will-change-transform"
          />
        </motion.div>

        {/* Layer 4: Image 05 (Royal Chess Lounge) */}
        <motion.div
          style={{ y: y4, opacity: opacity4 }}
          className="absolute inset-0 w-full h-full z-50 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform"
        >
          <motion.img
            style={{ scale: scale4 }}
            src={scrollImages[4].src}
            alt={scrollImages[4].alt}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center block p-0 m-0 border-0 select-none pointer-events-none transform-gpu will-change-transform"
          />
        </motion.div>

      </div>
    </section>
  )
}
