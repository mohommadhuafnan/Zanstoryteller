import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { servicesData } from '../data/photographyData'

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0)

  return (
    <section id="services" className="relative w-full bg-[#FAFAFA] text-[#111111] py-28 sm:py-36 md:py-44 px-6 sm:px-12 md:px-20 border-t border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 pb-8 border-b border-[#EAEAEA]">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
              <span className="text-[11px] font-mono tracking-[0.28em] text-[#666666] uppercase">
                Services & Focus
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-none">
              What We Capture
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-sm sm:text-base text-[#666666] font-light max-w-md">
            Photography created around real moments, genuine emotions and unforgettable stories.
          </p>
        </div>

        {/* Editorial Service Accordion / Hover Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Service List (Left Column) */}
          <div className="lg:col-span-7 divide-y divide-[#EAEAEA]">
            {servicesData.map((service, index) => {
              const isActive = activeService === index
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveService(index)}
                  className="py-8 sm:py-10 group cursor-pointer transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-baseline gap-6 sm:gap-10">
                      <span className="font-mono text-sm sm:text-base text-[#999999] group-hover:text-[#111111] transition-colors">
                        {service.number}
                      </span>
                      <div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-[#111111] group-hover:translate-x-2 transition-transform duration-300 uppercase">
                          {service.title}
                        </h3>
                        <p className="mt-2 text-sm text-[#666666] font-light max-w-lg">
                          {service.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-[#EAEAEA] flex items-center justify-center group-hover:bg-[#111111] group-hover:border-[#111111] group-hover:text-white transition-all duration-300 shrink-0 ml-4">
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Expandable details when active */}
                  <div className={`mt-6 pt-4 text-sm text-[#555555] font-light leading-relaxed transition-all duration-300 ${isActive ? 'block opacity-100' : 'hidden md:block md:opacity-40'}`}>
                    <p className="mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                      {service.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-[#777777]">
                          <Check className="w-3 h-3 text-[#111111]" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile image preview when active */}
                  <div className="block lg:hidden mt-6 overflow-hidden rounded-sm aspect-[16/10] bg-[#EEEEEE]">
                    <img
                      src={service.image}
                      alt={service.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Interactive Image Reveal (Right Column) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-32">
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-[#EEEEEE] shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeService}
                  src={servicesData[activeService].image}
                  alt={servicesData[activeService].alt}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase opacity-75">
                    Category {servicesData[activeService].number}
                  </div>
                  <div className="text-lg font-light uppercase tracking-wider">
                    {servicesData[activeService].title}
                  </div>
                </div>
                <div className="text-[11px] font-mono opacity-80">
                  Zanstoryteller Archive
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
