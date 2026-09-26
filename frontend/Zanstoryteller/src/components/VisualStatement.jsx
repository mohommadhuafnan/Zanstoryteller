import React from 'react'
import { visualStatementData } from '../data/photographyData'

export default function VisualStatement() {
  return (
    <section
      className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505] text-white z-0"
    >
      {/* Static Background Photo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={visualStatementData.image}
          alt={visualStatementData.alt}
          className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.08]"
          loading="lazy"
          decoding="async"
        />
        
        {/* Soft Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_95%)] pointer-events-none" />
      </div>

      {/* Static Cinematic Statement Copy */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/80">
            {visualStatementData.label}
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight uppercase leading-[1.04] mb-8 text-white">
          Your Moments <br />
          <span className="font-serif italic font-normal text-white/95 lowercase tracking-normal">deserve</span> <br />
          To Be Remembered.
        </h2>

        <p className="text-base sm:text-lg text-white/70 font-light max-w-md mx-auto tracking-wide">
          {visualStatementData.subtext}
        </p>
      </div>
    </section>
  )
}

