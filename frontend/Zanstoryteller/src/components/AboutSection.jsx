import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { aboutData } from '../data/photographyData'

export default function AboutSection() {
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
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-[1.08] mb-8">
              We don't just <br />
              <span className="font-serif italic font-normal text-[#111111] lowercase tracking-normal">capture moments.</span> <br />
              We tell stories.
            </h2>

            {/* Paragraphs */}
            <div className="space-y-5 text-base sm:text-lg text-[#555555] font-light leading-relaxed max-w-xl mb-10">
              {aboutData.paragraphs.map((para, i) => (
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

          {/* Right Column: Seamless Editorial Subject (No Box, No Border, Zero Crop) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-center lg:items-end justify-center relative select-none"
          >
            {/* Uncropped subject sitting naturally on the white canvas */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[470px] lg:max-w-[500px] xl:max-w-[520px]">
              
              {/* Soft organic ground contact shadow under chair & shoes */}
              <div 
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-black/[0.08] blur-xl rounded-[100%] pointer-events-none" 
                aria-hidden="true"
              />

              {/* Natural uncropped image standing directly on the canvas without any borders */}
              <img
                src={aboutData.image}
                alt={aboutData.imageAlt}
                className="w-full h-auto object-contain block filter contrast-[1.03] select-none pointer-events-none"
                loading="lazy"
                decoding="async"
              />

              {/* Minimal Editorial Monogram Stamp */}
              <div className="absolute -bottom-5 right-2 sm:right-4 flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-[#888888] uppercase select-none pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                <span>MOHAMMAD ZAN // FOUNDER</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
