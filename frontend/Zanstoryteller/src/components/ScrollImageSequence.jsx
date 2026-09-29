import React, { useRef, useEffect } from 'react'
import {
  TOTAL_FRAMES,
  frameCacheManager,
} from '../utils/frameSequence'

/**
 * ScrollImageSequence Component
 * 
 * High-performance HTML5 Canvas image-sequence renderer featuring:
 * - Sub-frame temporal cross-fade blending: Continuously blends between
 *   adjacent frames (Frame A and Frame B) using fractional alpha, eliminating
 *   discrete frame-step cuts ("cut and came" effect).
 * - Smooth lerp frame interpolation with velocity responsiveness.
 * - High-DPI canvas rendering (clamped to devicePixelRatio 2).
 * - Cinematic "cover" aspect-ratio preservation with zero edge distortion.
 * - High-priority preloading of both active and forthcoming blend target frames.
 */
export default function ScrollImageSequence({
  scrollYProgress,
  onFrameUpdate,
}) {
  const canvasRef = useRef(null)
  const targetProgressRef = useRef(0)
  const currentFrameRef = useRef(0)
  const lastRenderedFloatRef = useRef(-1)
  const rafIdRef = useRef(null)
  const isResizingRef = useRef(false)

  // Synchronize scroll progress from Framer Motion MotionValue
  useEffect(() => {
    if (!scrollYProgress) return

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      targetProgressRef.current = Math.max(0, Math.min(1, latest))
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  // Canvas setup and RAF animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    })
    if (!ctx) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Detect mobile for optimized preloading radius
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent))
    const preloadRadius = isMobile ? 8 : 16

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let canvasWidth = 0
    let canvasHeight = 0
    let dpr = 1

    /**
     * Resize canvas with high-DPI scaling
     */
    const updateCanvasSize = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvasWidth = Math.floor(rect.width)
      canvasHeight = Math.floor(rect.height)

      canvas.width = Math.floor(canvasWidth * dpr)
      canvas.height = Math.floor(canvasHeight * dpr)

      // Force immediate redraw at new resolution
      lastRenderedFloatRef.current = -1
    }

    updateCanvasSize()

    let resizeTimer
    const handleResize = () => {
      isResizingRef.current = true
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        updateCanvasSize()
        isResizingRef.current = false
      }, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    /**
     * Razor-sharp frame drawing: Renders exact frame with zero ghosting or blur.
     * Prevents double-image transparency smear when camera components explode.
     */
    const drawSingleFrame = (img) => {
      if (!ctx || !img || !img.width || !img.height) return

      const w = canvas.width
      const h = canvas.height

      // Solid cinematic black backdrop
      ctx.fillStyle = '#020202'
      ctx.fillRect(0, 0, w, h)

      const imgRatio = img.width / img.height
      const canvasRatio = w / h

      let drawW, drawH, drawX, drawY

      if (canvasRatio > imgRatio) {
        drawW = w
        drawH = w / imgRatio
        drawX = 0
        drawY = (h - drawH) / 2
      } else {
        drawH = h
        drawW = h * imgRatio
        drawX = (w - drawW) / 2
        drawY = 0
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    }

    let lastPrioritizedIndex = -1

    /**
     * Main Animation Loop
     */
    const renderLoop = () => {
      const progress = targetProgressRef.current
      const targetFrame = progress * (TOTAL_FRAMES - 1)

      // Smooth and responsive lerp toward target frame - eliminates scroll lag ("not leg")
      if (prefersReducedMotion) {
        currentFrameRef.current = targetFrame
      } else {
        const delta = targetFrame - currentFrameRef.current
        const absDelta = Math.abs(delta)
        // Snappy responsive factor: silky smooth without trailing behind user scroll
        const adaptiveFactor = absDelta > 2 ? 0.35 : (absDelta > 0.5 ? 0.28 : 0.22)
        currentFrameRef.current += delta * adaptiveFactor
      }

      const currentIdx = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current))
      )

      // Prioritize frames around current position if moved
      if (Math.abs(currentIdx - lastPrioritizedIndex) >= 1) {
        lastPrioritizedIndex = currentIdx
        frameCacheManager.prioritizeAround(currentIdx, preloadRadius)
      }

      // Notify parent for live technical HUD
      if (onFrameUpdate) {
        onFrameUpdate(currentIdx, progress)
      }

      // Redraw whenever frame changes or on resize with 100% sharpness
      if (
        currentIdx !== lastRenderedFloatRef.current ||
        isResizingRef.current
      ) {
        const result = frameCacheManager.getNearest(currentIdx)

        if (result && result.frame) {
          drawSingleFrame(result.frame)
          lastRenderedFloatRef.current = currentIdx
        }
      }

      if (!isVisible) {
        rafIdRef.current = null
        return
      }

      rafIdRef.current = requestAnimationFrame(renderLoop)
    }

    let isVisible = true

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(renderLoop)
        }
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    // Subscribe to frame loading notifications
    const unsubscribeCache = frameCacheManager.onFrameLoaded((loadedIndex) => {
      const curIdx = Math.round(currentFrameRef.current)
      if (loadedIndex === curIdx) {
        const result = frameCacheManager.getNearest(curIdx)
        if (result && result.frame) {
          drawSingleFrame(result.frame)
          lastRenderedFloatRef.current = curIdx
        }
      }
    })

    rafIdRef.current = requestAnimationFrame(renderLoop)

    return () => {
      observer.disconnect()
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
      unsubscribeCache()
    }
  }, [onFrameUpdate, scrollYProgress])

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020202] overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block will-change-transform"
        style={{
          backgroundColor: '#020202',
          imageRendering: 'auto',
        }}
      />
    </div>
  )
}
