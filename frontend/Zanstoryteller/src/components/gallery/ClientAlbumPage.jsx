import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, X, Maximize2, Calendar, MapPin } from 'lucide-react'
import { getCategoryBySlug, getClientAlbum } from '../../data/galleryCategoriesData'

export default function ClientAlbumPage({ categorySlug, clientSlug, onNavigate }) {
  const category = getCategoryBySlug(categorySlug)
  const client = getClientAlbum(categorySlug, clientSlug)
  const [activePhotoIndex, setActivePhotoIndex] = useState(null)

  // Fallback if client not found
  if (!client) {
    return (
      <div className="min-h-screen bg-white text-[#111111] pt-36 pb-24 px-6 text-center">
        <h2 className="text-2xl font-light uppercase">Album Not Found</h2>
        <button
          onClick={() => onNavigate(`/gallery/${categorySlug}`)}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] text-white font-mono text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {category.title}</span>
        </button>
      </div>
    )
  }

  // Keyboard controls for lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePhotoIndex(null)
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % client.images.length)
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + client.images.length) % client.images.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePhotoIndex, client.images.length])

  return (
    <div className="min-h-screen bg-white text-[#111111] pt-28 pb-32 px-6 sm:px-10 md:px-16 selection:bg-[#111111] selection:text-white">
      <div className="max-w-7xl mx-auto">

        {/* Top Back Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#EAEAEA]">
          <button
            type="button"
            onClick={() => onNavigate(`/gallery/${category.slug}`)}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {category.title}</span>
          </button>

          <div className="text-[11px] font-mono tracking-widest text-[#999999] uppercase">
            {category.title} // {client.name}
          </div>
        </div>

        {/* Client Story Album Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <span className="text-[11px] font-mono tracking-[0.28em] text-[#888888] uppercase block mb-3">
            Client Archive Story
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#111111] uppercase leading-none mb-6">
            {client.name}
          </h1>

          {client.title && (
            <p className="text-lg sm:text-xl text-[#555555] font-light mb-6">
              {client.title}
            </p>
          )}

          {/* Meta Details */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#777777] uppercase tracking-wider pt-4 border-t border-[#F0F0F0]">
            {client.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#999999]" />
                <span>{client.date}</span>
              </div>
            )}
            {client.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#999999]" />
                <span>{client.location}</span>
              </div>
            )}
            <div className="text-[#999999]">
              {client.images.length} Curated Photographs
            </div>
          </div>
        </div>

        {/* 
          Full Client Image Gallery:
          Displays every single image for this client!
          Sizes dynamically adapt to natural image aspect ratios without cropping!
        */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {client.images.map((imgUrl, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setActivePhotoIndex(idx)}
              className="group relative break-inside-avoid overflow-hidden rounded-md bg-[#F5F5F5] border border-[#EAEAEA] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={imgUrl}
                alt={`${client.name} photo ${idx + 1}`}
                loading="lazy"
                className="w-full h-auto block object-contain transition-transform duration-700 ease-out group-hover:scale-103 filter saturate-[0.98]"
              />

              {/* Hover overlay with expand icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Booking CTA */}
        <div className="mt-24 pt-16 border-t border-[#EAEAEA] flex flex-col md:flex-row items-center justify-between gap-8 bg-[#FAFAFA] p-8 sm:p-12 rounded-lg">
          <div>
            <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-[#111111]">
              Interested in a session like this?
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#666666] font-light max-w-lg">
              We capture genuine moments, authentic connections, and timeless memories worldwide.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/book-session')}
            className="px-8 py-4 bg-[#111111] text-white font-mono text-xs uppercase tracking-[0.2em] rounded-sm hover:bg-[#222222] transition-colors cursor-pointer whitespace-nowrap shadow-md"
          >
            Book Your Session
          </button>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActivePhotoIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActivePhotoIndex((prev) => (prev - 1 + client.images.length) % client.images.length)
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActivePhotoIndex((prev) => (prev + 1) % client.images.length)
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            <motion.div
              key={activePhotoIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={client.images[activePhotoIndex]}
                alt={`${client.name} photo ${activePhotoIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
              />
              <div className="mt-3 text-center text-white/70 text-xs font-mono tracking-widest uppercase">
                {client.name} — {activePhotoIndex + 1} of {client.images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
