import React, { useRef, useEffect } from 'react'

/**
 * ScrollParticleField Component
 * 
 * Implements a true 3D perspective warp-tunnel particle field:
 * - Idle state: 100% invisible (opacity 0). Particles do NOT show when stationary.
 * - Scroll state: Particles dynamically appear and rush outward from the center
 *   vanishing point toward the camera in 3D ("moving inside" perspective).
 * - Scroll speed: The faster the user scrolls, the more particles streak and zoom forward.
 * - Directional: Scrolling down zooms forward (inside); scrolling up reverses.
 * - Inertial decay: When scrolling stops, particles smoothly decelerate and fade to 0 opacity.
 */
export default function ScrollParticleField() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const velocityRef = useRef(0)
  const opacityRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent))

    const count = isMobile ? 85 : 180
    const maxZ = 1200
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let fov = width * 0.65

    const resize = () => {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      fov = width * 0.65
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Create 3D particles distributed in cylindrical/conical space around camera
    const particles = []
    const resetParticle = (p, zInit = null) => {
      // Angular spread for 3D tunnel distribution
      const angle = Math.random() * Math.PI * 2
      // Exponential distribution so more particles appear across depth
      const radius = 80 + Math.random() * (Math.max(width, height) * 0.75)

      p.x = Math.cos(angle) * radius
      p.y = Math.sin(angle) * radius
      p.z = zInit !== null ? zInit : maxZ
      p.prevZ = p.z
      p.baseSize = 0.8 + Math.random() * 1.8
      // Mix of pure white and subtle cyan/teal lens glow
      p.isTeal = Math.random() < 0.28
      p.alphaMultiplier = 0.4 + Math.random() * 0.6
    }

    for (let i = 0; i < count; i++) {
      const p = {}
      // Initial staggered Z depth
      resetParticle(p, Math.random() * maxZ)
      particles.push(p)
    }

    // Direct Wheel & Scroll Velocity Tracking
    const onWheel = (e) => {
      // Instant velocity impulse from mousewheel/trackpad
      const delta = e.deltaY
      const impulse = Math.max(-50, Math.min(50, delta * 0.12))
      velocityRef.current += impulse
    }

    lastScrollYRef.current = window.scrollY
    lastTimeRef.current = performance.now()

    const onScroll = () => {
      const now = performance.now()
      const currentY = window.scrollY
      const dt = Math.max(8, now - lastTimeRef.current)
      const dy = currentY - lastScrollYRef.current

      // Convert scroll delta to frame-rate normalized velocity
      const instant = (dy / dt) * 16.67
      const clamped = Math.max(-45, Math.min(45, instant))
      velocityRef.current += (clamped - velocityRef.current) * 0.55

      lastScrollYRef.current = currentY
      lastTimeRef.current = now
    }

    // Touch event handling for mobile scrolling
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
        const clamped = Math.max(-45, Math.min(45, instant))
        velocityRef.current += (clamped - velocityRef.current) * 0.55

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
      time += 0.016

      // Smooth decay of velocity
      velocityRef.current *= 0.92
      if (Math.abs(velocityRef.current) < 0.05) {
        velocityRef.current = 0
      }

      const velocity = velocityRef.current
      const absVelocity = Math.abs(velocity)

      // Always maintain an elegant base ambient visibility (0.75), boosting up to 1.0 when scrolling
      const targetOpacity = Math.min(1.0, 0.75 + absVelocity * 0.08)
      opacityRef.current += (targetOpacity - opacityRef.current) * 0.1

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = width / 2
      const centerY = height / 2
      const globalAlpha = opacityRef.current

      // Continuous ambient drift forward + scroll velocity boost
      const ambientZ = 0.35
      const zStep = ambientZ + velocity * 3.8

      for (let i = 0; i < count; i++) {
        const p = particles[i]

        p.prevZ = p.z
        p.z -= zStep

        // Subtle organic float in X and Y
        p.x += Math.sin(time + i) * 0.15
        p.y += Math.cos(time + i * 0.7) * 0.15

        // Recycle particle if it passes camera or goes too far
        if (p.z <= 20) {
          resetParticle(p, maxZ)
          continue
        } else if (p.z >= maxZ) {
          resetParticle(p, 30)
          continue
        }

        // 3D Perspective Projection
        const scale = fov / p.z
        const sx = (centerX + p.x * scale) * dpr
        const sy = (centerY + p.y * scale) * dpr
        const radius = Math.max(0.7, p.baseSize * scale * 0.75) * dpr

        // Check if within canvas bounds
        if (sx < -40 || sx > canvas.width + 40 || sy < -40 || sy > canvas.height + 40) {
          resetParticle(p, maxZ)
          continue
        }

        // Depth-based alpha fade (brighter when closer, softer when far)
        const depthFade = Math.min(1, Math.max(0.15, 1 - p.z / maxZ))
        const twinkle = 0.85 + Math.sin(time * 2 + i) * 0.15
        const finalAlpha = Math.min(1, globalAlpha * depthFade * p.alphaMultiplier * twinkle)

        ctx.save()

        // Draw 3D speed streak only when scrolling rapidly
        if (absVelocity > 3.0) {
          const prevScale = fov / Math.max(20, p.prevZ)
          const prevSx = (centerX + p.x * prevScale) * dpr
          const prevSy = (centerY + p.y * prevScale) * dpr

          ctx.beginPath()
          ctx.strokeStyle = p.isTeal
            ? `rgba(28, 170, 179, ${finalAlpha * 0.95})`
            : `rgba(216, 187, 123, ${finalAlpha * 0.9})`
          ctx.lineWidth = Math.max(1, radius * 0.85)
          ctx.lineCap = 'round'
          ctx.moveTo(prevSx, prevSy)
          ctx.lineTo(sx, sy)
          ctx.stroke()
        } else {
          // Elegant glowing ambient 3D star / dot
          ctx.beginPath()
          ctx.arc(sx, sy, radius, 0, Math.PI * 2)

          if (p.isTeal) {
            ctx.fillStyle = `rgba(28, 170, 179, ${finalAlpha})`
            ctx.shadowColor = 'rgba(28, 170, 179, 0.7)'
            ctx.shadowBlur = 5 * dpr
          } else {
            // Gold & diamond warm white particles matching logo theme
            ctx.fillStyle = `rgba(235, 215, 170, ${finalAlpha})`
            ctx.shadowColor = 'rgba(216, 187, 123, 0.6)'
            ctx.shadowBlur = 4 * dpr
          }
          ctx.fill()
        }

        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

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
