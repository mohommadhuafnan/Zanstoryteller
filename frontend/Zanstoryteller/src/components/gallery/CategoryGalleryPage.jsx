import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { GALLERY_CATEGORIES, getCategoryBySlug } from '../../data/galleryCategoriesData'

export default function CategoryGalleryPage({ categorySlug, onNavigate }) {
  const currentCategory = getCategoryBySlug(categorySlug)

  return (
    <div className="min-h-screen bg-white text-[#111111] pt-28 pb-32 px-6 sm:px-10 md:px-16 selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between pb-8 mb-12 border-b border-[#EAEAEA]">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="text-[11px] font-mono tracking-widest text-[#999999] uppercase">
            Portfolio Archive // {currentCategory.title}
          </div>
        </div>

        {/* Editorial Header (Matching Screenshot 4) */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-[#333333] mb-6"
          >
            {currentCategory.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base text-[#666666] font-light leading-relaxed max-w-2xl mx-auto"
          >
            {currentCategory.description}
          </motion.p>

          {/* Category Quick Filter Pills (All 14 Categories in Capital Letters) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 pt-6 border-t border-[#F0F0F0]">
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = cat.slug === currentCategory.slug
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onNavigate(`/gallery/${cat.slug}`)}
                  className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-sm'
                      : 'bg-[#F5F5F5] text-[#777777] hover:bg-[#EAEAEA] hover:text-[#111111]'
                  }`}
                >
                  {cat.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* 
          Client Story Albums Grid:
          Directly displayed in the window (no toggle buttons needed as requested).
          Masonry layout based on each photo's natural height and width, exactly matching user screenshot.
          Cards stack seamlessly underneath each other without empty row gaps.
        */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {currentCategory.clients.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              onClick={() => onNavigate(`/gallery/${currentCategory.slug}/${client.slug}`)}
              className="group cursor-pointer break-inside-avoid overflow-hidden rounded-md bg-white border border-[#EAEAEA] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col mb-6"
            >
              {/* Client Cover Image - natural adaptive height and width based on photo */}
              <div className="relative w-full overflow-hidden bg-[#F5F5F5]">
                <img
                  src={client.coverImage}
                  alt={client.name}
                  loading="lazy"
                  className="w-full h-auto block object-cover transition-transform duration-700 ease-out group-hover:scale-103 filter saturate-[0.98]"
                />

                {/* Hover Dark Overlay with "SEE ALBUM" text (Matching Screenshot 5) */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-serif italic text-white text-base sm:text-lg tracking-wider border-b border-white/60 pb-1">
                    SEE ALBUM ({client.images?.length || 10} PHOTOS)
                  </span>
                </div>
              </div>

              {/* White Footer with Client Name in Uppercase */}
              <div className="py-5 px-6 bg-white text-center border-t border-[#F0F0F0]">
                <h3 className="font-sans text-xs sm:text-sm tracking-[0.28em] text-[#444444] uppercase font-normal group-hover:text-[#111111] transition-colors">
                  {client.name}
                </h3>
                {client.title && (
                  <p className="text-[11px] text-[#888888] font-light mt-1">
                    {client.title}
                  </p>
                )}
                <span className="inline-block mt-2 text-[10px] font-mono tracking-widest text-[#999999] uppercase">
                  {client.images?.length || 10} Curated Photos →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  )
}
