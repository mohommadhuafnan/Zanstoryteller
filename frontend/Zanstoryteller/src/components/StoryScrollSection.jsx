import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Maximize2, X, Sparkles } from 'lucide-react'

import img01 from '../assets/scrolling/01.webp'
import img02 from '../assets/scrolling/02.webp'
import img03 from '../assets/scrolling/03.webp'
import img04 from '../assets/scrolling/04.webp'

/**
 * Curated Landmark Client Productions
 * Contextualizes the 4 real client collage presentation boards
 * with an interactive 3D exhibition deck, category tab selector,
 * smooth swipe & keyboard navigation, and full-screen HD lightbox.
 */
const clientCampaigns = [
  {
    id: 1,
    number: "01",
    shortTitle: "CULINARY & LIFESTYLE",
    title: "Culinary & Lifestyle Editorial",
    category: "Gastronomy & Hospitality",
    location: "Doha, Qatar",
    year: "2025",
    image: img01,
    description: "Curated multi-plate gourmet narrative, natural morning radiance, and bespoke dining aesthetics captured for premier hospitality establishments.",
  },
  {
    id: 2,
    number: "02",
    shortTitle: "HAUTE ARCHITECTURE",
    title: "Haute Architecture & Interiors",
    category: "Luxury Spatial Design",
    location: "Pearl-Qatar",
    year: "2024",
    image: img02,
    description: "Spatial grandeur, bespoke crystal chandeliers, royal heritage ceilings, and architectural geometry documented in ultra-high resolution.",
  },
  {
    id: 3,
    number: "03",
    shortTitle: "FIFA WORLD CUP VIP",
    title: "FIFA World Cup Visa Activation",
    category: "Global Commercial Production",
    location: "FIFA World Cup Pavilion",
    year: "2024",
    image: img03,
    description: "Interactive brand pavilion, kinetic motion floor displays, digital guest experiences, and architectural lighting installations.",
  },
  {
    id: 4,
    number: "04",
    shortTitle: "CULTURAL CELEBRATION",
    title: "Qatar Cultural & Stadium Celebration",
    category: "National Stadium Heritage",
    location: "Lusail Iconic Stadium",
    year: "2025",
    image: img04,
    description: "Monumental stadium celebration, traditional orchestral devotion, candid crowd emotion, and historic national memories.",
  },
]

