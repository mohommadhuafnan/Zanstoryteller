import React from 'react'
import { motion } from 'framer-motion'
import { processSteps } from '../data/photographyData'

export default function ProcessSection() {
  return (
    <section id="process" className="relative z-10 w-full bg-[#FFFFFF] text-[#111111] py-28 sm:py-36 md:py-44 px-6 sm:px-12 md:px-20 border-t border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 sm:mb-28 pb-8 border-b border-[#EAEAEA]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#666666] uppercase">
                The Experience
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-none">
              From Moment <br className="sm:hidden" />
              <span className="font-serif italic font-normal text-[#111111] lowercase tracking-normal">to</span> Memory.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm sm:text-base text-[#666666] font-light max-w-sm">
            A quiet, collaborative process designed to keep you present while we preserve your story.
          </p>
        </div>

        {/* 4-Step Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between p-8 rounded-sm bg-[#FAFAFA] border border-[#EAEAEA] hover:border-[#111111] transition-colors duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-2xl font-light text-[#999999] group-hover:text-[#111111] transition-colors">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-1 bg-white border border-[#EAEAEA] rounded text-[#777777]">
                    {step.tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-light uppercase tracking-wide text-[#111111] mb-4">
                  {step.title}
                </h3>

                <p className="text-sm text-[#666666] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-[10px] font-mono text-[#999999] uppercase">
                <span>Phase {step.number}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
