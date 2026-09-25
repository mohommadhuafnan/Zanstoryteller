import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Mail } from 'lucide-react'
import { finalCTAData } from '../data/photographyData'

export default function FinalCTA() {
  return (
    <section id="contact" className="relative z-10 w-full bg-[#050505] text-white py-32 sm:py-44 px-6 sm:px-12 md:px-20 overflow-hidden">
      {/* Subtle Ambient Background Glow & Photo Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src={finalCTAData.bgImage}
          alt="Atmospheric landscape"
          className="w-full h-full object-cover filter blur-[2px]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/70">
            {finalCTAData.label}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white uppercase leading-[1.04] mb-8"
        >
          Ready To <br />
          <span className="font-serif italic font-normal text-white/95 lowercase tracking-normal">tell your</span> <br />
          Story?
        </motion.h2>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/70 font-light max-w-xl mb-12 leading-relaxed"
        >
          {finalCTAData.supporting}
        </motion.p>

        {/* Dual Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          <a
            href="#portfolio"
            className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-medium rounded-sm transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] w-full sm:w-auto"
          >
            <span>{finalCTAData.primaryCTA}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="mailto:hello@zanstoryteller.com"
            className="inline-flex items-center justify-center gap-2.5 px-9 py-4 border border-white/25 hover:border-white text-white font-mono text-xs uppercase tracking-[0.2em] rounded-sm transition-all duration-300 hover:bg-white/[0.05] w-full sm:w-auto"
          >
            <Mail className="w-3.5 h-3.5 text-white/70" />
            <span>{finalCTAData.secondaryCTA}</span>
          </a>
        </motion.div>

        {/* Inquiries Note */}
        <div className="mt-14 text-[10px] font-mono tracking-widest text-white/40 uppercase">
          Inquiries answered within 24 hours // Colombo • Available Internationally
        </div>
      </div>
    </section>
  )
}
