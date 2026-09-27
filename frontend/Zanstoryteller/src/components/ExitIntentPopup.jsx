import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Sparkles, Check } from 'lucide-react'
import { exitIntentAdConfig } from '../data/exitIntentAdConfig'

/**
 * Premium Animated Exit-Intent Advertisement Popup
 * Detects cursor movement toward the top of the viewport and displays
 * an editorial promotional modal once per browser session.
 */
export default function ExitIntentPopup({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const isArmedRef = useRef(false)
  const prevYRef = useRef(1000)
  const hasTriggeredRef = useRef(false)

  // Trigger popup and record in sessionStorage
  const triggerPopup = useCallback(() => {
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true

    try {
      sessionStorage.setItem(exitIntentAdConfig.storageKey, 'true')
    } catch {
      // Graceful fallback if storage is restricted
    }

    setIsOpen(true)
  }, [])

  // Close popup with smooth reverse animation
  const closePopup = useCallback(() => {
    setIsOpen(false)
    try {
      sessionStorage.setItem(exitIntentAdConfig.storageKey, 'true')
    } catch {}
  }, [])

  // Handle CTA click
  const handleCtaClick = () => {
    closePopup()
    if (onNavigate && exitIntentAdConfig.primaryCtaTarget) {
      onNavigate(exitIntentAdConfig.primaryCtaTarget)
    }
  }

  // Set up Exit-Intent listeners on Desktop
  useEffect(() => {
    if (!exitIntentAdConfig.enabled) return

    // Clean up any old deprecated test keys
    try {
      sessionStorage.removeItem('zanstoryteller_exit_intent_seen_v1')
    } catch {}

    // Check if user already saw the popup in this session
    try {
      const alreadySeen = sessionStorage.getItem(exitIntentAdConfig.storageKey)
      if (alreadySeen === 'true') {
        hasTriggeredRef.current = true
        return
      }
    } catch {}

    // Check for touch / mobile devices (exit-intent mouse detection should only run on desktop)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    if (exitIntentAdConfig.desktopOnly && isTouchDevice) {
      return
    }

    // Arm the trigger after minimal grace time on page
    const armTimer = setTimeout(() => {
      isArmedRef.current = true
    }, exitIntentAdConfig.minTimeOnPageMs)

    // 1. Detect mouse moving towards top boundary to close window or tabs
    const handleMouseMove = (e) => {
      if (!isArmedRef.current || hasTriggeredRef.current) return
      
      const currentY = e.clientY
      const isMovingUp = prevYRef.current > currentY
      const upwardSpeed = prevYRef.current - currentY

      // Case A: Cursor is in top 45px and moving upward
      if (currentY <= 45 && isMovingUp) {
        triggerPopup()
        return
      }

      // Case B: High upward velocity towards top browser chrome (tabs / close button)
      if (currentY <= 90 && isMovingUp && upwardSpeed >= 18) {
        triggerPopup()
        return
      }

      prevYRef.current = currentY
    }

    // 2. Detect mouse leaving document viewport (crossing into top tabs / address bar / close button)
    const handleMouseLeave = (e) => {
      if (!isArmedRef.current || hasTriggeredRef.current) return
      // When cursor leaves viewport towards the top or upper sides
      if (e.clientY <= 60 || e.clientY <= 0) {
        triggerPopup()
      }
    }

    // 3. Classic cross-browser exit intent: mouseout with no relatedTarget
    const handleMouseOut = (e) => {
      if (!isArmedRef.current || hasTriggeredRef.current) return
      if (!e.relatedTarget && (e.clientY <= 60 || e.clientY <= 0)) {
        triggerPopup()
      }
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseout', handleMouseOut)

    // Development / testing helpers attached to window
    window.__triggerExitIntent = triggerPopup
    window.__resetExitIntent = () => {
      try {
        sessionStorage.removeItem(exitIntentAdConfig.storageKey)
      } catch {}
      hasTriggeredRef.current = false
      setIsOpen(false)
    }

    return () => {
      clearTimeout(armTimer)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseout', handleMouseOut)
      delete window.__triggerExitIntent
      delete window.__resetExitIntent
    }
  }, [triggerPopup])

  // Keyboard accessibility: ESC key dismisses the popup
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePopup()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closePopup])

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-popup-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          {/* Subtle Dark Background Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Centered Editorial Advertisement Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-4xl bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden text-white"
          >
            {/* Close Button (X in top right) */}
            <button
              type="button"
              onClick={closePopup}
              aria-label="Close advertisement"
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Content Grid: 2-Column Desktop Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px] md:min-h-[500px]">
              
              {/* Left Column: High-End Cinematic Photography */}
              <div className="relative md:col-span-5 h-56 md:h-auto overflow-hidden bg-neutral-900">
                <motion.img
                  src={exitIntentAdConfig.image}
                  alt={exitIntentAdConfig.imageAlt}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.06 }}
                  transition={{ duration: 12, ease: 'easeOut' }}
                  className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
                  loading="eager"
                  decoding="async"
                />

                {/* Subtle vignette and film tone */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating location / heritage tag */}
                <div className="absolute bottom-4 left-4 z-10 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-widest uppercase text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <span>CEYLON &amp; WORLDWIDE</span>
                </div>
              </div>

              {/* Right Column: Editorial Copy, Offer & Call to Action */}
              <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                <div>
                  {/* Brand & Badge Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] text-[10px] font-mono tracking-[0.25em] uppercase text-white/80">
                      <Sparkles className="w-3 h-3 text-[#d4af37]" />
                      {exitIntentAdConfig.brandLabel}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase">
                      {exitIntentAdConfig.badgeText}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3
                    id="exit-popup-title"
                    className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight uppercase leading-[1.12] mb-3 text-white"
                  >
                    {exitIntentAdConfig.headline} <br />
                    <span className="font-serif italic font-normal tracking-normal text-white/95 lowercase">
                      {exitIntentAdConfig.headlineEmphasized}
                    </span>
                  </h3>

                  {/* Supporting Description */}
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-6 max-w-md">
                    {exitIntentAdConfig.description}
                  </p>

                  {/* Key Highlights */}
                  {exitIntentAdConfig.features && exitIntentAdConfig.features.length > 0 && (
                    <div className="space-y-2 mb-6 hidden sm:block">
                      {exitIntentAdConfig.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/80 font-light">
                          <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-[#d4af37]" strokeWidth={2.5} />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions: Primary CTA + Secondary Dismiss */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className="group w-full py-3.5 px-6 rounded-full bg-white hover:bg-neutral-100 text-black text-xs sm:text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:gap-3 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer"
                  >
                    <span>{exitIntentAdConfig.primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={closePopup}
                      className="text-[11px] font-mono tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors py-1 cursor-pointer"
                    >
                      {exitIntentAdConfig.secondaryDismissText}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
