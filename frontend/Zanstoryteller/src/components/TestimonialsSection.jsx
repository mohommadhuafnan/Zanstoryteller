import React from 'react'
import { motion } from 'framer-motion'
import { testimonialsData } from '../data/photographyData'
import { Quote } from 'lucide-react'

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative z-10 w-full bg-[#FFFFFF] text-[#111111] py-28 sm:py-36 md:py-44 px-6 sm:px-12 md:px-20 border-t border-[#EAEAEA] shadow-[0_-25px_60px_rgba(0,0,0,0.45)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 sm:mb-28 pb-8 border-b border-[#EAEAEA]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#666666] uppercase">
                Client Reflections
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-[1.08]">
              Words From <br />
              <span className="font-serif italic font-normal text-[#111111] lowercase tracking-normal">the people we've</span> <br />
              Photographed.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm sm:text-base text-[#666666] font-light max-w-sm">
            Genuine experiences shared by the couples, artists, and families who trusted our vision.
          </p>
        </div>

        {/* 3 Editorial Testimonial Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {testimonialsData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between p-8 sm:p-10 rounded-sm bg-[#FAFAFA] border border-[#EAEAEA] hover:border-[#111111] transition-all duration-300 group"
            >
              <div>
                <Quote className="w-6 h-6 text-[#999999] mb-6 group-hover:text-[#111111] transition-colors" />
                <p className="text-base sm:text-lg text-[#222222] font-light leading-relaxed mb-8 italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#EAEAEA]">
                <div className="text-base font-medium text-[#111111] tracking-wide uppercase">
                  {item.author}
                </div>
                <div className="text-xs text-[#777777] font-light mt-1">
                  {item.role}
                </div>
                <div className="text-[10px] font-mono text-[#999999] uppercase tracking-wider mt-2">
                  {item.date}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
