import React, { useState } from 'react'
import { Plus, Trash2, Layers, Sparkles } from 'lucide-react'
import { useCMS } from '../../../context/CMSContext'
import ImageUploadField from '../ImageUploadField'

export default function HeroEditor() {
  const { data, updateHeroSlide, addHeroSlide, deleteHeroSlide } = useCMS()
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isAddingSlide, setIsAddingSlide] = useState(false)
  const [newSlideData, setNewSlideData] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    category: 'WEDDING ARCHIVE',
    location: 'Doha // Archival',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85'
  })

  const slides = data.heroSlides || []
  const currentSlide = slides[activeSlideIndex] || slides[0]

  const handleFieldChange = (field, value) => {
    updateHeroSlide(activeSlideIndex, { [field]: value })
  }

  const handleAddNew = (e) => {
    e.preventDefault()
    if (!newSlideData.title) return
    addHeroSlide(newSlideData)
    setIsAddingSlide(false)
    setActiveSlideIndex(slides.length)
    setNewSlideData({
      title: '',
      subtitle: '',
      tagline: '',
      category: 'EDITORIAL CAMPAIGN',
      location: 'Colombo // 35mm',
      year: '2025',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=85'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#0d1b2a] uppercase font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D8BB7B]" />
            <span>01 / Landing Experience</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Hero Carousel Slides</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the cinematic full-bleed slides that welcome visitors to Zan Storyteller.
          </p>
        </div>

        <button
          onClick={() => setIsAddingSlide(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d1b2a] hover:bg-[#1b263b] text-white text-xs font-medium uppercase tracking-wider rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D8BB7B]" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Slide Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {slides.map((s, idx) => (
          <button
            key={s.id || idx}
            onClick={() => setActiveSlideIndex(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-2.5 ${
              activeSlideIndex === idx
                ? 'bg-[#0d1b2a] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeSlideIndex === idx ? 'bg-[#D8BB7B]' : 'bg-slate-300'}`} />
            <span>Slide {idx + 1}: {s.title || 'Untitled'}</span>
          </button>
        ))}
      </div>

      {/* Current Slide Editor Card */}
      {currentSlide && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-mono font-semibold">
                SLIDE #{activeSlideIndex + 1}
              </span>
              <h3 className="font-semibold text-slate-900 text-base">
                {currentSlide.title}
              </h3>
            </div>

            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete slide "${currentSlide.title}"?`)) {
                    deleteHeroSlide(activeSlideIndex)
                    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Slide</span>
              </button>
            )}
          </div>

          {/* Image Upload Field */}
          <ImageUploadField
            label="Hero Background Image"
            currentImage={currentSlide.image}
            onImageChange={(newImg) => handleFieldChange('image', newImg)}
            onImageDelete={() => handleFieldChange('image', '')}
            aspectHint="Cinematic Landscape (1920×1080 or 2560×1440)"
          />

          {/* Text Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Slide Title
              </label>
              <input
                type="text"
                value={currentSlide.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
                placeholder="e.g. The Grand Promenade"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={currentSlide.subtitle || ''}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
                placeholder="e.g. Archival Celebrations"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Tagline / Description Text
              </label>
              <textarea
                rows={2}
                value={currentSlide.tagline || ''}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none resize-none"
                placeholder="Brief evocative description shown over the image"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Category Badge
              </label>
              <input
                type="text"
                value={currentSlide.category || ''}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
                placeholder="e.g. WEDDING ARCHIVE"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Location & Camera Tag
              </label>
              <input
                type="text"
                value={currentSlide.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
                placeholder="e.g. Doha // Archival"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Archive Year
              </label>
              <input
                type="text"
                value={currentSlide.year || ''}
                onChange={(e) => handleFieldChange('year', e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-[#0d1b2a] outline-none"
                placeholder="e.g. 2025"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add New Slide Modal */}
      {isAddingSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-1">
              Add New Hero Slide
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Create a new full-screen editorial visual for the main landing banner.
            </p>

            <form onSubmit={handleAddNew} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newSlideData.title}
                  onChange={(e) => setNewSlideData({ ...newSlideData, title: e.target.value })}
                  placeholder="e.g. Whispers of Galle Fort"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={newSlideData.subtitle}
                  onChange={(e) => setNewSlideData({ ...newSlideData, subtitle: e.target.value })}
                  placeholder="e.g. Architectural Vows"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Tagline
                </label>
                <textarea
                  rows={2}
                  value={newSlideData.tagline}
                  onChange={(e) => setNewSlideData({ ...newSlideData, tagline: e.target.value })}
                  placeholder="Evocative description"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newSlideData.category}
                    onChange={(e) => setNewSlideData({ ...newSlideData, category: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newSlideData.year}
                    onChange={(e) => setNewSlideData({ ...newSlideData, year: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Slide Image"
                currentImage={newSlideData.image}
                onImageChange={(img) => setNewSlideData({ ...newSlideData, image: img })}
                onImageDelete={() => setNewSlideData({ ...newSlideData, image: '' })}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingSlide(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#0d1b2a] text-white rounded-xl shadow-md hover:bg-[#1b263b] transition"
                >
                  Create Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
