import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { portfolioCategories, portfolioItems } from '../data/photographyData'

export default function FeaturedStories() {
  const [selectedCategory, setSelectedCategory] = useState("ALL")

  const filteredItems = selectedCategory === "ALL"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory)

  return (
    <section id="portfolio" className="relative w-full bg-[#FFFFFF] text-[#111111] py-28 sm:py-36 md:py-44 px-6 sm:px-12 md:px-20 border-t border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#666666] uppercase">
                Featured Stories
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#111111] uppercase leading-[1.04]">
              Moments <br />
              <span className="font-serif italic font-normal text-[#111111] lowercase tracking-normal">worth</span> <br />
              Remembering.
            </h2>
          </div>

          <div className="mt-8 lg:mt-0 flex flex-col items-start lg:items-end gap-6">
            <p className="text-sm sm:text-base text-[#666666] font-light max-w-sm lg:text-right">
              A curated selection of authentic stories captured through our lens worldwide.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {portfolioCategories.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[11px] font-mono tracking-widest px-4 py-2 uppercase transition-all duration-300 rounded-full ${
                      isActive
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F5F5F5] text-[#666666] hover:text-[#111111] hover:bg-[#EAEAEA]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Asymmetric Photography Grid */}
        <motion.div
          layout
          className="grid grid-cols-12 gap-6 sm:gap-8 md:gap-10"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`${item.colSpan} group relative rounded-sm overflow-hidden bg-[#F5F5F5] shadow-sm`}
              >
                <div className={`w-full ${item.aspect} relative overflow-hidden`}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center filter saturate-[0.96] transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Elegant Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

                  {/* Corner Category Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-sm bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {/* Bottom Metadata & Hover Reveal */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 flex items-end justify-between text-white">
                    <div>
                      <div className="text-[11px] font-mono tracking-widest text-white/70 uppercase mb-1">
                        {item.location} • {item.year}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-light tracking-wide uppercase">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-white/90 group-hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300">
                      <span>View Story</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Portfolio Count */}
        <div className="mt-16 pt-8 border-t border-[#EAEAEA] flex items-center justify-between text-[11px] font-mono text-[#888888] uppercase">
          <span>Showing {filteredItems.length} of {portfolioItems.length} Featured Works</span>
          <a href="#contact" className="hover:text-[#111111] transition-colors underline underline-offset-4">
            Request Complete Portfolio Archive →
          </a>
        </div>

      </div>
    </section>
  )
}
