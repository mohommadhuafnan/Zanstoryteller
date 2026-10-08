import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { aboutData as defaultAboutData } from '../data/photographyData'
import { useCMS } from '../context/CMSContext'
import { getOptimizedImageUrl } from '../utils/imageOptimizer'

export default function AboutSection() {
  const { data } = useCMS()
  const aboutData = data?.aboutData || defaultAboutData
  return (
    <section id="about" className="relative w-full bg-[#FFFFFF] text-[#111111] py-20 sm:py-28 md:py-36 px-6 sm:px-12 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Philosophy & Copy */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Small Label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#666666] uppercase">
                {aboutData.label}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-[1.08] mb-8 whitespace-pre-line">
              {aboutData.heading || (
                <>
                  We don't just <br />
                  <span className="font-serif italic font-normal text-[#111111] lowercase tracking-normal">capture moments.</span> <br />
                  We tell stories.
                </>
              )}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-5 text-base sm:text-lg text-[#555555] font-light leading-relaxed max-w-xl mb-10">
              {(aboutData.paragraphs || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Discover Button */}
            <a
              href="#portfolio"
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#111111] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 hover:bg-[#222222] hover:shadow-lg cursor-pointer"
            >
              <span>{aboutData.ctaText}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Supporting meta badge */}
            <div className="mt-12 pt-8 border-t border-[#EAEAEA] w-full flex items-center justify-between text-[11px] font-mono tracking-widest text-[#888888] uppercase">
              <span>{aboutData.badge}</span>
              <span>Visual Documentary</span>
            </div>
          </motion.div>

          {/* Right Column: Fine-Art Editorial Portrait Presentation */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center relative select-none"
          >
            {/* Gallery Frame Wrapper with Offset Architectural Backplate */}
            <div className="group relative w-full max-w-[340px] sm:max-w-[390px] md:max-w-[430px] lg:max-w-[450px]">
              
              {/* Offset Fine Architectural Backplate Frame */}
              <div 
                className="absolute -inset-2.5 sm:-inset-3 border border-[#111111]/15 rounded-sm translate-x-2.5 translate-y-2.5 sm:translate-x-3 sm:translate-y-3 -z-10 transition-transform duration-500 ease-out group-hover:translate-x-3.5 group-hover:translate-y-3.5" 
                aria-hidden="true"
              />

              {/* Main Portrait Card with Film Border, Shadow & Darkroom Treatment */}
              <div className="relative overflow-hidden rounded-sm bg-[#0d1b2a] shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-[#111111]/10 aspect-[4/5]">
                <img
                  src={getOptimizedImageUrl(aboutData.image, { width: 900 })}
                  alt={aboutData.imageAlt}
                  width="824"
                  height="1024"
                  className="w-full h-full object-cover object-top filter grayscale contrast-[1.08] transition-all duration-700 ease-out group-hover:scale-[1.025] group-hover:contrast-[1.12]"
                  loading="lazy"
                  decoding="async"
                />

                {/* Subtle darkroom film gradient vignette at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Film Frame Technical Corner Registration Marks */}
                <div className="absolute top-3.5 left-3.5 w-2.5 h-2.5 border-t border-l border-white/50 pointer-events-none" />
                <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 border-t border-r border-white/50 pointer-events-none" />
                <div className="absolute bottom-20 left-3.5 w-2.5 h-2.5 border-b border-l border-white/50 pointer-events-none" />
                <div className="absolute bottom-20 right-3.5 w-2.5 h-2.5 border-b border-r border-white/50 pointer-events-none" />

                {/* Inset Editorial Tag */}
                <div className="absolute top-3.5 left-7 text-[9px] font-mono tracking-[0.25em] text-white/60 uppercase pointer-events-none">
                  ATELIER // 01
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-col justify-end text-white pointer-events-none">
                  <div className="flex items-center justify-between pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-xs sm:text-sm font-sans tracking-[0.22em] font-medium uppercase text-white">
                        Mohammad Zan
                      </span>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
                      Founder
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/20 text-[10px] font-mono tracking-widest text-white/55 uppercase">
                    <span>Cinematographer</span>
                    <span>Director of Photography</span>
                  </div>
                </div>
              </div>

              {/* Minimal Archival Caption Below Portrait */}
              <div className="mt-3.5 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-[#888888] uppercase px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#111111]" />
                  Natural Light Specialist
                </span>
                <span>Archival Studio</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
