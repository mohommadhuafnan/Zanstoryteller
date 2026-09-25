import React, { useEffect, useRef, useCallback } from 'react'
import {
  FRAME_ASPECT_RATIO,
  getFrameIndexFromProgress,
} from '../utils/frameLoader'

/**
 * High-performance HTML5 Canvas Scrollytelling Sequence.
 * Renders the 40-frame exploded photography camera sequence linked to scroll progress.
 */
export default function ScrollSequence({ images, scrollYProgress, isLoaded }) {
  const canvasRef = useRef(null)
  const animFrameIdRef = useRef(null)
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const lastDrawnFrameRef = useRef(-1)

  // Canvas dimensions in display pixels
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 })

  // Function to render a specific frame onto the canvas
  const renderFrame = useCallback(
    (frameFloat) => {
      const canvas = canvasRef.current
      if (!canvas || !images || images.length === 0) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const total = images.length
      const frameIndex = Math.max(0, Math.min(total - 1, Math.round(frameFloat)))
      const img = images[frameIndex]

      if (!img || !img.complete) return

      const { width, height, dpr } = dimensionsRef.current
      if (width === 0 || height === 0) return

      // Clear with exact camera background color
      ctx.fillStyle = '#020202'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Contain scaling logic (preserving 16:9 ratio)
      const screenAspect = width / height
      let renderW, renderH

      if (screenAspect > FRAME_ASPECT_RATIO) {
        // Viewport is wider than 16:9 (laptops, ultra-wide)
        renderH = height
        renderW = height * FRAME_ASPECT_RATIO
      } else {
        // Viewport is narrower/taller than 16:9 (mobile, tablet portrait)
        renderW = width
        renderH = width / FRAME_ASPECT_RATIO
      }

      // Center the camera frame
      const offsetX = ((width - renderW) / 2) * dpr
      const offsetY = ((height - renderH) / 2) * dpr
      const drawW = renderW * dpr
      const drawH = renderH * dpr

      // Configure high-quality image smoothing for Retina/high-res rendering
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Draw the camera image
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH)

      lastDrawnFrameRef.current = frameIndex
    },
    [images]
  )

  // Handle canvas sizing & Device Pixel Ratio
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight

    dimensionsRef.current = { width, height, dpr }

    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Re-draw immediately after resize
    renderFrame(currentFrameRef.current)
  }, [renderFrame])

  // Setup resize listener
  useEffect(() => {
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [updateCanvasSize])

  // Subscribe to Framer Motion scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latestProgress) => {
      // Map 0 -> 1 progress to 0 -> 39 -> 0 frames
      const calculatedFrame = getFrameIndexFromProgress(latestProgress)
      targetFrameRef.current = calculatedFrame
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  // Main high-performance RAF render loop
  useEffect(() => {
    if (!isLoaded || !images || images.length === 0) return

    let isRunning = true

    const loop = () => {
      if (!isRunning) return

      const target = targetFrameRef.current
      const current = currentFrameRef.current
      const delta = target - current

      if (Math.abs(delta) > 0.005) {
        // Smooth lerp interpolation for filmic fluidity
        currentFrameRef.current += delta * 0.18

        const roundedCurrent = Math.round(currentFrameRef.current)
        if (roundedCurrent !== lastDrawnFrameRef.current) {
          renderFrame(currentFrameRef.current)
        }
      } else if (Math.round(current) !== lastDrawnFrameRef.current) {
        currentFrameRef.current = target
        renderFrame(target)
      }

      animFrameIdRef.current = requestAnimationFrame(loop)
    }

    // Initial draw
    renderFrame(currentFrameRef.current)
    animFrameIdRef.current = requestAnimationFrame(loop)

    return () => {
      isRunning = false
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
    }
  }, [isLoaded, images, renderFrame])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-10 flex items-center justify-center bg-[#020202]">
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-contain"
        aria-label="Interactive scrollytelling exploded camera animation"
        role="img"
      />

      {/* Cinematic subtle edge fade / vignette so camera edges dissolve seamlessly into #020202 */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,#020202_90%)]" />

      {/* Top and Bottom soft blend gradients */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#020202] via-[#020202]/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020202] via-[#020202]/70 to-transparent pointer-events-none" />
    </div>
  )
}
