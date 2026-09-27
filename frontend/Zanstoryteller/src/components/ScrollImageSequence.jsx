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
    const smoothingFactor = isMobile ? 0.08 : 0.062

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
     * Cross-fade draw: Renders base frame A and blends frame B with fractional opacity
     */
    const drawBlendedFrames = (imgA, imgB, blendAlpha) => {
      if (!ctx || !imgA || !imgA.width || !imgA.height) return

      const w = canvas.width
      const h = canvas.height

      // Solid cinematic black backdrop
      ctx.fillStyle = '#020202'
      ctx.fillRect(0, 0, w, h)

      const imgRatio = imgA.width / imgA.height
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

      // 1. Draw Base Frame A (Full Opacity)
      ctx.globalAlpha = 1.0
      ctx.drawImage(imgA, drawX, drawY, drawW, drawH)

      // 2. Draw Frame B if available and blend alpha is noticeable (> 0.8%)
      if (imgB && imgB !== imgA && blendAlpha > 0.008) {
        ctx.globalAlpha = Math.min(1, Math.max(0, blendAlpha))
        ctx.drawImage(imgB, drawX, drawY, drawW, drawH)
      }

      // Reset globalAlpha
      ctx.globalAlpha = 1.0
    }

    let lastPrioritizedIndex = -1

    /**
     * Main Animation Loop
     */
    const renderLoop = () => {
      const progress = targetProgressRef.current
      const targetFrame = progress * (TOTAL_FRAMES - 1)

      // Smooth adaptive lerp toward target frame
      if (prefersReducedMotion) {
        currentFrameRef.current = targetFrame
      } else {
        const delta = targetFrame - currentFrameRef.current
        const absDelta = Math.abs(delta)
        // Adaptive factor: snappy response during active scroll, silky micro-smoothing when settling
        const adaptiveFactor = absDelta > 3 ? 0.14 : (absDelta > 0.8 ? 0.105 : 0.082)
        currentFrameRef.current += delta * adaptiveFactor
      }

      const floatFrame = Math.max(
        0,
        Math.min(TOTAL_FRAMES - 1, currentFrameRef.current)
      )

      const floorIdx = Math.floor(floatFrame)
      const ceilIdx = Math.min(TOTAL_FRAMES - 1, floorIdx + 1)
      const blendAlpha = floatFrame - floorIdx // Fractional progression between 0.0 and 1.0

      // Prioritize frames around current position if moved
      if (Math.abs(floorIdx - lastPrioritizedIndex) >= 1) {
        lastPrioritizedIndex = floorIdx
        frameCacheManager.prioritizeAround(floorIdx, preloadRadius)
      }

      // Notify parent for live technical HUD
      if (onFrameUpdate) {
        onFrameUpdate(Math.round(floatFrame), progress)
      }

      // Redraw whenever the floating-point frame moves by at least 0.003 or on resize
      if (
        Math.abs(floatFrame - lastRenderedFloatRef.current) > 0.003 ||
        isResizingRef.current
      ) {
        const resultA = frameCacheManager.getNearest(floorIdx)
        const resultB = frameCacheManager.get(ceilIdx) || resultA?.frame

        if (resultA && resultA.frame) {
          drawBlendedFrames(resultA.frame, resultB, blendAlpha)
          lastRenderedFloatRef.current = floatFrame
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop)
    }

    // Subscribe to frame loading notifications
    const unsubscribeCache = frameCacheManager.onFrameLoaded((loadedIndex) => {
      const curFloor = Math.floor(currentFrameRef.current)
      const curCeil = Math.min(TOTAL_FRAMES - 1, curFloor + 1)
      if (loadedIndex === curFloor || loadedIndex === curCeil) {
        const floatFrame = currentFrameRef.current
        const alpha = floatFrame - curFloor
        const resultA = frameCacheManager.getNearest(curFloor)
        const resultB = frameCacheManager.get(curCeil) || resultA?.frame
        if (resultA && resultA.frame) {
          drawBlendedFrames(resultA.frame, resultB, alpha)
          lastRenderedFloatRef.current = floatFrame
        }
      }
    })

    rafIdRef.current = requestAnimationFrame(renderLoop)

    return () => {
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
