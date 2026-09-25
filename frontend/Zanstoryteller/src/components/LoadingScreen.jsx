import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ progress, isLoaded }) {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020202] text-white px-6 selection:bg-none pointer-events-auto"
        >
          {/* Subtle background ambient light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
            {/* Brand Logo / Monogram */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="text-[11px] font-mono tracking-[0.35em] uppercase text-white/50 block mb-2">
                Cinematic Photography
              </span>
              <h1 className="text-2xl sm:text-3xl font-light tracking-[0.25em] uppercase text-white/95">
                Zanstoryteller
              </h1>
            </motion.div>

            {/* Elegant Minimal Progress Bar */}
            <div className="w-full bg-white/10 h-[1.5px] rounded-full overflow-hidden my-4 relative">
              <motion.div
                className="h-full bg-white transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Progress counter & Status */}
            <div className="flex items-center justify-between w-full text-[11px] font-mono tracking-widest text-white/45 uppercase pt-2">
              <span>Initializing Optics</span>
              <span>{String(progress).padStart(2, '0')}%</span>
            </div>

            <p className="mt-8 text-xs text-white/35 font-light tracking-wider">
              Loading 4K Equipment Sequence
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