export default function StoryScrollSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const activeCampaign = clientCampaigns[currentIndex]

  const goToSlide = useCallback((newIndex, newDirection) => {
    setDirection(newDirection || (newIndex > currentIndex ? 1 : -1))
    setCurrentIndex(newIndex)
  }, [currentIndex])

  const nextSlide = useCallback(() => {
    const nextIdx = (currentIndex + 1) % clientCampaigns.length
    goToSlide(nextIdx, 1)
  }, [currentIndex, goToSlide])

  const prevSlide = useCallback(() => {
    const prevIdx = (currentIndex - 1 + clientCampaigns.length) % clientCampaigns.length
    goToSlide(prevIdx, -1)
  }, [currentIndex, goToSlide])

  // Handle keyboard arrow keys when interacting
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false)
        if (e.key === 'ArrowRight') nextSlide()
        if (e.key === 'ArrowLeft') prevSlide()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, nextSlide, prevSlide])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isLightboxOpen])

  return (
    <section
      id="philosophy"
      className="relative w-full bg-[#050505] text-white py-20 sm:py-28 md:py-36 px-4 sm:px-8 md:px-12 overflow-hidden border-t border-white/5"
    >
      {/* Ambient Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D8BB7B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#D8BB7B] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-[#D8BB7B] uppercase">
                Client Archive // Landmark Productions
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight uppercase leading-[1.06]">
              Curated <br />
              <span className="font-serif italic font-normal text-white/90 lowercase tracking-normal">client</span> <br />
              Masterworks.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8">
            <p className="text-xs sm:text-sm font-light text-white/50 max-w-md leading-relaxed font-sans">
              Landmark commercial activations, luxury architectural portfolios, and cultural heritage commissions documented with editorial precision.
            </p>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Campaign"
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-[#D8BB7B] hover:text-black hover:border-[#D8BB7B] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Campaign"
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-[#D8BB7B] hover:text-black hover:border-[#D8BB7B] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Campaign Filter Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-12 border-b border-white/10">
          {clientCampaigns.map((camp, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={camp.id}
                type="button"
                onClick={() => goToSlide(idx, idx > currentIndex ? 1 : -1)}
                className={`whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#D8BB7B] text-black font-semibold shadow-[0_0_20px_rgba(216,187,123,0.35)]'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span className={isActive ? 'text-black/60' : 'text-[#D8BB7B]'}>{camp.number}</span>
                <span>{camp.shortTitle}</span>
              </button>
            )
          })}
        </div>

        {/* Main Exhibition Stage */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.1/1] max-h-[75vh] rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex items-center justify-center group">
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeCampaign.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -direction * 50, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x
                if (swipe < -60 || velocity.x < -300) nextSlide()
                else if (swipe > 60 || velocity.x > 300) prevSlide()
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <img
                src={activeCampaign.image}
                alt={activeCampaign.title}
                className="w-full h-full object-contain select-none pointer-events-auto transition-transform duration-700 group-hover:scale-[1.01]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </AnimatePresence>

          {/* Quick Expand Button in Top Right */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label="Expand Full Board"
            className="absolute top-4 right-4 z-20 px-3 py-2 rounded-full bg-black/70 hover:bg-[#D8BB7B] text-white hover:text-black backdrop-blur-md border border-white/15 transition-all duration-300 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest cursor-pointer shadow-lg active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Full Board</span>
          </button>

          {/* Stage Progress Telemetry in Bottom Left */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white/70 uppercase tracking-widest">
            <span className="text-[#D8BB7B] font-semibold">{activeCampaign.number} / 04</span>
            <span className="text-white/20">•</span>
            <span className="truncate max-w-[160px] sm:max-w-none">{activeCampaign.title}</span>
          </div>

          {/* Bottom Interactive Progress Bar */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            {clientCampaigns.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx, idx > currentIndex ? 1 : -1)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-[#D8BB7B] shadow-[0_0_8px_rgba(216,187,123,0.8)]'
                    : 'w-3 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Campaign Info Bar below the stage */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs font-mono text-white/60">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div>
              <span className="text-white/30 uppercase text-[10px] block mb-1">Production</span>
              <span className="text-white font-medium">{activeCampaign.title}</span>
            </div>
            <div>
              <span className="text-white/30 uppercase text-[10px] block mb-1">Category</span>
              <span className="text-white/80">{activeCampaign.category}</span>
            </div>
            <div>
              <span className="text-white/30 uppercase text-[10px] block mb-1">Location</span>
              <span className="text-white/80">{activeCampaign.location}</span>
            </div>
          </div>

          <p className="text-[11px] font-sans font-light text-white/45 max-w-md leading-relaxed">
            {activeCampaign.description}
          </p>
        </div>

      </div>

      {/* Full-Screen HD Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8"
          >
            {/* Top Modal Controls */}
            <div className="w-full flex items-center justify-between z-30 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-white/70">
                <span className="text-[#D8BB7B] font-semibold">{activeCampaign.number} / 04</span>
                <span>•</span>
                <span className="text-white">{activeCampaign.title}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close Lightbox"
                className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Central High-Resolution Board */}
            <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-hidden">
              <motion.img
                key={`modal-${activeCampaign.id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                src={activeCampaign.image}
                alt={activeCampaign.title}
                className="max-w-full max-h-[82vh] w-auto h-auto object-contain select-none shadow-2xl rounded-lg"
              />

              {/* Prev / Next Modal Floaters */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Board"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/60 hover:bg-[#D8BB7B] hover:text-black hover:border-[#D8BB7B] flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Board"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/60 hover:bg-[#D8BB7B] hover:text-black hover:border-[#D8BB7B] flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Modal Metadata */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-white/50 pt-3 border-t border-white/10">
              <span className="hidden sm:inline">USE ARROW KEYS OR SWIPE TO NAVIGATE</span>
              <span className="text-[#D8BB7B]">{activeCampaign.category} — {activeCampaign.location}</span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="text-white hover:text-[#D8BB7B] uppercase cursor-pointer"
              >
                Press ESC to Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
