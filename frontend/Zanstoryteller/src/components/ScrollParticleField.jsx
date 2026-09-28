import React, { useRef, useEffect } from 'react'

/**
 * ScrollParticleField Component
 * 
 * Cinematic 3D Depth Particle System:
 * - Frame-synchronized 3D perspective: As frames change during scroll,
 *   dots travel smoothly through 3D Z-depth toward the viewer ("moving in").
 * - Dynamic 3D expansion: Dots expand outward radially and grow naturally in scale
 *   as they approach the camera, giving an unmistakable sense of 3D depth.
 * - Minimal, uncluttered count:
 *   * Idle (not scrolling): Exactly 4 to 5 gentle, slow floating dots.
 *   * Scrolling: Only a few subtle accent dots (total 8-10 max, never a swarm).
 * - Calibrated slow pace: Movement is graceful, slow, and cinematic with soft bokeh fading.
 */
export default function ScrollParticleField({ scrollYProgress }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const targetProgressRef = useRef(0)
  const smoothProgressRef = useRef(0)
  const scrollVelocityRef = useRef(0)
  const scrollActivityRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const lastTimeRef = useRef(0)

  // Listen to Framer Motion scrollYProgress if provided
  useEffect(() => {
    if (!scrollYProgress) return

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      targetProgressRef.current = Math.max(0, Math.min(1, latest))
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent))

    // Exactly 5 dots visible when idle; max 9 total when actively scrolling
    const IDLE_DOT_COUNT = 5
    const TOTAL_DOT_COUNT = isMobile ? 7 : 9
    const maxZ = 900
    const minZ = 60

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let fov = width * 0.7

    const resize = () => {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      fov = width * 0.7
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Staggered 3D spatial distribution around the camera center
    const particles = []
    const resetParticle = (p, zInit = null, spawnNear = false) => {
      const angle = Math.random() * Math.PI * 2
      // Conical distribution radiating outward from the focal center
      const radius = 50 + Math.random() * (Math.max(width, height) * 0.5)

      p.x = Math.cos(angle) * radius
      p.y = Math.sin(angle) * radius
      p.z = zInit !== null ? zInit : (spawnNear ? minZ + 30 : maxZ - Math.random() * 80)
      p.baseRadius = 1.6 + Math.random() * 1.8
      // Warm champagne gold & soft teal accent colors
      p.isTeal = Math.random() < 0.22
      p.alphaMultiplier = 0.55 + Math.random() * 0.35
      p.floatSpeedX = (Math.random() - 0.5) * 0.18
      p.floatSpeedY = (Math.random() - 0.5) * 0.18
    }

    // Initialize particles evenly spaced across 3D depth
    for (let i = 0; i < TOTAL_DOT_COUNT; i++) {
      const p = {}
      const initialZ = minZ + ((maxZ - minZ) / TOTAL_DOT_COUNT) * i + Math.random() * 40
      resetParticle(p, initialZ)
      particles.push(p)
    }

    // Fallback Wheel / Scroll Velocity Tracking if standalone
    const onWheel = (e) => {
      const delta = e.deltaY
      const impulse = Math.max(-10, Math.min(10, delta * 0.035))
      scrollVelocityRef.current += impulse
    }

    lastScrollYRef.current = window.scrollY
    lastTimeRef.current = performance.now()

    const onScroll = () => {
      const now = performance.now()
      const currentY = window.scrollY
      const dt = Math.max(10, now - lastTimeRef.current)
      const dy = currentY - lastScrollYRef.current

      const instant = (dy / dt) * 16.67
      const clamped = Math.max(-12, Math.min(12, instant * 0.22))
      scrollVelocityRef.current += (clamped - scrollVelocityRef.current) * 0.3

      lastScrollYRef.current = currentY
      lastTimeRef.current = now
    }

    // Touch support for mobile scrolling
    let touchStartY = 0
    let lastTouchTime = 0

    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY
        lastTouchTime = performance.now()
      }
    }

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const currentY = e.touches[0].clientY
        const now = performance.now()
        const dt = Math.max(10, now - lastTouchTime)
        const dy = touchStartY - currentY
        const instant = (dy / dt) * 16.67
        const clamped = Math.max(-12, Math.min(12, instant * 0.22))
        scrollVelocityRef.current += (clamped - scrollVelocityRef.current) * 0.3

        touchStartY = currentY
        lastTouchTime = now
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    // Animation Loop
    let time = 0

    const animate = () => {
      time += 0.012

      // Synchronize with scrollYProgress frame progression
      if (scrollYProgress) {
        const deltaProgress = targetProgressRef.current - smoothProgressRef.current
        smoothProgressRef.current += deltaProgress * 0.08
        // Convert frame progression delta to 3D speed
        const frameSpeed = deltaProgress * 110
        scrollVelocityRef.current += (frameSpeed - scrollVelocityRef.current) * 0.35
      }

      // Smooth deceleration
      scrollVelocityRef.current *= 0.92
      if (Math.abs(scrollVelocityRef.current) < 0.02) {
        scrollVelocityRef.current = 0
      }

      const absVelocity = Math.abs(scrollVelocityRef.current)

      // Activity factor: 0 when stationary, up to 1.0 when scrolling
      const targetActivity = Math.min(1.0, absVelocity * 0.45)
      scrollActivityRef.current += (targetActivity - scrollActivityRef.current) * 0.07

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = width / 2
      const centerY = height / 2

      // 3D Z-step: Gentle ambient float (0.07) + smooth scroll velocity
      // Scrolling down advances dots toward the viewer (feel the 3D moving in)
      const ambientZ = 0.07
      const zStep = ambientZ + scrollVelocityRef.current * 0.85

      for (let i = 0; i < TOTAL_DOT_COUNT; i++) {
        const p = particles[i]
        const isIdleDot = i < IDLE_DOT_COUNT

        p.z -= zStep

        // Calm, subtle 2D drift
        p.x += Math.sin(time + i * 1.5) * p.floatSpeedX
        p.y += Math.cos(time + i * 1.2) * p.floatSpeedY

        // Handle 3D boundaries (smooth recycling)
        if (p.z <= minZ) {
          // Passed camera: reset to deep background
          resetParticle(p, maxZ - 10)
          continue
        } else if (p.z >= maxZ) {
          // Moved too far into background: reset near camera if reversing
          resetParticle(p, minZ + 30, true)
          continue
        }

        // 3D Perspective Projection: Scale increases as Z approaches camera
        const scale = fov / p.z
        const sx = (centerX + p.x * scale) * dpr
        const sy = (centerY + p.y * scale) * dpr

        // Dynamic 3D radius: Starts small at distance, expands into glowing bubble close to camera
        const depthRatio = 1 - (p.z - minZ) / (maxZ - minZ) // 0 (far) to 1 (near camera)
        const radius = Math.max(1.0, p.baseRadius * (0.8 + depthRatio * 2.2)) * dpr

        // Canvas viewport clipping
        if (sx < -40 || sx > canvas.width + 40 || sy < -40 || sy > canvas.height + 40) {
          if (zStep > 0) {
            resetParticle(p, maxZ - 20)
          } else {
            resetParticle(p, minZ + 30, true)
          }
          continue
        }

        // 3D Depth Opacity & Soft Bokeh
        // - Far fade: gently fades in as it enters from deep space
        // - Near fade: soft bokeh fadeout when very close to camera lens
        const farFade = Math.min(1, Math.max(0, (maxZ - p.z) / 120))
        const nearFade = Math.min(1, Math.max(0, (p.z - minZ) / 80))
        const depthFade = farFade * nearFade
        const subtlePulse = 0.85 + Math.sin(time * 1.6 + i) * 0.15

        const dotAlpha = isIdleDot
          ? (0.35 + depthRatio * 0.25) * depthFade * p.alphaMultiplier * subtlePulse
          : scrollActivityRef.current * (0.4 + depthRatio * 0.25) * depthFade * p.alphaMultiplier * subtlePulse

        if (dotAlpha <= 0.015) continue

        ctx.save()

        // Soft, glowing 3D circular dot / bubble
        ctx.beginPath()
        ctx.arc(sx, sy, radius, 0, Math.PI * 2)

        if (p.isTeal) {
          ctx.fillStyle = `rgba(28, 170, 179, ${dotAlpha})`
          ctx.shadowColor = 'rgba(28, 170, 179, 0.55)'
          ctx.shadowBlur = (3 + depthRatio * 5) * dpr
        } else {
          // Warm gold and diamond white matching brand identity
          ctx.fillStyle = `rgba(235, 218, 178, ${dotAlpha})`
          ctx.shadowColor = 'rgba(216, 187, 123, 0.5)'
          ctx.shadowBlur = (3 + depthRatio * 5) * dpr
        }

        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    let isVisible = true

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !rafRef.current) {
          rafRef.current = requestAnimationFrame(animate)
        }
      },
      { threshold: 0 }
    )
    observer.observe(canvas)

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [scrollYProgress])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
      style={{
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    />
  )
}
