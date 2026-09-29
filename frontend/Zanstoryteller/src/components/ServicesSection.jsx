import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowRight, ArrowLeft, Camera } from 'lucide-react'
import { servicesData } from '../data/photographyData'
import { getResponsiveUnsplash } from '../utils/imageOptimizer'

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0)

  const handleBookClick = (e) => {
    e.preventDefault()
    // Check if on dedicated booking page or home
    if (window.location.pathname !== '/') {
      window.location.href = '/book-session'
    } else {
      const contactEl = document.querySelector('#contact')
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.history.pushState({}, '', '/book-session')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    }
  }

  const handlePortfolioClick = (e) => {
    e.preventDefault()
    const portEl = document.querySelector('#portfolio')
    if (portEl) {
      portEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const nextService = () => {
    setActiveService((prev) => (prev + 1) % servicesData.length)
  }

  const prevService = () => {
    setActiveService((prev) => (prev - 1 + servicesData.length) % servicesData.length)
  }

  const activeItem = servicesData[activeService]

  return (
    <section 
      id="services" 
      className="relative w-full bg-[#FFFFFF] text-[#111111] py-24 sm:py-32 md:py-40 px-5 sm:px-10 md:px-16 lg:px-20 border-t border-[#EAEAEA] overflow-hidden"
    >
      {/* Ambient delicate glow accent */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(216,187,123,0.06),transparent_70%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-[#EAEAEA]"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
              <span className="text-[11px] font-mono tracking-[0.3em] text-[#666666] uppercase">
                Services & Disciplines
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-none">
              What We Capture
            </h2>
          </div>
          <p className="mt-4 lg:mt-0 text-sm sm:text-base text-[#666666] font-light max-w-md lg:text-right leading-relaxed">
            Four specialized disciplines shaped by authentic emotion, poetic light, and unscripted storytelling.
          </p>
        </motion.div>

        {/* Quick Category Switcher Tabs with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-10"
        >
          {servicesData.map((service, index) => {
            const isActive = activeService === index
            return (
              <button
                key={service.id}
                onClick={() => setActiveService(index)}
                className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white font-medium shadow-[0_4px_20px_rgba(0,0,0,0.15)]'
                    : 'bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#555555] hover:text-[#111111] border border-[#E5E5E5]'
                }`}
              >
                <span className={`text-[10px] ${isActive ? 'text-[#D8BB7B]' : 'text-[#999999]'}`}>
                  {service.number}
                </span>
                <span>{service.title}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8BB7B]" />
                )}
              </button>
            )
          })}
        </motion.div>

        {/* DESKTOP: Kinetic Expanding Accordion Deck (>= lg screens) with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex gap-3 xl:gap-4 h-[600px] xl:h-[640px] w-full"
        >
          {servicesData.map((service, index) => {
            const isActive = activeService === index

            return (
              <motion.div
                key={service.id}
                layout
                transition={{
                  layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                }}
                onMouseEnter={() => setActiveService(index)}
                onClick={() => setActiveService(index)}
                className={`relative h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                  isActive
                    ? 'flex-[4.2] border border-[#111111]/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.22)]'
                    : 'flex-1 border border-[#E5E5E5] hover:border-[#111111]/40 hover:shadow-lg'
                }`}
              >
                {/* Background Photography Image */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#161616]">
                  <img
                    {...getResponsiveUnsplash(service.image, 1000, '(max-width: 768px) 100vw, 50vw')}
                    alt={service.alt}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover object-center transition-all duration-700 ${
                      isActive 
                        ? 'scale-105 filter brightness-90 contrast-105' 
                        : 'scale-100 filter brightness-[0.4] contrast-110'
                    }`}
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-t from-black/95 via-black/55 to-black/30' 
                      : 'bg-black/55 hover:bg-black/35'
                  }`} />
                </div>

                {/* INACTIVE CARD STATE (Compressed Strip) */}
                {!isActive && (
                  <div className="absolute inset-0 flex flex-col justify-between items-center py-8 px-2 select-none group">
                    {/* Top Category Number */}
                    <div className="w-8 h-8 rounded-full border border-white/30 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <span className="font-mono text-xs text-white/90">
                        {service.number}
                      </span>
                    </div>

                    {/* Middle Rotated Title */}
                    <div className="my-auto py-6">
                      <span 
                        style={{ writingMode: 'vertical-rl' }}
                        className="text-sm font-mono tracking-[0.3em] uppercase text-white/80 rotate-180 group-hover:text-white transition-colors duration-300"
                      >
                        {service.title}
                      </span>
                    </div>

                    {/* Bottom Action Icon */}
                    <div className="w-8 h-8 rounded-full border border-white/25 bg-black/40 flex items-center justify-center text-white/80 group-hover:bg-[#111111] group-hover:text-white transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* ACTIVE CARD STATE (Expanded Rich Editorial Suite) */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="absolute inset-0 p-8 xl:p-10 flex flex-col justify-between z-10"
                  >
                    {/* Top Metadata Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D8BB7B]/50 text-[#D8BB7B] text-[11px] font-mono tracking-widest uppercase">
                          CATEGORY {service.number} // 04
                        </span>
                        <span className="text-[11px] font-mono text-white/70 tracking-wider uppercase hidden xl:inline-block">
                          FINE ART DISCIPLINE
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/60 text-[11px] font-mono">
                        <Camera className="w-3.5 h-3.5 text-[#D8BB7B]" />
                        <span>ZAN ARCHIVE</span>
                      </div>
                    </div>

                    {/* Bottom Content Cluster */}
                    <div className="max-w-2xl">
                      {/* Main Title */}
                      <motion.h3 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="text-3xl sm:text-4xl xl:text-5xl font-light tracking-tight text-white uppercase mb-2"
                      >
                        {service.title}
                      </motion.h3>

                      {/* Tagline */}
                      <motion.p 
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-base sm:text-lg text-[#D8BB7B] font-light italic mb-4"
                      >
                        "{service.tagline}"
                      </motion.p>

                      {/* Description */}
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                        className="text-sm xl:text-base text-white/85 font-light leading-relaxed mb-6 max-w-xl"
                      >
                        {service.description}
                      </motion.p>

                      {/* Action CTA Row */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="flex items-center gap-4 pt-2"
                      >
                        <button
                          onClick={handleBookClick}
                          className="group px-6 py-3 rounded-full bg-white text-black text-xs font-mono uppercase tracking-[0.18em] font-medium hover:bg-[#D8BB7B] hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(216,187,123,0.4)]"
                        >
                          <span>Inquire {service.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>

                        <button
                          onClick={handlePortfolioClick}
                          className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-[0.18em] transition-all duration-300 border border-white/20 cursor-pointer"
                        >
                          View Gallery Stories
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* MOBILE & TABLET: Interactive Cinematic Showcase Deck (< lg screens) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="block lg:hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl overflow-hidden border border-black/10 bg-[#161616] min-h-[560px] flex flex-col justify-between p-6 sm:p-8 shadow-2xl"
            >
              {/* Background Photography Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={activeItem.image}
                  alt={activeItem.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
              </div>

              {/* Top Row: Category Counter & Title */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D8BB7B]/50 text-[#D8BB7B] text-[11px] font-mono tracking-widest uppercase">
                  DISCIPLINE {activeItem.number} // 04
                </span>
                <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-mono">
                  <Camera className="w-3.5 h-3.5 text-[#D8BB7B]" />
                  <span>ZAN ARCHIVE</span>
                </div>
              </div>

              {/* Middle/Bottom Content */}
              <div className="relative z-10 mt-28">
                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white uppercase mb-2">
                  {activeItem.title}
                </h3>
                
                <p className="text-sm sm:text-base text-[#D8BB7B] font-light italic mb-3">
                  "{activeItem.tagline}"
                </p>

                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-5">
                  {activeItem.description}
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleBookClick}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-white text-black text-xs font-mono uppercase tracking-[0.16em] font-medium hover:bg-[#D8BB7B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Inquire {activeItem.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handlePortfolioClick}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-white/10 text-white text-xs font-mono uppercase tracking-[0.16em] text-center border border-white/20 cursor-pointer"
                  >
                    View Stories
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Bottom Navigation Controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <div className="flex items-center gap-1.5">
              {servicesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveService(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeService === idx ? 'w-8 bg-[#111111]' : 'w-2 bg-[#D4D4D4]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevService}
                aria-label="Previous service"
                className="w-9 h-9 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] flex items-center justify-center text-[#111111] hover:bg-[#EAEAEA] active:scale-95 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextService}
                aria-label="Next service"
                className="w-9 h-9 rounded-full border border-[#E5E5E5] bg-[#F5F5F5] flex items-center justify-center text-[#111111] hover:bg-[#EAEAEA] active:scale-95 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

