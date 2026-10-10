import React, { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import { useCMS } from '../context/CMSContext'
import { getOptimizedImageUrl, getCloudinarySrcSet } from '../utils/imageOptimizer'

const CLOUD_SCROLL = 'https://res.cloudinary.com/dtpeeydfz/image/upload/f_webp,q_auto:good,w_1400'

const SCROLL_IMAGES = [
  { id: 'scroll-1', src: `${CLOUD_SCROLL}/v1791468136/zanstoryteller/scrolling/scroll_01.webp`, alt: 'Editorial Moment 01' },
  { id: 'scroll-2', src: `${CLOUD_SCROLL}/v1791468137/zanstoryteller/scrolling/scroll_02.webp`, alt: 'Editorial Moment 02' },
  { id: 'scroll-3', src: `${CLOUD_SCROLL}/v1791468139/zanstoryteller/scrolling/scroll_03.webp`, alt: 'Editorial Moment 03' },
  { id: 'scroll-4', src: `${CLOUD_SCROLL}/v1791468141/zanstoryteller/scrolling/scroll_04.webp`, alt: 'Editorial Moment 04' },
  { id: 'scroll-5', src: `${CLOUD_SCROLL}/v1791468144/zanstoryteller/scrolling/scroll_05.webp`, alt: 'Editorial Moment 05' },
]

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
      src: getOptimizedImageUrl(cmsImg || def.src, { width: 1400 }),
      srcSet: getCloudinarySrcSet(cmsImg || def.src, [800, 1200, 1600, 2000]),
      alt: steps[idx]?.keyword || def.alt
    }
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Preload scroll images only when approaching viewport to eliminate initial network blocking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          scrollImages.forEach((item) => {
            if (item.src) {
              const img = new Image()
              img.src = item.src
            }
          })
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
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
          className="absolute inset-0 w-full h-full z-10 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform flex items-center justify-center bg-[#020202]"
        >
          {/* Ambient blurred fill prevents letterboxing */}
          <img
            src={scrollImages[0].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center filter blur-3xl opacity-35 scale-110 pointer-events-none"
          />
          {/* 100% Full Uncropped Original Master Photograph */}
          <motion.img
            style={{ scale: scale0 }}
            src={scrollImages[0].src}
            srcSet={scrollImages[0].srcSet}
            sizes="100vw"
            alt={scrollImages[0].alt}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="relative z-10 max-w-full max-h-full w-full h-full object-contain object-center block p-0 m-0 select-none pointer-events-none transform-gpu will-change-transform drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          />
        </motion.div>

        {/* Layer 1: Image 02 */}
        <motion.div
          style={{ y: y1, opacity: opacity1 }}
          className="absolute inset-0 w-full h-full z-20 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform flex items-center justify-center bg-[#020202]"
        >
          <img
            src={scrollImages[1].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center filter blur-3xl opacity-35 scale-110 pointer-events-none"
          />
          <motion.img
            style={{ scale: scale1 }}
            src={scrollImages[1].src}
            srcSet={scrollImages[1].srcSet}
            sizes="100vw"
            alt={scrollImages[1].alt}
            loading="eager"
            decoding="async"
            className="relative z-10 max-w-full max-h-full w-full h-full object-contain object-center block p-0 m-0 select-none pointer-events-none transform-gpu will-change-transform drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          />
        </motion.div>

        {/* Layer 2: Image 03 */}
        <motion.div
          style={{ y: y2, opacity: opacity2 }}
          className="absolute inset-0 w-full h-full z-30 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform flex items-center justify-center bg-[#020202]"
        >
          <img
            src={scrollImages[2].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center filter blur-3xl opacity-35 scale-110 pointer-events-none"
          />
          <motion.img
            style={{ scale: scale2 }}
            src={scrollImages[2].src}
            srcSet={scrollImages[2].srcSet}
            sizes="100vw"
            alt={scrollImages[2].alt}
            loading="eager"
            decoding="async"
            className="relative z-10 max-w-full max-h-full w-full h-full object-contain object-center block p-0 m-0 select-none pointer-events-none transform-gpu will-change-transform drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          />
        </motion.div>

        {/* Layer 3: Image 04 */}
        <motion.div
          style={{ y: y3, opacity: opacity3 }}
          className="absolute inset-0 w-full h-full z-40 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform flex items-center justify-center bg-[#020202]"
        >
          <img
            src={scrollImages[3].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center filter blur-3xl opacity-35 scale-110 pointer-events-none"
          />
          <motion.img
            style={{ scale: scale3 }}
            src={scrollImages[3].src}
            srcSet={scrollImages[3].srcSet}
            sizes="100vw"
            alt={scrollImages[3].alt}
            loading="eager"
            decoding="async"
            className="relative z-10 max-w-full max-h-full w-full h-full object-contain object-center block p-0 m-0 select-none pointer-events-none transform-gpu will-change-transform drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          />
        </motion.div>

        {/* Layer 4: Image 05 (Royal Chess Lounge) */}
        <motion.div
          style={{ y: y4, opacity: opacity4 }}
          className="absolute inset-0 w-full h-full z-50 p-0 m-0 border-0 overflow-hidden transform-gpu will-change-transform flex items-center justify-center bg-[#020202]"
        >
          <img
            src={scrollImages[4].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center filter blur-3xl opacity-35 scale-110 pointer-events-none"
          />
          <motion.img
            style={{ scale: scale4 }}
            src={scrollImages[4].src}
            srcSet={scrollImages[4].srcSet}
            sizes="100vw"
            alt={scrollImages[4].alt}
            loading="eager"
            decoding="async"
            className="relative z-10 max-w-full max-h-full w-full h-full object-contain object-center block p-0 m-0 select-none pointer-events-none transform-gpu will-change-transform drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          />
        </motion.div>

      </div>
    </section>
  )
}
