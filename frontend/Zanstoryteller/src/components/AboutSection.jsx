import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { aboutData } from '../data/photographyData'

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full bg-[#FFFFFF] text-[#111111] py-28 sm:py-36 md:py-44 px-6 sm:px-12 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Editorial Philosophy & Copy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
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
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#111111] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 hover:bg-[#222222] hover:shadow-lg"
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

          {/* Right Column: Large Editorial Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-lg mx-auto overflow-hidden rounded-sm bg-[#F5F5F5] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <img
                src={aboutData.image}
                alt={aboutData.imageAlt}
                className="w-full h-full object-cover object-center filter saturate-[0.95] contrast-[1.02] transition-transform duration-700 hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white text-[10px] font-mono tracking-widest uppercase">
                Zanstoryteller Editorial Archive // 01
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
